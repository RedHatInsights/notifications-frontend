import { Operations } from '../generated/OpenapiNotifications';
import { UUID } from '../types/Notification';

export const actionAddActionToNotification = (notificationId: UUID, actionId: UUID) => {
    return Operations.NotificationServiceLinkEndpointToEventType.actionCreator({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
