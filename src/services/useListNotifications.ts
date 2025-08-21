import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Schemas } from '../generated/OpenapiIntegrations';
import { Operations } from '../generated/OpenapiNotifications';
import { toNotifications } from '../types/adapters/NotificationAdapter';
import { useEffect, useState } from 'react';
import { getEventTypes } from '../api/helpers/notifications/event-types-helper';
import {
  Page,
  useTransformQueryResponse,
} from '../utils/insights-common-typescript';

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

// if possible use the new version of this hook instead
export const useListNotificationsOld = (pager?: Page) =>
  useTransformQueryResponse(
    useQuery(listNotificationsActionCreator(pager)),
    decoder
  );

export const useParameterizedListNotifications = () =>
  useTransformQueryResponse(
    useParameterizedQuery(listNotificationsActionCreator),
    decoder
  );

export const useListNotifications = (pager?: Page) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const query = (pager ?? Page.defaultPage()).toQuery();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        limit: +query.limit,
        offset: +query.offset,
        applicationIds: query.filterApplicationId as string[],
        eventTypeName: query.filterEventFilterName,
        bundleId: query.filterBundleId,
        sortBy: `${query.sortColumn}:${query.sortDirection}`,
      };
      const response = await getEventTypes(params);
      setResponse({ ...response, data: toNotifications(response.data) ?? [] });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.offset,
    query.limit,
    query.filterBundleId,
    query.filterApplicationId,
    query.filterEventFilterName,
  ]);

  return { loading, response, refresh: fetchNotifications, error };
};
