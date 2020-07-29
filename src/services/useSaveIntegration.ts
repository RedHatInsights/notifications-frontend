import { ServerIntegrationRequest, ServerIntegrationResponse } from '../types/Integration';
import {
    actionPostApiNotificationsV10Endpoints
} from '../generated/ActionCreators';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: ServerIntegrationRequest) => {
    if (integration.id) {
        console.error('Endpoint not ready');
    }

    return actionPostApiNotificationsV10Endpoints({
        body: integration
    });
};

export const useSaveIntegrationMutation = () => useTransformQueryResponse(
    useMutation<ServerIntegrationResponse>(saveIntegrationActionCreator),
    toIntegration
);
