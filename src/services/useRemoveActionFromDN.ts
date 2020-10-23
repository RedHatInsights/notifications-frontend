import { actionNotificationServiceDeleteEndpointFromDefaults } from '../generated/OpenapiNotifications';

export const actionRemoveActionFromDefault = (actionId: string) =>
    actionNotificationServiceDeleteEndpointFromDefaults({
        endpointId: actionId
    });
