import { actionPutNotificationsEventTypesByEventTypeIdByEndpointId } from '../generated/Openapi';

export const actionAddActionToNotification = (notificationId: number, actionId: string) => {
    return actionPutNotificationsEventTypesByEventTypeIdByEndpointId({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
