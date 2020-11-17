import { Operations } from '../generated/OpenapiNotifications';

export const actionRemoveActionFromDefault = (actionId: string) =>
    Operations.NotificationServiceDeleteEndpointFromDefaults.actionCreator({
        endpointId: actionId
    });
