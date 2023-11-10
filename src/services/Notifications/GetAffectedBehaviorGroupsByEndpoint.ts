import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup } from '../../types/adapters/BehaviorGroupAdapter';

const behaviorGroupsForEndpointActionCreator = (integrationId: string) => {
  return Operations.NotificationResourceGetBehaviorGroupsAffectedByRemovalOfEndpoint.actionCreator(
    {
      endpointId: integrationId,
    }
  );
};

const defaultBehaviorGroupDecoder = validationResponseTransformer(
  (
    payload: Operations.NotificationResourceGetBehaviorGroupsAffectedByRemovalOfEndpoint.Payload
  ) => {
    if (payload.status === 200) {
      return validatedResponse(
        'BehaviorGroups',
        200,
        payload.value.map(toBehaviorGroup),
        payload.errors
      );
    }

    return payload;
  }
);

export const useGetAffectedBehaviorGroupsByEndpoint = () =>
  useTransformQueryResponse(
    useParameterizedQuery(behaviorGroupsForEndpointActionCreator),
    defaultBehaviorGroupDecoder
  );
