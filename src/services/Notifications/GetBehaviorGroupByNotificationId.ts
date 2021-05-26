import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiBehaviorGroups';
import { UUID } from '../../types/Notification';

export const getBehaviorGroupByNotificationDecoder = validationResponseTransformer(
    (payload: Operations.NotificationServiceGetLinkedBehaviorGroups.Payload) => {
        if (payload.status === 200) {
            return validatedResponse(
                'BehaviorGroupId',
                200,
                payload.value.map(value => value.id),
                payload.errors
            );
        }

        return payload;
    }
);

export const getBehaviorGroupByNotificationAction = (notificationId: UUID) =>
    Operations.NotificationServiceGetLinkedBehaviorGroups.actionCreator({
        eventTypeId: notificationId
    });

export const useGetBehaviorGroupByNotification = (notificationId: UUID) => {
    return useTransformQueryResponse(
        useQuery(getBehaviorGroupByNotificationAction(notificationId)),
        getBehaviorGroupByNotificationDecoder
    );
};
