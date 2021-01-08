import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import {
    Operations
} from '../generated/OpenapiIntegrations';
import { getEndpointType, toUserIntegrations } from '../types/adapters/IntegrationAdapter';
import { IntegrationType } from '../types/Integration';

export const listIntegrationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return Operations.EndpointServiceGetEndpoints.actionCreator({
        limit: +query.limit,
        offset: +query.offset,
        type: query.filterType ? getEndpointType(query.filterType as IntegrationType) : undefined,
        active: query.filterActive ? query.filterActive === 'true' : undefined
    });
};

export const listIntegrationIntegrationDecoder = validationResponseTransformer((payload: Operations.EndpointServiceGetEndpoints.Payload) => {
    if (payload?.status === 200) {
        return validatedResponse(
            'IntegrationPage',
            200,
            {
                data: toUserIntegrations(payload.value.data),
                count: payload.value.meta.count
            },
            payload.errors
        );
    }

    return payload;
});

export const useListIntegrationsQuery = (pager?: Page, initFetch?: boolean) => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager), initFetch),
    listIntegrationIntegrationDecoder
);

export const useListIntegrationPQuery = () => useTransformQueryResponse(
    useParameterizedQuery(listIntegrationsActionCreator),
    listIntegrationIntegrationDecoder
);
