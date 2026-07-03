import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiIntegrations';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';
import { IntegrationType, UserIntegration } from '../types/Integration';
import { Page, useTransformQueryResponse } from '../utils/insights-common-typescript';

export const listIntegrationsActionCreator = (pager?: Page) => {
  const query = (pager ?? Page.defaultPage()).toQuery();
  return Operations.EndpointResource$v1GetEndpoints.actionCreator({
    limit: +query.limit,
    offset: +query.offset,
    type: query.filterType ? (query.filterType as Array<IntegrationType>) : undefined,
    active: query.filterActive ? query.filterActive === 'true' : undefined,
    name: query.filterName ? query.filterName.toString() : '',
    sortBy: pager?.sort ? `${pager.sort.column}:${pager.sort.direction}` : undefined,
  });
};

// v2 includes system integrations (e.g. org-admin-configured read-only emails) and exposes read_only
export const listIntegrationsV2ActionCreator = (pager?: Page) => {
  const query = (pager ?? Page.defaultPage()).toQuery();
  const params = Operations.EndpointResource$v1GetEndpoints.actionCreator({
    limit: +query.limit,
    offset: +query.offset,
    type: query.filterType ? (query.filterType as Array<IntegrationType>) : undefined,
    active: query.filterActive ? query.filterActive === 'true' : undefined,
    name: query.filterName ? query.filterName.toString() : '',
    sortBy: pager?.sort ? `${pager.sort.column}:${pager.sort.direction}` : undefined,
  });
  return { ...params, endpoint: params.endpoint.replace('/v1.0/', '/v2.0/') };
};

export const listIntegrationIntegrationDecoder = validationResponseTransformer(
  (payload: Operations.EndpointResource$v1GetEndpoints.Payload) => {
    if (payload?.status === 200) {
      return validatedResponse(
        'IntegrationPage',
        200,
        {
          data: toIntegrations(payload.value.data) as Array<UserIntegration>,
          count: payload.value.meta.count,
        },
        payload.errors
      );
    }

    return payload;
  }
);

export const useListIntegrationsQuery = (pager?: Page, initFetch?: boolean, useV2 = false) =>
  useTransformQueryResponse(
    useQuery(
      useV2 ? listIntegrationsV2ActionCreator(pager) : listIntegrationsActionCreator(pager),
      initFetch
    ),
    listIntegrationIntegrationDecoder
  );

export const useListIntegrationPQuery = (useV2 = false) =>
  useTransformQueryResponse(
    useParameterizedQuery(useV2 ? listIntegrationsV2ActionCreator : listIntegrationsActionCreator),
    listIntegrationIntegrationDecoder
  );
