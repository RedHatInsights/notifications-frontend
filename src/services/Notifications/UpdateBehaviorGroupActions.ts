import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiBehaviorGroups';
import { UUID } from '../../types/Notification';

type UpdateBehaviorGroupActionsParams = {
    behaviorGroupId: UUID;
    endpointIds: Array<UUID>;
}

const updateBehaviorGroupActionsActionCreator =  (params: UpdateBehaviorGroupActionsParams) => {
    return Operations.NotificationServiceUpdateBehaviorGroupActions.actionCreator({
        behaviorGroupId: params.behaviorGroupId,
        body: params.endpointIds
    });
};

export const useUpdateBehaviorGroupActionsMutation = () => useMutation(updateBehaviorGroupActionsActionCreator);
