import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useClient, useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { UUID } from '../../types/Notification';

export const getBehaviorGroupByNotificationDecoder =
  validationResponseTransformer(
    (
      payload: Operations.NotificationResource$v1GetLinkedBehaviorGroups.Payload
    ) => {
      if (payload.status === 200) {
        return validatedResponse(
          'BehaviorGroupId',
          200,
          payload.value.map((value) => value.id),
          payload.errors
        );
      }

      return payload;
    }
  );

export const getBehaviorGroupByNotificationAction = (notificationId: UUID) =>
  Operations.NotificationResource$v1GetLinkedBehaviorGroups.actionCreator({
    eventTypeId: notificationId,
  });

export const useGetBehaviorGroupByNotification = (notificationId: UUID) => {
  return useTransformQueryResponse(
    useQuery(getBehaviorGroupByNotificationAction(notificationId)),
    getBehaviorGroupByNotificationDecoder
  );
};

export const useGetAnyBehaviorGroupByNotification = () => {
  const client = useClient();
  return async (notificationId: UUID) => {
    const { errorObject, payload } = await client.query(
      getBehaviorGroupByNotificationAction(notificationId)
    );
    if (errorObject) {
      throw errorObject;
    }

    return getBehaviorGroupByNotificationDecoder(
      payload as Operations.NotificationResource$v1GetLinkedBehaviorGroups.Payload
    );
  };
};
