import {
    actionGetEndpoints,
    GetEndpointsPayload
} from '../generated/Openapi';
import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';

export const listIntegrationsActionCreator = (pager?: Page) => {
    return actionGetEndpoints({
        pageNumber: pager?.index,
        pageSize: pager?.size
    });
};

const decoder = (payload?: GetEndpointsPayload) => {
    if (payload?.status === 200) {
        return {
            type: 'integrationArray',
            value: toIntegrations(payload.value),
            status: 200
        };
    }

    return payload;
};

export const useListIntegrationsQuery = (pager?: Page) => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager)),
    decoder
);
