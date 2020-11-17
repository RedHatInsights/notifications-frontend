import { Operations } from '../generated/OpenapiNotifications';

export const actionAddActionToNotification = (notificationId: number, actionId: string) => {
    return Operations.NotificationServiceLinkEndpointToEventType.actionCreator({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
