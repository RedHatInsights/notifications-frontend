import * as React from 'react';
import { useContext } from 'react';
import {
    Action,
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
import assertNever from 'assert-never';
import { getNotificationActionsByIdAction, getNotificationByIdActionDecoder } from '../../../services/useGetNotificationActions';
import { actionRemoveActionFromNotification } from '../../../services/useRemoveActionFromNotification';
import { actionAddActionToNotification } from '../../../services/useAddActionToNotification';
import { actionPostEndpoints, EndpointType } from '../../../generated/Openapi';

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
        const idMapper = (a: Action) => {
            if (a.type !== NotificationType.INTEGRATION) {
                throw new Error('Only integrations are supported');
            }

            return a.integration.id;
        };

        const type = props.type;
        if (type !== 'notification' && type !== 'default') {
            assertNever(type);
        }

        let oldActions: Array<Action> | undefined;
        let oldUseDefault: boolean | undefined;
        if (props.type === 'default') {
            oldActions = await query(defaultNotificationBehaviorCreator())
            .then(r => r.payload ? defaultNotificationsDecoder(r.payload) : r.payload)
            .then(p => p?.type === 'DefaultNotificationBehavior' ? p.value.actions : undefined);

            oldUseDefault = false;
        } else if (props.type === 'notification') {
            const id = props.data.id;
            const actionsPromise = query(getNotificationActionsByIdAction(id));

            oldActions = await actionsPromise
            .then(r => r.payload ? getNotificationByIdActionDecoder(r.payload) : r.payload)
            .then(p => p?.type === 'actionsArray' ? p.value : undefined);

            oldUseDefault = await actionsPromise
            .then(p => p.payload?.type === 'GetNotificationsEventTypesByEventTypeIdParamResponse200' ? p.payload.value : undefined)
            .then(v => v?.findIndex(a => a.type === EndpointType.enum.default))
            .then(v => v === undefined ? undefined : v !== -1);
        }

        const newUseDefault = props.type === 'notification' ? (data as Notification).useDefault : false;
        let defaultActionId: string | undefined;

        if (newUseDefault !== oldUseDefault) {
            defaultActionId = await query(actionPostEndpoints({
                body: {
                    type: EndpointType.enum.default,
                    name: 'Default endpoint type',
                    description: '',
                    enabled: true,
                    properties: null
                }
            }))
            .then(p => p.payload?.type === 'Endpoint' ? p.payload.value.id as string : undefined);
        } else {
            defaultActionId = 'nothing';
        }

        if (!oldActions || oldUseDefault === undefined || defaultActionId === undefined) {
            addDangerNotification('Error updating actions', 'Failed to update actions. Please try again.');
            return false;
        }

        const originalIds = oldActions.map(idMapper);
        const newIds = data.actions.map(idMapper);

        let toDelete: Array<string>;
        let toAdd: Array<string>;

        if (newUseDefault) {
            toDelete = originalIds.reduce<Array<string>>((arr, val) => {
                if (!arr.includes(val)) {
                    arr.push(val);
                }

                return arr;
            }, []);

            if (!oldUseDefault) {
                toAdd = [ defaultActionId ];
            } else {
                toAdd = [];
            }

        } else {
            toDelete = originalIds.reduce<Array<string>>((arr, val) => {
                if (!newIds.includes(val) && !arr.includes(val)) {
                    arr.push(val);
                }

                return arr;
            }, []);

            if (oldUseDefault) {
                toDelete.push(defaultActionId);
            }

            toAdd = newIds.reduce<Array<string>>((arr, val) => {
                if (!originalIds.includes(val) && !arr.includes(val)) {
                    arr.push(val);
                }

                return arr;
            }, []);
        }

        const limit = pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS);

        if (toAdd.length === 0 && toDelete.length === 0) {
            // Nothing to update, display to the user that all was updated?
            addSuccessNotification('Actions updated', 'All the actions were updated.');
            return true;
        }

        const promises: Array<Promise<boolean>> = [];

        if (props.type === 'notification') {
            const notificationId = props.data.id;
            promises.push(...toDelete.map(id => limit(() =>
                query(actionRemoveActionFromNotification(notificationId, id)).then(r => r.status === 200))));
            promises.push(...toAdd.map(id => limit(() => query(actionAddActionToNotification(notificationId, id)).then(r => r.status === 200))));
        } else if (props.type === 'default') {
            promises.push(...toDelete.map(id => limit(() => query(actionRemoveActionFromDefault(id)).then(r => r.status === 200))));
            promises.push(...toAdd.map(id => limit(() => query(actionAddActionToDefault(id)).then(r => r.status === 200))));
        }

        const saved = await Promise.all(promises.map(p => p.catch(() => false))).then(all => all.every(e => e));

        if (saved) {
            addSuccessNotification('Actions updated', 'All the actions were updated.');
        } else {
            addDangerNotification('Actions not added/removed', 'Some actions were not correctly added or removed. Please try again.');
        }

        return saved;
    }, [ props.type, query, props.data ]);

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
