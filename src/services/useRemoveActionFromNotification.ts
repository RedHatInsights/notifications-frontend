import { actionNotificationServiceUnlinkEndpointFromEventType  } from '../generated/OpenapiNotifications';

export const actionRemoveActionFromNotification = (notificationId: number, actionId: string) => {
    return actionNotificationServiceUnlinkEndpointFromEventType({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
