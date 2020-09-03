import { actionGetApiNotificationsV10EndpointsIdHistory } from '../generated/ActionCreators';

export const listIntegrationHistoryActionCreator = (integrationId: string) => {
    return actionGetApiNotificationsV10EndpointsIdHistory({
        id: integrationId
    });
};
