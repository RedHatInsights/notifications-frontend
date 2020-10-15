import { actionPutNotificationsDefaultsByEndpointId } from '../generated/Openapi';

export const actionAddActionToDefault = (actionId: string) =>
    actionPutNotificationsDefaultsByEndpointId({
        endpointId: actionId
    });
