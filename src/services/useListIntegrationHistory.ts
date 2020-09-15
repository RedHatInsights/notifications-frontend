import { actionGetApiNotificationsV10EndpointsIdHistory } from '../generated/Openapi';

export const listIntegrationHistoryActionCreator = (integrationId: string) => {
    return actionGetApiNotificationsV10EndpointsIdHistory({
        id: integrationId
    });
};
