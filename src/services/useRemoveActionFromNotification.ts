import { Operations  } from '../generated/OpenapiNotifications';
import { UUID } from '../types/Notification';

export const actionRemoveActionFromNotification = (notificationId: UUID, actionId: UUID) => {
    return Operations.NotificationServiceUnlinkEndpointFromEventType.actionCreator({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
