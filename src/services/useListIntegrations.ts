import {
    Operations
} from '../generated/OpenapiIntegrations';
import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { useQuery } from 'react-fetching-library';
import { getEndpointType, toUserIntegrations } from '../types/adapters/IntegrationAdapter';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { IntegrationType } from '../types/Integration';

export const listIntegrationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return Operations.EndpointServiceGetEndpoints.actionCreator({
        limit: +query.limit,
        offset: +query.offset,
        type: query.filterType ? getEndpointType(query.filterType as IntegrationType) : undefined
    });
};

export const listIntegrationIntegrationDecoder = validationResponseTransformer((payload: Operations.EndpointServiceGetEndpoints.Payload) => {
    if (payload?.status === 200) {
        return validatedResponse(
            'integrationArray',
            200,
            toUserIntegrations(payload.value),
            payload.errors
        );
    }

    return payload;
});

export const useListIntegrationsQuery = (pager?: Page, initFetch?: boolean) => useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager), initFetch),
    listIntegrationIntegrationDecoder
);
