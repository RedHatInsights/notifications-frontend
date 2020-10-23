import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { actionNotificationServiceGetEventTypes, NotificationServiceGetEventTypesPayload } from '../generated/OpenapiNotifications';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toNotifications } from '../types/adapters/NotificationAdapter';

export const listNotificationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return actionNotificationServiceGetEventTypes({
        limit: +query.limit,
        offset: +query.offset
    });
};

const decoder = validationResponseTransformer((payload: NotificationServiceGetEventTypesPayload) => {
    if (payload.type === 'NotificationServiceGetEventTypesParamResponse200') {
        return validatedResponse(
            'eventTypesArray',
            200,
            toNotifications(payload.value),
            payload.errors
        );
    }

    return payload;
});

export const useListNotifications = (pager?: Page) => useTransformQueryResponse(
    useQuery(listNotificationsActionCreator(pager)),
    decoder
);
