import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { UUID } from '../../types/Notification';

type UpdateBehaviorGroupActionsParams = {
  behaviorGroupId: UUID;
  endpointIds: Array<UUID>;
};

const updateBehaviorGroupActionsActionCreator = (
  params: UpdateBehaviorGroupActionsParams
) => {
  return Operations.NotificationResource$v1UpdateBehaviorGroupActions.actionCreator(
    {
      behaviorGroupId: params.behaviorGroupId,
      body: params.endpointIds,
    }
  );
};

export const useUpdateBehaviorGroupActionsMutation = () =>
  useMutation(updateBehaviorGroupActionsActionCreator);
