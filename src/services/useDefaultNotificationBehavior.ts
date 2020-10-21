import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
    actionNotificationServiceGetEndpointsForDefaults,
    NotificationServiceGetEndpointsForDefaultsPayload
} from '../generated/OpenapiNotifications';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toActions } from '../types/adapters/NotificationAdapter';

export const defaultNotificationBehaviorCreator = () => actionNotificationServiceGetEndpointsForDefaults();

export const defaultNotificationsDecoder = validationResponseTransformer((payload: NotificationServiceGetEndpointsForDefaultsPayload) => {
    if (payload.type === 'NotificationServiceGetEndpointsForDefaultsParamResponse200') {
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
