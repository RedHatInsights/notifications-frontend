/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import * as z from 'zod';
import { ValidatedResponse } from 'openapi2typescript';
import { Action } from 'react-fetching-library';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript/react-fetching-library';

export const WebhookAttributes = zodSchemaWebhookAttributes();
export type WebhookAttributes = z.infer<typeof WebhookAttributes>;

export const Endpoint = zodSchemaEndpoint();
export type Endpoint = z.infer<typeof Endpoint>;

export const NotificationHistory = zodSchemaNotificationHistory();
export type NotificationHistory = z.infer<typeof NotificationHistory>;

export const Attributes = zodSchemaAttributes();
export type Attributes = z.infer<typeof Attributes>;

export const EndpointType = zodSchemaEndpointType();
export type EndpointType = z.infer<typeof EndpointType>;

export const HttpType = zodSchemaHttpType();
export type HttpType = z.infer<typeof HttpType>;

export const JsonObject = zodSchemaJsonObject();
export type JsonObject = z.infer<typeof JsonObject>;

export const UUID = zodSchemaUUID();
export type UUID = z.infer<typeof UUID>;

export const EmailAttributes = zodSchemaEmailAttributes();
export type EmailAttributes = z.infer<typeof EmailAttributes>;

export const Date = zodSchemaDate();
export type Date = z.infer<typeof Date>;

// GET /endpoints/{id}
export interface GetEndpointsById {
  id: UUID;
}

export type GetEndpointsByIdPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetEndpointsById = Action<
  GetEndpointsByIdPayload,
  ActionValidatableConfig
>;
export const actionGetEndpointsById = (
    params: GetEndpointsById
): ActionGetEndpointsById => {
    const path = '/api/notifications/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Endpoint, type: 'Endpoint' }]
    })
    .build();
};

// PUT /endpoints/{id}
const PutEndpointsByIdParamResponse200 = z.string();
type PutEndpointsByIdParamResponse200 = z.infer<
  typeof PutEndpointsByIdParamResponse200
>;
export interface PutEndpointsById {
  id: UUID;
  body: Endpoint;
}

export type PutEndpointsByIdPayload =
  | ValidatedResponse<
      'PutEndpointsByIdParamResponse200',
      200,
      PutEndpointsByIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutEndpointsById = Action<
  PutEndpointsByIdPayload,
  ActionValidatableConfig
>;
export const actionPutEndpointsById = (
    params: PutEndpointsById
): ActionPutEndpointsById => {
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
            {
                status: 200,
                zod: PutEndpointsByIdParamResponse200,
                type: 'PutEndpointsByIdParamResponse200'
            }
        ]
    })
    .build();
};

// DELETE /endpoints/{id}
const DeleteEndpointsByIdParamResponse200 = z.string();
type DeleteEndpointsByIdParamResponse200 = z.infer<
  typeof DeleteEndpointsByIdParamResponse200
>;
export interface DeleteEndpointsById {
  id: UUID;
}

export type DeleteEndpointsByIdPayload =
  | ValidatedResponse<
      'DeleteEndpointsByIdParamResponse200',
      200,
      DeleteEndpointsByIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteEndpointsById = Action<
  DeleteEndpointsByIdPayload,
  ActionValidatableConfig
>;
export const actionDeleteEndpointsById = (
    params: DeleteEndpointsById
): ActionDeleteEndpointsById => {
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
                zod: DeleteEndpointsByIdParamResponse200,
                type: 'DeleteEndpointsByIdParamResponse200'
            }
        ]
    })
    .build();
};

// GET /endpoints/{id}/history
const GetEndpointsByIdHistoryParamResponse200 = z.array(
    zodSchemaNotificationHistory()
);
type GetEndpointsByIdHistoryParamResponse200 = z.infer<
  typeof GetEndpointsByIdHistoryParamResponse200
>;
export interface GetEndpointsByIdHistory {
  id: UUID;
}

export type GetEndpointsByIdHistoryPayload =
  | ValidatedResponse<
      'GetEndpointsByIdHistoryParamResponse200',
      200,
      GetEndpointsByIdHistoryParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetEndpointsByIdHistory = Action<
  GetEndpointsByIdHistoryPayload,
  ActionValidatableConfig
>;
export const actionGetEndpointsByIdHistory = (
    params: GetEndpointsByIdHistory
): ActionGetEndpointsByIdHistory => {
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
                zod: GetEndpointsByIdHistoryParamResponse200,
                type: 'GetEndpointsByIdHistoryParamResponse200'
            }
        ]
    })
    .build();
};

// GET /endpoints
const GetEndpointsParamPageNumber = z.number().int();
type GetEndpointsParamPageNumber = z.infer<typeof GetEndpointsParamPageNumber>;
const GetEndpointsParamPageSize = z.number().int();
type GetEndpointsParamPageSize = z.infer<typeof GetEndpointsParamPageSize>;
const GetEndpointsParamResponse200 = z.array(zodSchemaEndpoint());
type GetEndpointsParamResponse200 = z.infer<
  typeof GetEndpointsParamResponse200
>;
export interface GetEndpoints {
  pageNumber?: GetEndpointsParamPageNumber;
  pageSize?: GetEndpointsParamPageSize;
}

export type GetEndpointsPayload =
  | ValidatedResponse<
      'GetEndpointsParamResponse200',
      200,
      GetEndpointsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetEndpoints = Action<
  GetEndpointsPayload,
  ActionValidatableConfig
>;
export const actionGetEndpoints = (
    params: GetEndpoints
): ActionGetEndpoints => {
    const path = '/api/notifications/v1.0/endpoints';
    const query = {} as Record<string, any>;
    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.pageSize !== undefined) {
        query.pageSize = params.pageSize.toString();
    }

    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetEndpointsParamResponse200,
                type: 'GetEndpointsParamResponse200'
            }
        ]
    })
    .build();
};

// POST /endpoints
export interface PostEndpoints {
  body: Endpoint;
}

export type PostEndpointsPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPostEndpoints = Action<
  PostEndpointsPayload,
  ActionValidatableConfig
>;
export const actionPostEndpoints = (
    params: PostEndpoints
): ActionPostEndpoints => {
    const path = '/api/notifications/v1.0/endpoints';
    const query = {} as Record<string, any>;
    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [{ status: 200, zod: Endpoint, type: 'Endpoint' }]
    })
    .build();
};

// GET /endpoints/{id}/history/{history_id}/details
const GetEndpointsByIdHistoryByHistoryIdDetailsParamHistoryId = z
.number()
.int();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamHistoryId = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamHistoryId
>;
const GetEndpointsByIdHistoryByHistoryIdDetailsParamPageNumber = z
.number()
.int();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamPageNumber = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamPageNumber
>;
const GetEndpointsByIdHistoryByHistoryIdDetailsParamPageSize = z.number().int();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamPageSize = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamPageSize
>;
const GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200 = z.string();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200 = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200
>;
export interface GetEndpointsByIdHistoryByHistoryIdDetails {
  historyId: GetEndpointsByIdHistoryByHistoryIdDetailsParamHistoryId;
  id: UUID;
  pageNumber?: GetEndpointsByIdHistoryByHistoryIdDetailsParamPageNumber;
  pageSize?: GetEndpointsByIdHistoryByHistoryIdDetailsParamPageSize;
}

export type GetEndpointsByIdHistoryByHistoryIdDetailsPayload =
  | ValidatedResponse<
      'GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200',
      200,
      GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetEndpointsByIdHistoryByHistoryIdDetails = Action<
  GetEndpointsByIdHistoryByHistoryIdDetailsPayload,
  ActionValidatableConfig
>;
export const actionGetEndpointsByIdHistoryByHistoryIdDetails = (
    params: GetEndpointsByIdHistoryByHistoryIdDetails
): ActionGetEndpointsByIdHistoryByHistoryIdDetails => {
    const path = '/api/notifications/v1.0/endpoints/{id}/history/{history_id}/details'
    .replace('{history_id}', params.historyId.toString())
    .replace('{id}', params.id.toString());
    const query = {} as Record<string, any>;
    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.pageSize !== undefined) {
        query.pageSize = params.pageSize.toString();
    }

    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200,
                type: 'GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200'
            }
        ]
    })
    .build();
};

// PUT /endpoints/{id}/enable
const PutEndpointsByIdEnableParamResponse200 = z.string();
type PutEndpointsByIdEnableParamResponse200 = z.infer<
  typeof PutEndpointsByIdEnableParamResponse200
>;
export interface PutEndpointsByIdEnable {
  id: UUID;
}

export type PutEndpointsByIdEnablePayload =
  | ValidatedResponse<
      'PutEndpointsByIdEnableParamResponse200',
      200,
      PutEndpointsByIdEnableParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutEndpointsByIdEnable = Action<
  PutEndpointsByIdEnablePayload,
  ActionValidatableConfig
>;
export const actionPutEndpointsByIdEnable = (
    params: PutEndpointsByIdEnable
): ActionPutEndpointsByIdEnable => {
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
                zod: PutEndpointsByIdEnableParamResponse200,
                type: 'PutEndpointsByIdEnableParamResponse200'
            }
        ]
    })
    .build();
};

// DELETE /endpoints/{id}/enable
const DeleteEndpointsByIdEnableParamResponse200 = z.string();
type DeleteEndpointsByIdEnableParamResponse200 = z.infer<
  typeof DeleteEndpointsByIdEnableParamResponse200
>;
export interface DeleteEndpointsByIdEnable {
  id: UUID;
}

export type DeleteEndpointsByIdEnablePayload =
  | ValidatedResponse<
      'DeleteEndpointsByIdEnableParamResponse200',
      200,
      DeleteEndpointsByIdEnableParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteEndpointsByIdEnable = Action<
  DeleteEndpointsByIdEnablePayload,
  ActionValidatableConfig
>;
export const actionDeleteEndpointsByIdEnable = (
    params: DeleteEndpointsByIdEnable
): ActionDeleteEndpointsByIdEnable => {
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
                zod: DeleteEndpointsByIdEnableParamResponse200,
                type: 'DeleteEndpointsByIdEnableParamResponse200'
            }
        ]
    })
    .build();
};

export function zodSchemaWebhookAttributes() {
    return z.object({
        disable_ssl_verification: z.boolean().optional().nullable(),
        method: z.intersection(zodSchemaHttpType(), z.enum([ 'GET', 'POST' ])),
        secret_token: z.string().optional().nullable(),
        url: z.string()
    });
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

export function zodSchemaAttributes() {
    return z.unknown();
}

export function zodSchemaEndpointType() {
    return z.enum([ 'webhook', 'email' ]);
}

export function zodSchemaHttpType() {
    return z.enum([ 'GET', 'POST' ]);
}

export function zodSchemaJsonObject() {
    return z.array(z.unknown());
}

export function zodSchemaUUID() {
    return z.string();
}

export function zodSchemaEmailAttributes() {
    return z.unknown();
}

export function zodSchemaDate() {
    return z.string();
}
