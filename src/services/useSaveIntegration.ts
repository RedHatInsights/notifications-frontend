import { ServerIntegrationRequest, ServerIntegrationResponse } from '../types/Integration';
import {
    actionPostApiNotificationsV10Endpoints, actionPutApiNotificationsV10EndpointsId
} from '../generated/ActionCreators';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useMutation } from 'react-fetching-library';
import { toIntegration } from '../types/adapters/IntegrationAdapter';

export const saveIntegrationActionCreator = (integration: ServerIntegrationRequest) => {
    if (integration.id) {
        return actionPutApiNotificationsV10EndpointsId({
            body: integration,
            id: integration.id
        });
    }

    return actionPostApiNotificationsV10Endpoints({
        body: integration
    });
};

export const useSaveIntegrationMutation = () => useTransformQueryResponse(
    useMutation<ServerIntegrationResponse>(saveIntegrationActionCreator),
    toIntegration
);
