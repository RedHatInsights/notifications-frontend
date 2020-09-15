/**
 * Generated code, DO NOT modify directly.
 */ import * as z from 'zod';
import {
    actionBuilder,
    ValidatedResponse,
    ActionValidatable
} from '@redhat-cloud-services/insights-common-typescript';
import { Action } from 'react-fetching-library';
/* eslint-disable @typescript-eslint/no-use-before-define */

export const Attributes = zodSchemaAttributes();
export type Attributes = z.infer<typeof Attributes>;

export const Date = zodSchemaDate();
export type Date = z.infer<typeof Date>;

export const EmailAttributes = zodSchemaEmailAttributes();
export type EmailAttributes = z.infer<typeof EmailAttributes>;

export const Endpoint = zodSchemaEndpoint();
export type Endpoint = z.infer<typeof Endpoint>;

export const EndpointType = zodSchemaEndpointType();
export type EndpointType = z.infer<typeof EndpointType>;

export const HttpType = zodSchemaHttpType();
export type HttpType = z.infer<typeof HttpType>;

export const JsonObject = zodSchemaJsonObject();
export type JsonObject = z.infer<typeof JsonObject>;

export const NotificationHistory = zodSchemaNotificationHistory();
export type NotificationHistory = z.infer<typeof NotificationHistory>;

export const UUID = zodSchemaUUID();
export type UUID = z.infer<typeof UUID>;

export const WebhookAttributes = zodSchemaWebhookAttributes();
export type WebhookAttributes = z.infer<typeof WebhookAttributes>;

export function zodSchemaAttributes() {
    return z.unknown();
}

export function zodSchemaDate() {
    return z.string();
}

export function zodSchemaEmailAttributes() {
    return z.unknown();
}

export function zodSchemaEndpoint() {
    return z.object({
        created: zodSchemaDate().optional().nullable(),
        description: z.string(),
        enabled: z.boolean().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        properties: z.union([
            zodSchemaWebhookAttributes(),
            zodSchemaEmailAttributes()
        ]),
        type: z.intersection(zodSchemaEndpointType(), z.enum([ 'webhook', 'email' ])),
        updated: zodSchemaDate().optional().nullable()
    });
}

export function zodSchemaEndpointType() {
    return z.enum([ 'webhook', 'email' ]);
}

export function zodSchemaHttpType() {
    return z.enum([ 'GET', 'POST' ]);
}

export function zodSchemaJsonObject() {
    return z.array(z.any());
}

export function zodSchemaNotificationHistory() {
    return z.object({
        created: zodSchemaDate().optional().nullable(),
        details: zodSchemaJsonObject().optional().nullable(),
        endpointId: zodSchemaUUID().optional().nullable(),
        id: z.number().int().optional().nullable(),
        invocationResult: z.boolean().optional().nullable(),
        invocationTime: z.number().int().optional().nullable()
    });
}

export function zodSchemaUUID() {
    return z.string();
}

export function zodSchemaWebhookAttributes() {
    return z.object({
        disable_ssl_verification: z.boolean().optional().nullable(),
        method: z.intersection(zodSchemaHttpType(), z.enum([ 'GET', 'POST' ])),
        secret_token: z.string().optional().nullable(),
        url: z.string()
    });
}

// get /api/notifications/v1.0/endpoints
const GetApiNotificationsV10EndpointsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type GetApiNotificationsV10EndpointsParamResponse200 = z.infer<
  typeof GetApiNotificationsV10EndpointsParamResponse200
>;
export type GetApiNotificationsV10EndpointsPayload =
  | ValidatedResponse<
      'GetApiNotificationsV10EndpointsParamResponse200',
      200,
      GetApiNotificationsV10EndpointsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApiNotificationsV10Endpoints = Action<
  GetApiNotificationsV10EndpointsPayload,
  ActionValidatable
>;
export const actionGetApiNotificationsV10Endpoints = (): ActionGetApiNotificationsV10Endpoints => {
    const path = '/api/notifications/v1.0/endpoints';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            { status: 200, zod: GetApiNotificationsV10EndpointsParamResponse200 }
        ]
    })
    .build();
};

// post /api/notifications/v1.0/endpoints
export interface PostApiNotificationsV10Endpoints {
  body?: Endpoint;
}

export type PostApiNotificationsV10EndpointsPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPostApiNotificationsV10Endpoints = Action<
  PostApiNotificationsV10EndpointsPayload,
  ActionValidatable
>;
export const actionPostApiNotificationsV10Endpoints = (
    params: PostApiNotificationsV10Endpoints
): ActionPostApiNotificationsV10Endpoints => {
    const path = '/api/notifications/v1.0/endpoints';
    const query = {} as Record<string, any>;
    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [{ status: 200, zod: Endpoint }]
    })
    .build();
};

// get /api/notifications/v1.0/endpoints/{id}
export interface GetApiNotificationsV10EndpointsId {
  id: UUID;
}

export type GetApiNotificationsV10EndpointsIdPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApiNotificationsV10EndpointsId = Action<
  GetApiNotificationsV10EndpointsIdPayload,
  ActionValidatable
>;
export const actionGetApiNotificationsV10EndpointsId = (
    params: GetApiNotificationsV10EndpointsId
): ActionGetApiNotificationsV10EndpointsId => {
    const path = '/api/notifications/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Endpoint }]
    })
    .build();
};

// put /api/notifications/v1.0/endpoints/{id}
const PutApiNotificationsV10EndpointsIdParamResponse200 = z.string();
type PutApiNotificationsV10EndpointsIdParamResponse200 = z.infer<
  typeof PutApiNotificationsV10EndpointsIdParamResponse200
>;
export interface PutApiNotificationsV10EndpointsId {
  id: UUID;
  body?: Endpoint;
}

export type PutApiNotificationsV10EndpointsIdPayload =
  | ValidatedResponse<
      'PutApiNotificationsV10EndpointsIdParamResponse200',
      200,
      PutApiNotificationsV10EndpointsIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutApiNotificationsV10EndpointsId = Action<
  PutApiNotificationsV10EndpointsIdPayload,
  ActionValidatable
>;
export const actionPutApiNotificationsV10EndpointsId = (
    params: PutApiNotificationsV10EndpointsId
): ActionPutApiNotificationsV10EndpointsId => {
    const path = '/api/notifications/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [
            { status: 200, zod: PutApiNotificationsV10EndpointsIdParamResponse200 }
        ]
    })
    .build();
};

// delete /api/notifications/v1.0/endpoints/{id}
const DeleteApiNotificationsV10EndpointsIdParamResponse200 = z.string();
type DeleteApiNotificationsV10EndpointsIdParamResponse200 = z.infer<
  typeof DeleteApiNotificationsV10EndpointsIdParamResponse200
>;
export interface DeleteApiNotificationsV10EndpointsId {
  id: UUID;
}

export type DeleteApiNotificationsV10EndpointsIdPayload =
  | ValidatedResponse<
      'DeleteApiNotificationsV10EndpointsIdParamResponse200',
      200,
      DeleteApiNotificationsV10EndpointsIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteApiNotificationsV10EndpointsId = Action<
  DeleteApiNotificationsV10EndpointsIdPayload,
  ActionValidatable
>;
export const actionDeleteApiNotificationsV10EndpointsId = (
    params: DeleteApiNotificationsV10EndpointsId
): ActionDeleteApiNotificationsV10EndpointsId => {
    const path = '/api/notifications/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: DeleteApiNotificationsV10EndpointsIdParamResponse200
            }
        ]
    })
    .build();
};

// put /api/notifications/v1.0/endpoints/{id}/enable
const PutApiNotificationsV10EndpointsIdEnableParamResponse200 = z.string();
type PutApiNotificationsV10EndpointsIdEnableParamResponse200 = z.infer<
  typeof PutApiNotificationsV10EndpointsIdEnableParamResponse200
>;
export interface PutApiNotificationsV10EndpointsIdEnable {
  id: UUID;
}

export type PutApiNotificationsV10EndpointsIdEnablePayload =
  | ValidatedResponse<
      'PutApiNotificationsV10EndpointsIdEnableParamResponse200',
      200,
      PutApiNotificationsV10EndpointsIdEnableParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutApiNotificationsV10EndpointsIdEnable = Action<
  PutApiNotificationsV10EndpointsIdEnablePayload,
  ActionValidatable
>;
export const actionPutApiNotificationsV10EndpointsIdEnable = (
    params: PutApiNotificationsV10EndpointsIdEnable
): ActionPutApiNotificationsV10EndpointsIdEnable => {
    const path = '/api/notifications/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: PutApiNotificationsV10EndpointsIdEnableParamResponse200
            }
        ]
    })
    .build();
};

// delete /api/notifications/v1.0/endpoints/{id}/enable
const DeleteApiNotificationsV10EndpointsIdEnableParamResponse200 = z.string();
type DeleteApiNotificationsV10EndpointsIdEnableParamResponse200 = z.infer<
  typeof DeleteApiNotificationsV10EndpointsIdEnableParamResponse200
>;
export interface DeleteApiNotificationsV10EndpointsIdEnable {
  id: UUID;
}

export type DeleteApiNotificationsV10EndpointsIdEnablePayload =
  | ValidatedResponse<
      'DeleteApiNotificationsV10EndpointsIdEnableParamResponse200',
      200,
      DeleteApiNotificationsV10EndpointsIdEnableParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteApiNotificationsV10EndpointsIdEnable = Action<
  DeleteApiNotificationsV10EndpointsIdEnablePayload,
  ActionValidatable
>;
export const actionDeleteApiNotificationsV10EndpointsIdEnable = (
    params: DeleteApiNotificationsV10EndpointsIdEnable
): ActionDeleteApiNotificationsV10EndpointsIdEnable => {
    const path = '/api/notifications/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: DeleteApiNotificationsV10EndpointsIdEnableParamResponse200
            }
        ]
    })
    .build();
};

// get /api/notifications/v1.0/endpoints/{id}/history
const GetApiNotificationsV10EndpointsIdHistoryParamResponse200 = z.array(
    zodSchemaNotificationHistory()
);
type GetApiNotificationsV10EndpointsIdHistoryParamResponse200 = z.infer<
  typeof GetApiNotificationsV10EndpointsIdHistoryParamResponse200
>;
export interface GetApiNotificationsV10EndpointsIdHistory {
  id: UUID;
}

export type GetApiNotificationsV10EndpointsIdHistoryPayload =
  | ValidatedResponse<
      'GetApiNotificationsV10EndpointsIdHistoryParamResponse200',
      200,
      GetApiNotificationsV10EndpointsIdHistoryParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApiNotificationsV10EndpointsIdHistory = Action<
  GetApiNotificationsV10EndpointsIdHistoryPayload,
  ActionValidatable
>;
export const actionGetApiNotificationsV10EndpointsIdHistory = (
    params: GetApiNotificationsV10EndpointsIdHistory
): ActionGetApiNotificationsV10EndpointsIdHistory => {
    const path = '/api/notifications/v1.0/endpoints/{id}/history'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetApiNotificationsV10EndpointsIdHistoryParamResponse200
            }
        ]
    })
    .build();
};

// get /api/notifications/v1.0/endpoints/{id}/history/{history_id}/details
const GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamHistoryId = z
.number()
.int();
type GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamHistoryId = z.infer<
  typeof GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamHistoryId
>;
const GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200 = z.string();
type GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200 = z.infer<
  typeof GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200
>;
export interface GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetails {
  historyId: GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamHistoryId;
  id: UUID;
}

export type GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsPayload =
  | ValidatedResponse<
      'GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200',
      200,
      GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApiNotificationsV10EndpointsIdHistoryHistoryIdDetails = Action<
  GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsPayload,
  ActionValidatable
>;
export const actionGetApiNotificationsV10EndpointsIdHistoryHistoryIdDetails = (
    params: GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetails
): ActionGetApiNotificationsV10EndpointsIdHistoryHistoryIdDetails => {
    const path = '/api/notifications/v1.0/endpoints/{id}/history/{history_id}/details'
    .replace('{history_id}', params.historyId.toString())
    .replace('{id}', params.id.toString());
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetApiNotificationsV10EndpointsIdHistoryHistoryIdDetailsParamResponse200
            }
        ]
    })
    .build();
};
