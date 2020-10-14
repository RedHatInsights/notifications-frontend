import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
    actionGetNotificationsDefaults,
    GetNotificationsDefaultsPayload
} from '../generated/Openapi';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toActions } from '../types/adapters/NotificationAdapter';

export const defaultNotificationBehaviorCreator = () => actionGetNotificationsDefaults();

const decoder = validationResponseTransformer((payload: GetNotificationsDefaultsPayload) => {
    if (payload.type === 'GetNotificationsDefaultsParamResponse200') {
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
    decoder
);
