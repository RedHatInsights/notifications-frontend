import {
    actionGetNotificationsEventTypesByEventTypeId,
    GetNotificationsEventTypesByEventTypeIdPayload
} from '../generated/Openapi';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { toActions } from '../types/adapters/NotificationAdapter';

export const getNotificationActionsByIdAction = (eventTypeId: number) => {
    return actionGetNotificationsEventTypesByEventTypeId({
        eventTypeId
    });
};

export const getNotificationByIdActionDecoder = validationResponseTransformer((payload: GetNotificationsEventTypesByEventTypeIdPayload) => {
    if (payload.type === 'GetNotificationsEventTypesByEventTypeIdParamResponse200') {
        return validatedResponse(
            'actionsArray',
            200,
            toActions(payload.value),
            payload.errors
        );
    }

    return payload;
});
