import { Operations  } from '../generated/OpenapiNotifications';

export const actionRemoveActionFromNotification = (notificationId: number, actionId: string) => {
    return Operations.NotificationServiceUnlinkEndpointFromEventType.actionCreator({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
