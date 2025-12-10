import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup } from '../../types/adapters/BehaviorGroupAdapter';
import { UUID } from '../../types/Notification';
import { useTransformQueryResponse } from '../../utils/insights-common-typescript';

const behaviorGroupDecoder = validationResponseTransformer(
  (
    payload: Operations.NotificationResource$v1FindBehaviorGroupsByBundleId.Payload
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

export const useGetBehaviorGroups = (bundleId: UUID) => {
  return useTransformQueryResponse(
    useQuery(
      Operations.NotificationResource$v1FindBehaviorGroupsByBundleId.actionCreator(
        {
          bundleId,
        }
      )
    ),
    behaviorGroupDecoder
  );
};
