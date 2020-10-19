import * as React from 'react';
import { useContext } from 'react';
import {
    DefaultNotificationBehavior,
    IntegrationRef,
    Notification,
    NotificationType
} from '../../../types/Notification';
import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';
import { IntegrationType } from '../../../types/Integration';
import {
    listIntegrationIntegrationDecoder,
    listIntegrationsActionCreator
} from '../../../services/useListIntegrations';
import { ClientContext } from 'react-fetching-library';
import {
    addDangerNotification,
    addSuccessNotification,
    Filter,
    Operator,
    Page
} from '@redhat-cloud-services/insights-common-typescript';
import pLimit from 'p-limit';
import { actionRemoveActionFromDefault } from '../../../services/useRemoveActionFromDN';
import { actionAddActionToDefault } from '../../../services/useAddActionToDN';
import {
    defaultNotificationBehaviorCreator,
    defaultNotificationsDecoder
} from '../../../services/useDefaultNotificationBehavior';

interface EditNotificationPagePropsNotification {
    type: 'notification';
    data: Notification;
}

interface EditNotificationPagePropsDefault {
    type: 'default';
    data: DefaultNotificationBehavior;
}

export type EditNotificationPageProps = {
    onClose: (saved: boolean) => void;
} & (EditNotificationPagePropsNotification | EditNotificationPagePropsDefault);

const recipients = [
    'Admin',
    'Another one',
    'Default user access',
    'Security admin',
    'Stakeholders'
];

const getRecipients = async (search: string) => {
    if (search !== '') {
        search = search.toLowerCase();
        return recipients.filter(r => r.toLowerCase().includes(search));
    }

    return recipients;
};

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export const EditNotificationPage: React.FunctionComponent<EditNotificationPageProps> = (props) => {

    const { query } = useContext(ClientContext);

    const getIntegrations = React.useCallback(async (type: IntegrationType, _search: string) => {
        return query(listIntegrationsActionCreator(
            Page.of(
                1,
                20,
                new Filter()
                .and('type', Operator.EQUAL, type)
            )
        )).then(response => {
            let integrations: Array<IntegrationRef> = [];
            const payload = response.payload ? listIntegrationIntegrationDecoder(response.payload) : undefined;

            if (payload?.type === 'integrationArray') {
                integrations = payload.value;
            }

            return integrations;
        });
    }, [ query ]);

    const onSave = React.useCallback(async (data: Notification | DefaultNotificationBehavior) => {
        if (props.type === 'notification') {
            throw new Error('Not yet supported');
        }

        const idMapper = a => {
            if (a.type !== NotificationType.INTEGRATION) {
                throw new Error('Only integrations are supported');
            }

            return a.integration.id;
        };

        const oldActions = await query(defaultNotificationBehaviorCreator())
        .then(r => r.payload ? defaultNotificationsDecoder(r.payload) : r.payload)
        .then(p => p?.type === 'DefaultNotificationBehavior' ? p.value.actions : undefined);

        if (!oldActions) {
            addDangerNotification('Actions not added/removed', 'Some actions were not correctly added or removed. Please try again.');
            return false;
        }

        const originalIds = oldActions.map(idMapper);
        const newIds = data.actions.map(idMapper);

        const toDelete = originalIds.reduce<Array<string>>((arr, val) => {
            if (!newIds.includes(val) && !arr.includes(val)) {
                arr.push(val);
            }

            return arr;
        }, []);

        const toAdd = newIds.reduce<Array<string>>((arr, val) => {
            if (!originalIds.includes(val) && !arr.includes(val)) {
                arr.push(val);
            }

            return arr;
        }, []);

        const limit = pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS);

        if (toAdd.length === 0 && toDelete.length === 0) {
            // Nothing to update, dispĺay to the user that all was updated?
            addSuccessNotification('Actions updated', 'All the actions were updated.');
            return true;
        }

        const promises: Array<Promise<boolean>> = [];
        promises.push(...toDelete.map(id => limit(() => query(actionRemoveActionFromDefault(id)).then(r => r.status === 200))));
        promises.push(...toAdd.map(id => limit(() => query(actionAddActionToDefault(id)).then(r => r.status === 200))));

        const saved = await Promise.all(promises.map(p => p.catch(() => false))).then(all => all.every(e => e));

        if (saved) {
            addSuccessNotification('Actions updated', 'All the actions were updated.');
        } else {
            addDangerNotification('Actions not added/removed', 'Some actions were not correctly added or removed. Please try again.');
        }

        return saved;
    }, [ props.type, query ]);

    return (
        <NotificationSaveModal
            onSave={ onSave }
            isSaving={ false }
            { ...props }
            getRecipients={ getRecipients }
            getIntegrations={ getIntegrations }
        />
    );
};
