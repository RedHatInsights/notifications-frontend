import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup } from '../../types/adapters/BehaviorGroupAdapter';
import { useTransformQueryResponse } from '../../utils/insights-common-typescript';

const behaviorGroupsForEndpointActionCreator = (integrationId: string) => {
  return Operations.NotificationResource$v1GetBehaviorGroupsAffectedByRemovalOfEndpoint.actionCreator(
    {
      endpointId: integrationId,
    }
  );
};

const defaultBehaviorGroupDecoder = validationResponseTransformer(
  (
    payload: Operations.NotificationResource$v1GetBehaviorGroupsAffectedByRemovalOfEndpoint.Payload
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
