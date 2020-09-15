import { Integration, NewIntegration } from '../types/Integration';
import {
    actionPostApiNotificationsV10Endpoints,
    actionPutApiNotificationsV10EndpointsId,
    PostApiNotificationsV10EndpointsPayload,
    PutApiNotificationsV10EndpointsIdPayload
} from '../generated/Openapi';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration, toServerIntegrationRequest } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: Integration | NewIntegration) => {
    const serverIntegration = toServerIntegrationRequest(integration);
    if (integration.id) {
        return actionPutApiNotificationsV10EndpointsId({
            body: serverIntegration,
            id: integration.id
        });
    }

    return actionPostApiNotificationsV10Endpoints({
        body: serverIntegration
    });
};

const decoder = (response: PostApiNotificationsV10EndpointsPayload | PutApiNotificationsV10EndpointsIdPayload) => {
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
