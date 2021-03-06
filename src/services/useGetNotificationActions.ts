import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';

import {
    Operations, Schemas
} from '../generated/OpenapiNotifications';
import { toActions } from '../types/adapters/NotificationAdapter';
import { UUID } from '../types/Notification';

export const getNotificationActionsByIdAction = (eventTypeId: UUID) => {
    return Operations.NotificationServiceGetLinkedEndpoints.actionCreator({
        eventTypeId
    });
};

export const hasDefaultNotificationDecoder = validationResponseTransformer((payload: Operations.NotificationServiceGetLinkedEndpoints.Payload) => {
    if (payload.status === 200) {
        return validatedResponse(
            'defaultNotification',
            200,
            payload.value.findIndex(a => a.type === Schemas.EndpointType.enum.default) !== -1,
            payload.errors
        );
    }

    return payload;
});

export const getNotificationByIdActionDecoder = validationResponseTransformer((payload: Operations.NotificationServiceGetLinkedEndpoints.Payload) => {
    if (payload.status === 200) {
        return validatedResponse(
            'actionsArray',
            200,
            toActions(payload.value),
            payload.errors
        );
    }

    return payload;
});
