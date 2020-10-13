import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { actionGetNotificationsEventTypes, GetNotificationsEventTypesPayload } from '../generated/Openapi';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toNotifications } from '../types/adapters/NotificationAdapter';

export const listNotificationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return actionGetNotificationsEventTypes({
        limit: +query.limit,
        offset: +query.offset
    });
};

const decoder = validationResponseTransformer((payload: GetNotificationsEventTypesPayload) => {
    if (payload.type === 'GetNotificationsEventTypesParamResponse200') {
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
