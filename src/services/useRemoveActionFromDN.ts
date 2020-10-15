import { actionDeleteNotificationsDefaultsByEndpointId } from '../generated/Openapi';

export const actionRemoveActionFromDefault = (actionId: string) =>
    actionDeleteNotificationsDefaultsByEndpointId({
        endpointId: actionId
    });
