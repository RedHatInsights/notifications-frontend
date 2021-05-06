import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup, toShallowBehaviorGroupRequest } from '../../types/adapters/BehaviorGroupAdapter';
import { BehaviorGroup, NewBehaviorGroup } from '../../types/Notification';

type Payload = Operations.NotificationServiceCreateBehaviorGroup.Payload
    | Operations.NotificationServiceUpdateBehaviorGroup.Payload;

const decoder = validationResponseTransformer(
    (payload: Payload) => {
        if (payload.type === 'BehaviorGroup') {
            return validatedResponse(
                'BehaviorGroup',
                payload.status,
                toBehaviorGroup(payload.value),
                payload.errors
            );
        }

        return payload;
    }
);

const saveBehaviorGroupActionCreator =  (behaviorGroup: BehaviorGroup | NewBehaviorGroup) => {
    //
    if (behaviorGroup.id === undefined) {
        return Operations.NotificationServiceCreateBehaviorGroup.actionCreator({
            body: toShallowBehaviorGroupRequest(behaviorGroup)
        });
    }

    return Operations.NotificationServiceUpdateBehaviorGroup.actionCreator({
        id: behaviorGroup.id,
        body: toShallowBehaviorGroupRequest(behaviorGroup)
    });
};

export const useSaveBehaviorGroupMutation = () => useTransformQueryResponse(
    useMutation(saveBehaviorGroupActionCreator),
    decoder
);
