import { Operations } from '../generated/OpenapiNotifications';

export const actionAddActionToDefault = (actionId: string) =>
    Operations.NotificationServiceAddEndpointToDefaults.actionCreator({
        endpointId: actionId
    });
