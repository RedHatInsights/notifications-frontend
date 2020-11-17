import { Action, Notification, NotificationType, ServerNotificationResponse } from '../Notification';
import { ServerIntegrationResponse } from '../Integration';
import { Schemas } from '../../generated/OpenapiNotifications';
import { filterOutDefaultAction, toIntegration } from './IntegrationAdapter';
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

export const usesDefault = (endpoints: Array<Schemas.Endpoint>): boolean =>
    endpoints.findIndex(e => e.type === Schemas.EndpointType.enum.default) !== -1;

export const toNotification = (serverNotification: ServerNotificationResponse): Notification => {
    if (!serverNotification.id || !serverNotification.application) {
        throw new Error(`Unexpected notification from server ${JSON.stringify(serverNotification)}`);
    }

    return {
        id: serverNotification.id,
        application: serverNotification.application.name,
        event: serverNotification.name,
        actions: toActions(filterOutDefaultAction(serverNotification.endpoints ?? [])),
        useDefault: usesDefault(serverNotification.endpoints ?? [])
    };
};

export const toAction = (serverAction: ServerIntegrationResponse): Action => {
    switch (serverAction.type) {
        case Schemas.EndpointType.enum.webhook:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case Schemas.EndpointType.enum.email:
            return _toAction(NotificationType.EMAIL, serverAction);
        case Schemas.EndpointType.enum.default:
            throw new Error('EndpointType.default should not reach this point');
        default:
            assertNever(serverAction.type);
    }
};

export const toNotifications = (serverNotifications: Array<ServerNotificationResponse>) => serverNotifications.map(toNotification);
export const toActions = (serverActions: Array<ServerIntegrationResponse>): Array<Action> => filterOutDefaultAction(serverActions).map(toAction);
