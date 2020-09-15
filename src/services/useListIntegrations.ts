import {
    actionGetApiNotificationsV10Endpoints,
    GetApiNotificationsV10EndpointsPayload
} from '../generated/Openapi';
import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';

export const listIntegrationsActionCreator = () => {
    return actionGetApiNotificationsV10Endpoints();
};

const decoder = (payload?: GetApiNotificationsV10EndpointsPayload) => {
    if (payload?.status === 200) {
        return {
            type: 'integrationArray',
            value: toIntegrations(payload.value),
            status: 200
        };
    }

    return payload;
};

export const useListIntegrationsQuery = () => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator()),
    decoder
);
