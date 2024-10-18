import {
  Page,
  useTransformQueryResponse,
} from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Schemas } from '../generated/OpenapiIntegrations';
import { Operations } from '../generated/OpenapiNotifications';
import { toNotifications } from '../types/adapters/NotificationAdapter';

export const listNotificationsActionCreator = (pager?: Page) => {
  const query = (pager ?? Page.defaultPage()).toQuery();
  return Operations.NotificationResource$v1GetEventTypes.actionCreator({
    limit: +query.limit,
    offset: +query.offset,
    applicationIds: query.filterApplicationId as unknown as Array<Schemas.UUID>,
    eventTypeName: query.filterEventFilterName as unknown as string,
    bundleId: query.filterBundleId as unknown as string,
    sortBy: `${query.sortColumn}:${query.sortDirection}`,
  });
};

const decoder = validationResponseTransformer(
  (payload: Operations.NotificationResource$v1GetEventTypes.Payload) => {
    if (payload.status === 200) {
      return validatedResponse(
        'eventTypesArray',
        200,
        {
          ...payload.value,
          data: toNotifications(payload.value.data),
        },
        payload.errors
      );
    }

    return payload;
  }
);

export const useListNotifications = (pager?: Page) =>
  useTransformQueryResponse(
    useQuery(listNotificationsActionCreator(pager)),
    decoder
  );

export const useParameterizedListNotifications = () =>
  useTransformQueryResponse(
    useParameterizedQuery(listNotificationsActionCreator),
    decoder
  );
