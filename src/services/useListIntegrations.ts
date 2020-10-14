import {
    actionGetEndpoints,
    GetEndpointsPayload
} from '../generated/Openapi';
import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { getEndpointType, toIntegrations } from '../types/adapters/IntegrationAdapter';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { IntegrationType } from '../types/Integration';

export const listIntegrationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return actionGetEndpoints({
        limit: +query.limit,
        offset: +query.offset,
        type: query.filterType ? getEndpointType(query.filterType as IntegrationType) : undefined
    });
};

export const listIntegrationIntegrationDecoder = validationResponseTransformer((payload: GetEndpointsPayload) => {
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

export const useListIntegrationsQuery = (pager?: Page, initFetch?: boolean) => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager), initFetch),
    listIntegrationIntegrationDecoder
);
