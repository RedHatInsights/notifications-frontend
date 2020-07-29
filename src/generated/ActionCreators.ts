/**
* Generated code, DO NOT modify directly.
*/
import { actionBuilder } from '@redhat-cloud-services/insights-common-typescript';
import { Action } from 'react-fetching-library';
import * as schemas from './Types';

export interface UsePostApiNotificationsV10EndpointsParams {
    body?: schemas.Endpoint;
}

export interface UseGetApiNotificationsV10EndpointsIdParams {
    id: schemas.Uuid;
}

export interface UsePutApiNotificationsV10EndpointsIdParams {
    body?: schemas.Endpoint;
    id: string;
}

export interface UseDeleteApiNotificationsV10EndpointsIdParams {
    id: string;
}

export interface UsePutApiNotificationsV10EndpointsIdEnableParams {
    id: string;
}

export interface UseDeleteApiNotificationsV10EndpointsIdEnableParams {
    id: string;
}

export interface UseGetApiNotificationsV10EndpointsIdHistoryParams {
    id: schemas.Uuid;
}

export interface UseGetApiNotificationsV10EndpointsIdHistoryHistoryIdParams {
    historyId: number;
    id: schemas.Uuid;
}

export const actionGetApiNotificationsV10Endpoints = (): Action => {
    const path = '/api/notifications/v1.0/endpoints';

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

export const actionPostApiNotificationsV10Endpoints = (params: UsePostApiNotificationsV10EndpointsParams): Action => {
    const path = '/api/notifications/v1.0/endpoints';

    const query = {} as Record<string, any>;

    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

export const actionGetApiNotificationsV10EndpointsId = (params: UseGetApiNotificationsV10EndpointsIdParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

export const actionPutApiNotificationsV10EndpointsId = (params: UsePutApiNotificationsV10EndpointsIdParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('PUT', path)
    .queryParams(query)
    .data(params.body)
    .build();
};

export const actionDeleteApiNotificationsV10EndpointsId = (params: UseDeleteApiNotificationsV10EndpointsIdParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('DELETE', path)
    .queryParams(query)
    .build();
};

export const actionPutApiNotificationsV10EndpointsIdEnable = (params: UsePutApiNotificationsV10EndpointsIdEnableParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}/enable'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('PUT', path)
    .queryParams(query)
    .build();
};

export const actionDeleteApiNotificationsV10EndpointsIdEnable = (params: UseDeleteApiNotificationsV10EndpointsIdEnableParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}/enable'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('DELETE', path)
    .queryParams(query)
    .build();
};

export const actionGetApiNotificationsV10EndpointsIdHistory = (params: UseGetApiNotificationsV10EndpointsIdHistoryParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}/history'
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

export const actionGetApiNotificationsV10EndpointsIdHistoryHistoryId = (params: UseGetApiNotificationsV10EndpointsIdHistoryHistoryIdParams): Action => {
    const path = '/api/notifications/v1.0/endpoints/{id}/history/{history_id}'
    .replace('{history_id}', params.historyId)
    .replace('{id}', params.id);

    const query = {} as Record<string, any>;

    return actionBuilder('GET', path)
    .queryParams(query)
    .build();
};

