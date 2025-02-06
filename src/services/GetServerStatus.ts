import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiNotifications';
import { toNotificationEvent } from '../types/adapters/NotificationEventAdapter';

const adapter = validationResponseTransformer(
  (payload: Operations.EventResource$v1GetEvents.Payload) => {
    if (payload.status === 200) {
      return validatedResponse(
        'Events',
        200,
        {
          ...payload.value,
          data: payload.value.data.map(toNotificationEvent),
        },
        payload.errors
      );
    }

    return payload;
  }
);

export const useGetServerStatus = () => {
  return useTransformQueryResponse(
    useQuery(Operations.EventResource$v1GetEvents.actionCreator({})),
    adapter
  );
};
