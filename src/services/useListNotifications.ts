import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { Operations } from '../generated/OpenapiNotifications';
import { useQuery } from 'react-fetching-library';
import { validationResponseTransformer, validatedResponse } from 'openapi2typescript';
import { toNotifications } from '../types/adapters/NotificationAdapter';
import { Schemas } from '../generated/OpenapiIntegrations';
import SetUUID = Schemas.SetUUID;

export const listNotificationsActionCreator = (pager?: Page) => {
    const query = (pager ?? Page.defaultPage()).toQuery();
    return Operations.NotificationServiceGetEventTypes.actionCreator({
        limit: +query.limit,
        offset: +query.offset,
        applicationIds: query.filterApplicationId as unknown as SetUUID
    });
};

const decoder = validationResponseTransformer((payload: Operations.NotificationServiceGetEventTypes.Payload) => {
    if (payload.status === 200) {
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
