import { Operations } from '../generated/OpenapiIntegrations';

export const listIntegrationHistoryActionCreator = (integrationId: string) => {
    return Operations.EndpointServiceGetEndpointHistory.actionCreator({
        id: integrationId
    });
};
