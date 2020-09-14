import { Integration, NewIntegration, ServerIntegrationResponse } from '../types/Integration';
import {
    actionPostApiNotificationsV10Endpoints, actionPutApiNotificationsV10EndpointsId
} from '../generated/ActionCreators';
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

export const useSaveIntegrationMutation = () => useTransformQueryResponse(
    useMutation<ServerIntegrationResponse>(saveIntegrationActionCreator),
    toIntegration
);
