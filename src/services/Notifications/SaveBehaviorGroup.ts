import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup } from '../../types/adapters/BehaviorGroupAdapter';
import { UUID } from '../../types/Notification';

type Payload = Operations.NotificationResourceCreateBehaviorGroup.Payload
    | Operations.NotificationResourceUpdateBehaviorGroup.Payload;

type SaveBehaviorGroupRequest = {
    id?: UUID;
    bundleId: UUID;
    displayName: string;
}

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

type Body = Operations.NotificationResourceCreateBehaviorGroup.Params['body'] | Operations.NotificationResourceUpdateBehaviorGroup.Params['body'];

const requestToBody = (behaviorGroup: SaveBehaviorGroupRequest): Body => {
    return {
        bundleId: behaviorGroup.bundleId,
        displayName: behaviorGroup.displayName
    };
};

const saveBehaviorGroupActionCreator =  (behaviorGroup: SaveBehaviorGroupRequest) => {
    if (behaviorGroup.id === undefined) {
        return Operations.NotificationResourceCreateBehaviorGroup.actionCreator({
            body: requestToBody(behaviorGroup)
        });
    }

    return Operations.NotificationResourceUpdateBehaviorGroup.actionCreator({
        id: behaviorGroup.id,
        body: requestToBody(behaviorGroup)
    });
};

export const useSaveBehaviorGroupMutation = () => useTransformQueryResponse(
    useMutation(saveBehaviorGroupActionCreator),
    decoder
);
