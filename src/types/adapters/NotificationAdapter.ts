import { Action, Notification, NotificationType, ServerNotificationResponse } from '../Notification';
import { ServerIntegrationResponse } from '../Integration';
import { EndpointType } from '../../generated/Openapi';
import { toIntegration } from './IntegrationAdapter';
import { assertNever } from 'assert-never';

const _toAction = (type: NotificationType, serverAction: ServerIntegrationResponse): Action => {
    if (type === NotificationType.INTEGRATION) {
        return {
            type,
            integration: toIntegration(serverAction)
        };
    }

    return {
        type,
        recipient: [] // Todo: How are we going to receive the recipient data?
    };
};

export const toNotification = (serverNotification: ServerNotificationResponse): Notification => {
    if (!serverNotification.id || !serverNotification.application) {
        throw new Error(`Unexpected notification from server ${JSON.stringify(serverNotification)}`);
    }

    return {
        id: serverNotification.id.toString(),
        application: serverNotification.application.name,
        event: serverNotification.name,
        actions: [],
        useDefault: false
    };
};

export const toAction = (serverAction: ServerIntegrationResponse): Action => {
    switch (serverAction.type) {
        case EndpointType.enum.webhook:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case EndpointType.enum.email:
            return _toAction(NotificationType.EMAIL, serverAction);
        default:
            assertNever(serverAction.type);
    }
};

export const toNotifications = (serverNotifications: Array<ServerNotificationResponse>) => serverNotifications.map(toNotification);

export const toActions = (serverActions: Array<ServerIntegrationResponse>): Array<Action> => serverActions.map(toAction);
