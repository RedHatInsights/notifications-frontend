import { Operations } from '../generated/OpenapiNotifications';
import { UUID } from '../types/Notification';

export const actionRemoveActionFromDefault = (actionId: UUID) =>
    Operations.NotificationServiceDeleteEndpointFromDefaults.actionCreator({
        endpointId: actionId
    });
