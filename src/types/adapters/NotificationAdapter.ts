import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiNotifications';
import { ServerIntegrationResponse, UserIntegration } from '../Integration';
import {
    Action,
    NotificationBase,
    NotificationType,
    ServerNotificationResponse,
    SystemProperties
} from '../Notification';
import { filterOutDefaultAction, toIntegration } from './IntegrationAdapter';

const _toAction = (type: NotificationType, serverAction: ServerIntegrationResponse): Action => {
    if (type === NotificationType.INTEGRATION) {
        const userIntegration = toIntegration(serverAction) as UserIntegration;
        return {
            type,
            integrationId: userIntegration.id,
            integration: userIntegration
        };
    }

    const integration = toIntegration(serverAction);

    return {
        type,
        integrationId: integration.id,
        recipient: []
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

export const toNotifications = (serverNotifications: Array<ServerNotificationResponse>) => serverNotifications.map(toNotification);
export const toActions = (serverActions: Array<ServerIntegrationResponse>): Array<Action> => filterOutDefaultAction(serverActions).map(toAction);

export const toSystemProperties = (action: Action): SystemProperties => {
    if (action.type === NotificationType.EMAIL_SUBSCRIPTION) {
        return {
            type: NotificationType.EMAIL_SUBSCRIPTION
        };
    } else {
        throw new Error(`No system properties for type ${action.type}`);
    }
};
