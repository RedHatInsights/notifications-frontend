import {  actionDeleteNotificationsEventTypesByEventTypeIdByEndpointId } from '../generated/Openapi';

export const actionRemoveActionFromNotification = (notificationId: number, actionId: string) => {
    return actionDeleteNotificationsEventTypesByEventTypeIdByEndpointId({
        endpointId: actionId,
        eventTypeId: notificationId
    });
};
