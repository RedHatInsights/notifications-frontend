import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiPrivate';
import { toNotifications } from '../../types/adapters/NotificationAdapter';
import { UUID } from '../../types/Notification';

const getAffectedNotificationsByBehaviorGroupAction = (id: UUID) => {
    return Operations.NotificationServiceGetEventTypesAffectedByRemovalOfBehaviorGroup.actionCreator({
        behaviorGroupId: id
    });
};

const defaultNotificationsDecoder = validationResponseTransformer(
    (payload: Operations.NotificationServiceGetEventTypesAffectedByRemovalOfBehaviorGroup.Payload) => {
        if (payload.status === 200) {
            return validatedResponse(
                'Notifications',
                200,
                toNotifications(payload.value),
                payload.errors
            );
        }

        return payload;
    }
);

export const useGetAffectedNotificationsByBehaviorGroupQuery = (id: UUID) =>
    useTransformQueryResponse(
        useQuery(getAffectedNotificationsByBehaviorGroupAction(id)),
        defaultNotificationsDecoder
    );
