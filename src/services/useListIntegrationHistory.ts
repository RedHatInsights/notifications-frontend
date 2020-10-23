import { actionEndpointServiceGetEndpointHistory } from '../generated/OpenapiIntegrations';

export const listIntegrationHistoryActionCreator = (integrationId: string) => {
    return actionEndpointServiceGetEndpointHistory({
        id: integrationId
    });
};
