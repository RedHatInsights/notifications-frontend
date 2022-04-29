import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiIntegrations';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';
import { Integration, NewIntegration, UserIntegration } from '../types/Integration';

export const createIntegrationActionCreator = (integration: NewIntegration) => {
    return Operations.EndpointResourceCreateEndpoint.actionCreator({
        body: toServerIntegrationRequest(integration)
    });
};

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration | UserIntegration) => {
    if (integration.id) {
        return Operations.EndpointResourceUpdateEndpoint.actionCreator({
            body: toServerIntegrationRequest(integration),
            id: integration.id
        });
    }

    return createIntegrationActionCreator(integration);
};

const decoder = (response: Operations.EndpointResourceCreateEndpoint.Payload | Operations.EndpointResourceUpdateEndpoint.Payload) => {
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
