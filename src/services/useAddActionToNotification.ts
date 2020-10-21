import { actionNotificationServiceLinkEndpointToEventType } from '../generated/OpenapiNotifications';

export const actionAddActionToNotification = (notificationId: number, actionId: string) => {
    return actionNotificationServiceLinkEndpointToEventType({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
