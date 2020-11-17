import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { Operations } from '../generated/OpenapiNotifications';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toNotifications } from '../types/adapters/NotificationAdapter';

export const listNotificationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return Operations.NotificationServiceGetEventTypes.actionCreator({
        limit: +query.limit,
        offset: +query.offset
    });
};

const decoder = validationResponseTransformer((payload: Operations.NotificationServiceGetEventTypes.Payload) => {
    if (payload.type === 'ListEventType') {
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
