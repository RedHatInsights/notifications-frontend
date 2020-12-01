import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import {
    Operations
} from '../generated/OpenapiNotifications';
import { toActions } from '../types/adapters/NotificationAdapter';

export const defaultNotificationBehaviorCreator = () => Operations.NotificationServiceGetEndpointsForDefaults.actionCreator();

export const defaultNotificationsDecoder = validationResponseTransformer((payload: Operations.NotificationServiceGetEndpointsForDefaults.Payload) => {
    if (payload.status === 200) {
        return validatedResponse(
            'DefaultNotificationBehavior',
            200,
            {
                actions: toActions(payload.value)
            },
            payload.errors
        );
    }

    return payload;
});

export const useDefaultNotificationBehavior = () => useTransformQueryResponse(
    useQuery(defaultNotificationBehaviorCreator()),
    defaultNotificationsDecoder
);
