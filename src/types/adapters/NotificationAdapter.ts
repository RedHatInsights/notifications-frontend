import { assertNever } from 'assert-never';
import produce, { castDraft } from 'immer';

import { Schemas } from '../../generated/OpenapiNotifications';
import { IntegrationEmailSubscription, ServerIntegrationResponse, UserIntegration } from '../Integration';
import {
    Action, ActionNotify,
    EventType,
    NotificationType,
    ServerNotificationResponse,
    SystemProperties
} from '../Notification';
import { NotificationRbacGroupRecipient, NotificationUserRecipient } from '../Recipient';
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

    const action: ActionNotify = {
        type,
        recipient: []
    };

    if (integration.groupId) {
        action.recipient = [ new NotificationRbacGroupRecipient(integration.id, integration.groupId, true) ];
    } else {
        action.recipient = [ new NotificationUserRecipient(integration.id, integration.onlyAdmin, integration.ignorePreferences) ];
    }

    return action;
};

export const toNotification = (serverNotification: ServerNotificationResponse): EventType => {
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
        case Schemas.EndpointType.enum.ansible:
        case Schemas.EndpointType.enum.camel:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case Schemas.EndpointType.enum.email_subscription:
            return _toAction(NotificationType.EMAIL_SUBSCRIPTION, serverAction);
        default:
            assertNever(serverAction.type);
    }
};

export const reduceActions = (actions: ReadonlyArray<Action>): ReadonlyArray<Action> => actions.reduce((actions, current) => {
    return produce(actions, draft => {
        if (current.type === NotificationType.EMAIL_SUBSCRIPTION) {
            const existingAction = draft.find(a => a.type === current.type) as ActionNotify;
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
    if (action.type === NotificationType.EMAIL_SUBSCRIPTION) {
        return action.recipient.map(r => ({
            type: NotificationType.EMAIL_SUBSCRIPTION,
            props: actionRecipientToSystemPropertiesProps(r)
        }));
    } else {
        throw new Error(`No system properties for type ${action.type}`);
    }
};

const actionRecipientToSystemPropertiesProps = (recipient: ActionNotify['recipient'][number]): SystemProperties['props'] => {
    if (recipient instanceof NotificationRbacGroupRecipient) {
        return {
            groupId: recipient.groupId,
            onlyAdmins: false,
            ignorePreferences: false
        };
    } else if (recipient instanceof NotificationUserRecipient) {
        return {
            groupId: undefined,
            onlyAdmins: recipient.sendToAdmin,
            ignorePreferences: false
        };
    }

    throw new Error('Unexpected implementation:' + recipient);
};
