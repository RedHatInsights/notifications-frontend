import { Integration, NewIntegration } from '../types/Integration';
import {
    actionPostEndpoints,
    actionPutEndpointsById,
    PostEndpointsPayload,
    PutEndpointsByIdPayload
} from '../generated/Openapi';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration) => {
    const serverIntegration = toServerIntegrationRequest(integration);
    if (integration.id) {
        return actionPutEndpointsById({
            body: serverIntegration,
            id: integration.id
        });
    }

    return actionPostEndpoints({
        body: serverIntegration
    });
};

const decoder = (response: PostEndpointsPayload | PutEndpointsByIdPayload) => {
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
