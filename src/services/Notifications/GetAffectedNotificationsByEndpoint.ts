import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toNotifications } from '../../types/adapters/NotificationAdapter';

const notificationsForEndpointActionCreator = (integrationId: string) => {
    return Operations.NotificationServiceGetEventTypesAffectedByEndpointId.actionCreator({
        endpointId: integrationId
    });
};

const defaultNotificationsDecoder = validationResponseTransformer(
    (payload: Operations.NotificationServiceGetEventTypesAffectedByEndpointId.Payload) => {
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

export const useGetAffectedNotificationsByEndpoint = () =>
    useTransformQueryResponse(useParameterizedQuery(notificationsForEndpointActionCreator), defaultNotificationsDecoder);
