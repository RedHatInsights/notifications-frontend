import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { BehaviorGroup, UUID } from '../../types/Notification';

type Payload =
  | Operations.NotificationResource$v1CreateBehaviorGroup.Payload
  | Operations.NotificationResource$v1UpdateBehaviorGroup.Payload;

export type SaveBehaviorGroupRequest = {
  eventTypesIds?: Array<UUID>;
  endpointIds?: Array<UUID>;
} & (
  | {
      // Update request
      id: UUID;
      displayName?: string;
    }
  | {
      // Create request
      bundleId: UUID;
      displayName: string;
    }
);

const decoder = validationResponseTransformer((payload: Payload) => {
  if (payload.type === 'CreateBehaviorGroupResponse') {
    const behaviorGroup: BehaviorGroup = {
      id: payload.value.id,
      displayName: payload.value.display_name,
      bundleId: payload.value.bundle_id,
      isDefault: false,
      bundleName: undefined,
      actions: [], // can't get the actions from only the ids,
      events: [], // can't get the eventTypes from only the ids,
    };
    return validatedResponse(
      'BehaviorGroup',
      payload.status,
      behaviorGroup,
      payload.errors
    );
  }

  return payload;
});

const saveBehaviorGroupActionCreator = (
  behaviorGroup: SaveBehaviorGroupRequest
) => {
  if ('id' in behaviorGroup) {
    return Operations.NotificationResource$v1UpdateBehaviorGroup.actionCreator({
      id: behaviorGroup.id,
      body: {
        display_name: behaviorGroup.displayName,
        endpoint_ids: behaviorGroup.endpointIds,
        event_type_ids: behaviorGroup.eventTypesIds,
      },
    });
  }

  return Operations.NotificationResource$v1CreateBehaviorGroup.actionCreator({
    body: {
      bundle_id: behaviorGroup.bundleId,
      display_name: behaviorGroup.displayName,
      endpoint_ids: behaviorGroup.endpointIds,
      event_type_ids: behaviorGroup.eventTypesIds,
    },
  });
};

export const useSaveBehaviorGroupMutation = () =>
  useTransformQueryResponse(
    useMutation(saveBehaviorGroupActionCreator),
    decoder
  );
