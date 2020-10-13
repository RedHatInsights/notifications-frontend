import {
    actionGetEndpoints,
    GetEndpointsPayload
} from '../generated/Openapi';
import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';

export const listIntegrationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return actionGetEndpoints({
        limit: +query.limit,
        offset: +query.offset
    });
};

const decoder = validationResponseTransformer((payload: GetEndpointsPayload) => {
    if (payload?.status === 200) {
        return validatedResponse(
            'integrationArray',
            200,
            toIntegrations(payload.value),
            payload.errors
        );
    }

    return payload;
});

export const useListIntegrationsQuery = (pager?: Page) => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager)),
    decoder
);
