import {
    addDangerNotification,
    addSuccessNotification,
    Filter,
    Operator,
    Page
} from '@redhat-cloud-services/insights-common-typescript';
import assertNever from 'assert-never';
import pLimit from 'p-limit';
import * as React from 'react';
import { useContext } from 'react';
import { ClientContext } from 'react-fetching-library';

import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';
import {
    getDefaultActionIdAction,
    getDefaultActionIdDecoder
} from '../../../services/Notifications/GetDefaultActionId';
import { actionAddActionToDefault } from '../../../services/useAddActionToDN';
import { actionAddActionToNotification } from '../../../services/useAddActionToNotification';
import {
    defaultNotificationBehaviorCreator,
    defaultNotificationsDecoder
} from '../../../services/useDefaultNotificationBehavior';
import {
    getNotificationActionsByIdAction,
    getNotificationByIdActionDecoder,
    hasDefaultNotificationDecoder
} from '../../../services/useGetNotificationActions';
import {
    listIntegrationIntegrationDecoder,
    listIntegrationsActionCreator
} from '../../../services/useListIntegrations';
import { actionRemoveActionFromDefault } from '../../../services/useRemoveActionFromDN';
import { actionRemoveActionFromNotification } from '../../../services/useRemoveActionFromNotification';
import { createIntegrationActionCreator } from '../../../services/useSaveIntegration';
import { IntegrationType, UserIntegrationType } from '../../../types/Integration';
import {
    Action,
    DefaultNotificationBehavior,
    IntegrationRef,
    Notification,
    NotificationType
} from '../../../types/Notification';

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

    const getIntegrations = React.useCallback(async (type: UserIntegrationType, _search: string) => {
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

            if (payload?.type === 'IntegrationPage') {
                integrations = payload.value.data;
            }

            return integrations;
        });
    }, [ query ]);

    const onSave = React.useCallback(async (data: Notification | DefaultNotificationBehavior) => {
        const idMapper = (a: Action) => {
            if (a.type !== NotificationType.INTEGRATION && a.type !== NotificationType.EMAIL_SUBSCRIPTION) {
                throw new Error('Only integrations and EmailSubscription are supported');
            }

            return a.integrationId;
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
            .then(r => r.payload ? hasDefaultNotificationDecoder(r.payload) : r.payload)
            .then(p => p?.type === 'defaultNotification' ? p.value : undefined);
        }

        const newUseDefault = props.type === 'notification' ? (data as Notification).useDefault : false;
        let defaultActionId: string | undefined;

        if (newUseDefault !== oldUseDefault) {
            defaultActionId = await query(getDefaultActionIdAction())
            .then(r => r.payload ? getDefaultActionIdDecoder(r.payload) : undefined)
            .then(p => p?.type === 'DefaultNotificationId' ? p.value : undefined);
        } else {
            defaultActionId = 'nothing';
        }

        if (!oldActions || oldUseDefault === undefined || defaultActionId === undefined) {
            addDangerNotification('Error updating actions', 'Failed to update actions. Please try again.');
            return false;
        }

        const limit = pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS);

        const originalIds = oldActions.map(idMapper);
        const newIds = data.actions.map((a, i) => a.integrationId === '' ? { ...a, integrationId: `new${i}` } : a).map(idMapper);

        const nonUserIntegrationsPromises: Array<Promise<boolean>> = [];

        data.actions.map((a, index) => {
            if (a.integrationId === '' && a.type === NotificationType.EMAIL_SUBSCRIPTION) {
                nonUserIntegrationsPromises.push(limit(() => {
                    return query(createIntegrationActionCreator({
                        type: IntegrationType.EMAIL_SUBSCRIPTION,
                        name: 'Email subscription',
                        isEnabled: true
                    }))
                    .then(r => r.payload?.type === 'Endpoint' ? r.payload.value.id : undefined)
                    .then(id => {
                        if (id) {
                            // Sanity check
                            if (newIds[index] !== `new${index}`) {
                                throw new Error(`Sync error, expected new${index} but found ${newIds[index]}`);
                            }

                            newIds[index] = id;
                            return true;
                        }

                        return false;
                    });
                }));
                // New, we need add this integration
            }
        });

        if (nonUserIntegrationsPromises.length) {
            const created = await Promise.all(nonUserIntegrationsPromises.map(p => p.catch(() => false))).then(all => all.every(e => e));
            if (!created) {
                addDangerNotification('Actions not added/removed', 'Some actions were not correctly added or removed. Please try again.');
                return false;
            }
        }

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
