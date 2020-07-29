import { actionGetApiNotificationsV10Endpoints } from '../generated/ActionCreators';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { ServerIntegrationResponse } from '../types/Integration';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';

export const listIntegrationsActionCreator = () => {
    return actionGetApiNotificationsV10Endpoints();
};

export const useListIntegrationsQuery = () => useTransformQueryResponse(
    useQuery<ServerIntegrationResponse[]>(listIntegrationsActionCreator()),
    toIntegrations
);
