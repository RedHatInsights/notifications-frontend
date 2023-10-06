import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toBehaviorGroup } from '../../types/adapters/BehaviorGroupAdapter';
import { UUID } from '../../types/Notification';
import { useTransformQueryResponse } from '../../utils/ApiUtils';

const behaviorGroupDecoder = validationResponseTransformer(
    (payload: Operations.NotificationResourceFindBehaviorGroupsByBundleId.Payload) => {
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
        useQuery(Operations.NotificationResourceFindBehaviorGroupsByBundleId.actionCreator({
            bundleId
        })),
        behaviorGroupDecoder
    );
};
