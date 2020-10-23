import { actionNotificationServiceAddEndpointToDefaults } from '../generated/OpenapiNotifications';

export const actionAddActionToDefault = (actionId: string) =>
    actionNotificationServiceAddEndpointToDefaults({
        endpointId: actionId
    });
