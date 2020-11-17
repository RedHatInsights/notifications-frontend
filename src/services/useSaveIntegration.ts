import { Integration, NewIntegration } from '../types/Integration';
import { Operations } from '../generated/OpenapiIntegrations';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration) => {
    const serverIntegration = toServerIntegrationRequest(integration);
    if (integration.id) {
        return Operations.EndpointServiceUpdateEndpoint.actionCreator({
            body: serverIntegration,
            id: integration.id
        });
    }

    return Operations.EndpointServiceCreateEndpoint.actionCreator({
        body: serverIntegration
    });
};

const decoder = (response: Operations.EndpointServiceCreateEndpoint.Payload | Operations.EndpointServiceUpdateEndpoint.Payload) => {
    if (response.type === 'Endpoint') {
        return {
            ...response,
            type: 'Integration',
            value: toIntegration(response.value)
        };
    }

    return response;
};

export const useSaveIntegrationMutation = () => useTransformQueryResponse(
    useMutation(saveIntegrationActionCreator),
    decoder
);
