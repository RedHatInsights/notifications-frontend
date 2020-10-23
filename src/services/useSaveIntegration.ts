import { Integration, NewIntegration } from '../types/Integration';
import {
    actionEndpointServiceCreateEndpoint,
    actionEndpointServiceUpdateEndpoint,
    EndpointServiceCreateEndpointPayload,
    EndpointServiceUpdateEndpointPayload
} from '../generated/OpenapiIntegrations';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration) => {
    const serverIntegration = toServerIntegrationRequest(integration);
    if (integration.id) {
        return actionEndpointServiceUpdateEndpoint({
            body: serverIntegration,
            id: integration.id
        });
    }

    return actionEndpointServiceCreateEndpoint({
        body: serverIntegration
    });
};

const decoder = (response: EndpointServiceCreateEndpointPayload | EndpointServiceUpdateEndpointPayload) => {
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
