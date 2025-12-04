import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Schemas } from '../generated/OpenapiIntegrations';
import { Operations } from '../generated/OpenapiNotifications';
import { toNotifications } from '../types/adapters/NotificationAdapter';
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
