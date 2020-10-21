import {
    actionNotificationServiceGetLinkedEndpoints,
    NotificationServiceGetLinkedEndpointsPayload
} from '../generated/OpenapiNotifications';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { toActions } from '../types/adapters/NotificationAdapter';
import { EndpointType } from '../generated/OpenapiIntegrations';

export const getNotificationActionsByIdAction = (eventTypeId: number) => {
    return actionNotificationServiceGetLinkedEndpoints({
        eventTypeId
    });
};

export const hasDefaultNotificationDecoder = validationResponseTransformer((payload: NotificationServiceGetLinkedEndpointsPayload) => {
    if (payload.type === 'NotificationServiceGetLinkedEndpointsParamResponse200') {
        return validatedResponse(
            'defaultNotification',
            200,
            payload.value.findIndex(a => a.type === EndpointType.enum.default) !== -1,
            payload.errors
        );
    }

    return payload;
});

export const getNotificationByIdActionDecoder = validationResponseTransformer((payload: NotificationServiceGetLinkedEndpointsPayload) => {
    if (payload.type === 'NotificationServiceGetLinkedEndpointsParamResponse200') {
        return validatedResponse(
            'actionsArray',
            200,
            toActions(payload.value),
            payload.errors
        );
    }

    return payload;
});
