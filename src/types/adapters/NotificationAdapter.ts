import { assertNever } from 'assert-never';
import produce, { castDraft } from 'immer';

import { Schemas } from '../../generated/OpenapiNotifications';
import { IntegrationEmailSubscription, ServerIntegrationResponse, UserIntegration } from '../Integration';
import {
    Action, ActionNotify,
    NotificationBase,
    NotificationType,
    ServerNotificationResponse,
    SystemProperties
} from '../Notification';
import { NotificationRecipient } from '../Recipient';
import { toIntegration } from './IntegrationAdapter';

const _toAction = (type: NotificationType, serverAction: ServerIntegrationResponse): Action => {
    if (type === NotificationType.INTEGRATION) {
        const userIntegration = toIntegration(serverAction) as UserIntegration;
        return {
            type,
            integration: userIntegration
        };
    }

    const integration = toIntegration(serverAction) as IntegrationEmailSubscription;

    return {
        type,
        recipient: [ new NotificationRecipient(integration.onlyAdmin) ]
    };
};

export const usesDefault = (endpoints: Array<Schemas.Endpoint>): boolean =>
    endpoints.findIndex(e => e.type === Schemas.EndpointType.enum.default) !== -1;

export const toNotification = (serverNotification: ServerNotificationResponse): NotificationBase => {
    if (!serverNotification.id || !serverNotification.application) {
        throw new Error(`Unexpected notification from server ${JSON.stringify(serverNotification)}`);
    }

    return {
        id: serverNotification.id,
        applicationDisplayName: serverNotification.application.display_name,
        eventTypeDisplayName: serverNotification.display_name
    };
};

export const toAction = (serverAction: ServerIntegrationResponse): Action => {
    switch (serverAction.type) {
        case Schemas.EndpointType.enum.webhook:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case Schemas.EndpointType.enum.camel:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case Schemas.EndpointType.enum.email_subscription:
            return _toAction(NotificationType.EMAIL_SUBSCRIPTION, serverAction);
        case Schemas.EndpointType.enum.default:
            throw new Error('EndpointType.default should not reach this point');
        default:
            assertNever(serverAction.type);
    }
};

export const reduceActions = (actions: ReadonlyArray<Action>): ReadonlyArray<Action> => actions.reduce((actions, current) => {
    return produce(actions, draft => {
        console.log('reading', current.type);
        if (current.type === NotificationType.EMAIL_SUBSCRIPTION) {
            const existingAction = draft.find(a => a.type === current.type) as ActionNotify;
            console.log('existing', existingAction);
            if (existingAction) {
                castDraft(existingAction.recipient).push(current.recipient[0]);
            } else {
                draft.push(castDraft(current));
            }
        } else {
            draft.push(castDraft(current));
        }
    });
}, [] as ReadonlyArray<Action>);

export const toNotifications = (serverNotifications: Array<ServerNotificationResponse>) => serverNotifications.map(toNotification);

export const toSystemProperties = (action: Action): ReadonlyArray<SystemProperties> => {
    console.log('Calling toSystemProperties of', action);
    if (action.type === NotificationType.EMAIL_SUBSCRIPTION) {
        return action.recipient.map(r => ({
            type: NotificationType.EMAIL_SUBSCRIPTION,
            props: {
                onlyAdmins: r.sendToAdmin,
                ignorePreferences: false,
                groupId: undefined
            }
        }));
    } else {
        throw new Error(`No system properties for type ${action.type}`);
    }
};
