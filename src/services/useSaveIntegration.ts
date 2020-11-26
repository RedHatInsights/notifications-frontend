import { Integration, NewIntegration, NewUserIntegration, UserIntegration } from '../types/Integration';
import { Operations } from '../generated/OpenapiIntegrations';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';

export const createIntegrationActionCreator = (integration: NewIntegration | NewUserIntegration) => {
    return Operations.EndpointServiceCreateEndpoint.actionCreator({
        body: toServerIntegrationRequest(integration)
    });
};

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration | UserIntegration | NewUserIntegration) => {
    if (integration.id) {
        return Operations.EndpointServiceUpdateEndpoint.actionCreator({
            body: toServerIntegrationRequest(integration),
            id: integration.id
        });
    }

    return createIntegrationActionCreator(integration);
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
