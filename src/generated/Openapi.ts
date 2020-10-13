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

export const Locale = zodSchemaLocale();
export type Locale = z.infer<typeof Locale>;

export const WebhookAttributes = zodSchemaWebhookAttributes();
export type WebhookAttributes = z.infer<typeof WebhookAttributes>;

export const EventType = zodSchemaEventType();
export type EventType = z.infer<typeof EventType>;

export const Attributes = zodSchemaAttributes();
export type Attributes = z.infer<typeof Attributes>;

export const JsonObject = zodSchemaJsonObject();
export type JsonObject = z.infer<typeof JsonObject>;

export const URI = zodSchemaURI();
export type URI = z.infer<typeof URI>;

export const Notification = zodSchemaNotification();
export type Notification = z.infer<typeof Notification>;

export const SetCharacter = zodSchemaSetCharacter();
export type SetCharacter = z.infer<typeof SetCharacter>;

export const MultivaluedMapStringObject = zodSchemaMultivaluedMapStringObject();
export type MultivaluedMapStringObject = z.infer<
  typeof MultivaluedMapStringObject
>;

export const Endpoint = zodSchemaEndpoint();
export type Endpoint = z.infer<typeof Endpoint>;

export const EndpointType = zodSchemaEndpointType();
export type EndpointType = z.infer<typeof EndpointType>;

export const SetLink = zodSchemaSetLink();
export type SetLink = z.infer<typeof SetLink>;

export const MediaType = zodSchemaMediaType();
export type MediaType = z.infer<typeof MediaType>;

export const EntityTag = zodSchemaEntityTag();
export type EntityTag = z.infer<typeof EntityTag>;

export const UUID = zodSchemaUUID();
export type UUID = z.infer<typeof UUID>;

export const UriBuilder = zodSchemaUriBuilder();
export type UriBuilder = z.infer<typeof UriBuilder>;

export const NewCookie = zodSchemaNewCookie();
export type NewCookie = z.infer<typeof NewCookie>;

export const SetString = zodSchemaSetString();
export type SetString = z.infer<typeof SetString>;

export const MapStringNewCookie = zodSchemaMapStringNewCookie();
export type MapStringNewCookie = z.infer<typeof MapStringNewCookie>;

export const MapStringString = zodSchemaMapStringString();
export type MapStringString = z.infer<typeof MapStringString>;

export const HttpType = zodSchemaHttpType();
export type HttpType = z.infer<typeof HttpType>;

export const Date = zodSchemaDate();
export type Date = z.infer<typeof Date>;

export const Response = zodSchemaResponse();
export type Response = z.infer<typeof Response>;

export const SetEndpoint = zodSchemaSetEndpoint();
export type SetEndpoint = z.infer<typeof SetEndpoint>;

export const NotificationHistory = zodSchemaNotificationHistory();
export type NotificationHistory = z.infer<typeof NotificationHistory>;

export const StatusType = zodSchemaStatusType();
export type StatusType = z.infer<typeof StatusType>;

export const MultivaluedMapStringString = zodSchemaMultivaluedMapStringString();
export type MultivaluedMapStringString = z.infer<
  typeof MultivaluedMapStringString
>;

export const Family = zodSchemaFamily();
export type Family = z.infer<typeof Family>;

export const ListString = zodSchemaListString();
export type ListString = z.infer<typeof ListString>;

export const EmailAttributes = zodSchemaEmailAttributes();
export type EmailAttributes = z.infer<typeof EmailAttributes>;

export const Application = zodSchemaApplication();
export type Application = z.infer<typeof Application>;

export const Link = zodSchemaLink();
export type Link = z.infer<typeof Link>;

export const SetEventType = zodSchemaSetEventType();
export type SetEventType = z.infer<typeof SetEventType>;

// PUT /notifications/defaults/{endpointId}
export interface PutNotificationsDefaultsByEndpointId {
  endpointId: UUID;
}

export type PutNotificationsDefaultsByEndpointIdPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutNotificationsDefaultsByEndpointId = Action<
  PutNotificationsDefaultsByEndpointIdPayload,
  ActionValidatableConfig
>;
export const actionPutNotificationsDefaultsByEndpointId = (
    params: PutNotificationsDefaultsByEndpointId
): ActionPutNotificationsDefaultsByEndpointId => {
    const path = '/api/notifications/v1.0/notifications/defaults/{endpointId}'.replace(
        '{endpointId}',
        params.endpointId.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Response, type: 'Response' }]
    })
    .build();
};

// DELETE /notifications/defaults/{endpointId}
export interface DeleteNotificationsDefaultsByEndpointId {
  endpointId: UUID;
}

export type DeleteNotificationsDefaultsByEndpointIdPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteNotificationsDefaultsByEndpointId = Action<
  DeleteNotificationsDefaultsByEndpointIdPayload,
  ActionValidatableConfig
>;
export const actionDeleteNotificationsDefaultsByEndpointId = (
    params: DeleteNotificationsDefaultsByEndpointId
): ActionDeleteNotificationsDefaultsByEndpointId => {
    const path = '/api/notifications/v1.0/notifications/defaults/{endpointId}'.replace(
        '{endpointId}',
        params.endpointId.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Response, type: 'Response' }]
    })
    .build();
};

// GET /notifications/eventTypes
const GetNotificationsEventTypesParamLimit = z.number().int();
type GetNotificationsEventTypesParamLimit = z.infer<
  typeof GetNotificationsEventTypesParamLimit
>;
const GetNotificationsEventTypesParamOffset = z.number().int();
type GetNotificationsEventTypesParamOffset = z.infer<
  typeof GetNotificationsEventTypesParamOffset
>;
const GetNotificationsEventTypesParamPageNumber = z.number().int();
type GetNotificationsEventTypesParamPageNumber = z.infer<
  typeof GetNotificationsEventTypesParamPageNumber
>;
const GetNotificationsEventTypesParamSortBy = z.string();
type GetNotificationsEventTypesParamSortBy = z.infer<
  typeof GetNotificationsEventTypesParamSortBy
>;
const GetNotificationsEventTypesParamResponse200 = z.array(
    zodSchemaEventType()
);
type GetNotificationsEventTypesParamResponse200 = z.infer<
  typeof GetNotificationsEventTypesParamResponse200
>;
export interface GetNotificationsEventTypes {
  limit?: GetNotificationsEventTypesParamLimit;
  offset?: GetNotificationsEventTypesParamOffset;
  pageNumber?: GetNotificationsEventTypesParamPageNumber;
  sortBy?: GetNotificationsEventTypesParamSortBy;
}

export type GetNotificationsEventTypesPayload =
  | ValidatedResponse<
      'GetNotificationsEventTypesParamResponse200',
      200,
      GetNotificationsEventTypesParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetNotificationsEventTypes = Action<
  GetNotificationsEventTypesPayload,
  ActionValidatableConfig
>;
export const actionGetNotificationsEventTypes = (
    params: GetNotificationsEventTypes
): ActionGetNotificationsEventTypes => {
    const path = '/api/notifications/v1.0/notifications/eventTypes';
    const query = {} as Record<string, any>;
    if (params.limit !== undefined) {
        query.limit = params.limit.toString();
    }

    if (params.offset !== undefined) {
        query.offset = params.offset.toString();
    }

    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.sortBy !== undefined) {
        query.sort_by = params.sortBy.toString();
    }

    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetNotificationsEventTypesParamResponse200,
                type: 'GetNotificationsEventTypesParamResponse200'
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

// GET /notifications/updates
const GetNotificationsUpdatesParamResponse200 = z.array(
    zodSchemaNotification()
);
type GetNotificationsUpdatesParamResponse200 = z.infer<
  typeof GetNotificationsUpdatesParamResponse200
>;
export type GetNotificationsUpdatesPayload =
  | ValidatedResponse<
      'GetNotificationsUpdatesParamResponse200',
      200,
      GetNotificationsUpdatesParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetNotificationsUpdates = Action<
  GetNotificationsUpdatesPayload,
  ActionValidatableConfig
>;
export const actionGetNotificationsUpdates = (): ActionGetNotificationsUpdates => {
    const path = '/api/notifications/v1.0/notifications/updates';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetNotificationsUpdatesParamResponse200,
                type: 'GetNotificationsUpdatesParamResponse200'
            }
        ]
    })
    .build();
};

// GET /notifications/eventTypes/{eventTypeId}
const GetNotificationsEventTypesByEventTypeIdParamEventTypeId = z
.number()
.int();
type GetNotificationsEventTypesByEventTypeIdParamEventTypeId = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamEventTypeId
>;
const GetNotificationsEventTypesByEventTypeIdParamLimit = z.number().int();
type GetNotificationsEventTypesByEventTypeIdParamLimit = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamLimit
>;
const GetNotificationsEventTypesByEventTypeIdParamOffset = z.number().int();
type GetNotificationsEventTypesByEventTypeIdParamOffset = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamOffset
>;
const GetNotificationsEventTypesByEventTypeIdParamPageNumber = z.number().int();
type GetNotificationsEventTypesByEventTypeIdParamPageNumber = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamPageNumber
>;
const GetNotificationsEventTypesByEventTypeIdParamSortBy = z.string();
type GetNotificationsEventTypesByEventTypeIdParamSortBy = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamSortBy
>;
const GetNotificationsEventTypesByEventTypeIdParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type GetNotificationsEventTypesByEventTypeIdParamResponse200 = z.infer<
  typeof GetNotificationsEventTypesByEventTypeIdParamResponse200
>;
export interface GetNotificationsEventTypesByEventTypeId {
  eventTypeId: GetNotificationsEventTypesByEventTypeIdParamEventTypeId;
  limit?: GetNotificationsEventTypesByEventTypeIdParamLimit;
  offset?: GetNotificationsEventTypesByEventTypeIdParamOffset;
  pageNumber?: GetNotificationsEventTypesByEventTypeIdParamPageNumber;
  sortBy?: GetNotificationsEventTypesByEventTypeIdParamSortBy;
}

export type GetNotificationsEventTypesByEventTypeIdPayload =
  | ValidatedResponse<
      'GetNotificationsEventTypesByEventTypeIdParamResponse200',
      200,
      GetNotificationsEventTypesByEventTypeIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetNotificationsEventTypesByEventTypeId = Action<
  GetNotificationsEventTypesByEventTypeIdPayload,
  ActionValidatableConfig
>;
export const actionGetNotificationsEventTypesByEventTypeId = (
    params: GetNotificationsEventTypesByEventTypeId
): ActionGetNotificationsEventTypesByEventTypeId => {
    const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}'.replace(
        '{eventTypeId}',
        params.eventTypeId.toString()
    );
    const query = {} as Record<string, any>;
    if (params.limit !== undefined) {
        query.limit = params.limit.toString();
    }

    if (params.offset !== undefined) {
        query.offset = params.offset.toString();
    }

    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.sortBy !== undefined) {
        query.sort_by = params.sortBy.toString();
    }

    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetNotificationsEventTypesByEventTypeIdParamResponse200,
                type: 'GetNotificationsEventTypesByEventTypeIdParamResponse200'
            }
        ]
    })
    .build();
};

// GET /applications/{id}
export interface GetApplicationsById {
  id: UUID;
}

export type GetApplicationsByIdPayload =
  | ValidatedResponse<'Application', 200, Application>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApplicationsById = Action<
  GetApplicationsByIdPayload,
  ActionValidatableConfig
>;
export const actionGetApplicationsById = (
    params: GetApplicationsById
): ActionGetApplicationsById => {
    const path = '/api/notifications/v1.0/applications/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Application, type: 'Application' }]
    })
    .build();
};

// PUT /notifications/eventTypes/{eventTypeId}/{endpointId}
const PutNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId = z
.number()
.int();
type PutNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId = z.infer<
  typeof PutNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId
>;
const PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200 = z.string();
type PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200 = z.infer<
  typeof PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200
>;
export interface PutNotificationsEventTypesByEventTypeIdByEndpointId {
  endpointId: UUID;
  eventTypeId: PutNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId;
}

export type PutNotificationsEventTypesByEventTypeIdByEndpointIdPayload =
  | ValidatedResponse<
      'PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200',
      200,
      PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPutNotificationsEventTypesByEventTypeIdByEndpointId = Action<
  PutNotificationsEventTypesByEventTypeIdByEndpointIdPayload,
  ActionValidatableConfig
>;
export const actionPutNotificationsEventTypesByEventTypeIdByEndpointId = (
    params: PutNotificationsEventTypesByEventTypeIdByEndpointId
): ActionPutNotificationsEventTypesByEventTypeIdByEndpointId => {
    const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/{endpointId}'
    .replace('{endpointId}', params.endpointId.toString())
    .replace('{eventTypeId}', params.eventTypeId.toString());
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200,
                type:
            'PutNotificationsEventTypesByEventTypeIdByEndpointIdParamResponse200'
            }
        ]
    })
    .build();
};

// DELETE /notifications/eventTypes/{eventTypeId}/{endpointId}
const DeleteNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId = z
.number()
.int();
type DeleteNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId = z.infer<
  typeof DeleteNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId
>;
export interface DeleteNotificationsEventTypesByEventTypeIdByEndpointId {
  endpointId: UUID;
  eventTypeId: DeleteNotificationsEventTypesByEventTypeIdByEndpointIdParamEventTypeId;
}

export type DeleteNotificationsEventTypesByEventTypeIdByEndpointIdPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteNotificationsEventTypesByEventTypeIdByEndpointId = Action<
  DeleteNotificationsEventTypesByEventTypeIdByEndpointIdPayload,
  ActionValidatableConfig
>;
export const actionDeleteNotificationsEventTypesByEventTypeIdByEndpointId = (
    params: DeleteNotificationsEventTypesByEventTypeIdByEndpointId
): ActionDeleteNotificationsEventTypesByEventTypeIdByEndpointId => {
    const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/{endpointId}'
    .replace('{endpointId}', params.endpointId.toString())
    .replace('{eventTypeId}', params.eventTypeId.toString());
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [{ status: 200, zod: Response, type: 'Response' }]
    })
    .build();
};

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

// GET /applications/{id}/eventTypes
const GetApplicationsByIdEventTypesParamResponse200 = z.array(
    zodSchemaEventType()
);
type GetApplicationsByIdEventTypesParamResponse200 = z.infer<
  typeof GetApplicationsByIdEventTypesParamResponse200
>;
export interface GetApplicationsByIdEventTypes {
  id: UUID;
}

export type GetApplicationsByIdEventTypesPayload =
  | ValidatedResponse<
      'GetApplicationsByIdEventTypesParamResponse200',
      200,
      GetApplicationsByIdEventTypesParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApplicationsByIdEventTypes = Action<
  GetApplicationsByIdEventTypesPayload,
  ActionValidatableConfig
>;
export const actionGetApplicationsByIdEventTypes = (
    params: GetApplicationsByIdEventTypes
): ActionGetApplicationsByIdEventTypes => {
    const path = '/api/notifications/v1.0/applications/{id}/eventTypes'.replace(
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
                zod: GetApplicationsByIdEventTypesParamResponse200,
                type: 'GetApplicationsByIdEventTypesParamResponse200'
            }
        ]
    })
    .build();
};

// POST /applications/{id}/eventTypes
export interface PostApplicationsByIdEventTypes {
  id: UUID;
  body: EventType;
}

export type PostApplicationsByIdEventTypesPayload =
  | ValidatedResponse<'EventType', 200, EventType>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPostApplicationsByIdEventTypes = Action<
  PostApplicationsByIdEventTypesPayload,
  ActionValidatableConfig
>;
export const actionPostApplicationsByIdEventTypes = (
    params: PostApplicationsByIdEventTypes
): ActionPostApplicationsByIdEventTypes => {
    const path = '/api/notifications/v1.0/applications/{id}/eventTypes'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [{ status: 200, zod: EventType, type: 'EventType' }]
    })
    .build();
};

// GET /endpoints
const GetEndpointsParamActive = z.boolean();
type GetEndpointsParamActive = z.infer<typeof GetEndpointsParamActive>;
const GetEndpointsParamLimit = z.number().int();
type GetEndpointsParamLimit = z.infer<typeof GetEndpointsParamLimit>;
const GetEndpointsParamOffset = z.number().int();
type GetEndpointsParamOffset = z.infer<typeof GetEndpointsParamOffset>;
const GetEndpointsParamPageNumber = z.number().int();
type GetEndpointsParamPageNumber = z.infer<typeof GetEndpointsParamPageNumber>;
const GetEndpointsParamSortBy = z.string();
type GetEndpointsParamSortBy = z.infer<typeof GetEndpointsParamSortBy>;
const GetEndpointsParamResponse200 = z.array(zodSchemaEndpoint());
type GetEndpointsParamResponse200 = z.infer<
  typeof GetEndpointsParamResponse200
>;
export interface GetEndpoints {
  active?: GetEndpointsParamActive;
  limit?: GetEndpointsParamLimit;
  offset?: GetEndpointsParamOffset;
  pageNumber?: GetEndpointsParamPageNumber;
  sortBy?: GetEndpointsParamSortBy;
  type?: EndpointType;
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
    if (params.active !== undefined) {
        query.active = params.active.toString();
    }

    if (params.limit !== undefined) {
        query.limit = params.limit.toString();
    }

    if (params.offset !== undefined) {
        query.offset = params.offset.toString();
    }

    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.sortBy !== undefined) {
        query.sort_by = params.sortBy.toString();
    }

    if (params.type !== undefined) {
        query.type = params.type.toString();
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

// GET /applications
const GetApplicationsParamResponse200 = z.array(zodSchemaApplication());
type GetApplicationsParamResponse200 = z.infer<
  typeof GetApplicationsParamResponse200
>;
export type GetApplicationsPayload =
  | ValidatedResponse<
      'GetApplicationsParamResponse200',
      200,
      GetApplicationsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetApplications = Action<
  GetApplicationsPayload,
  ActionValidatableConfig
>;
export const actionGetApplications = (): ActionGetApplications => {
    const path = '/api/notifications/v1.0/applications';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetApplicationsParamResponse200,
                type: 'GetApplicationsParamResponse200'
            }
        ]
    })
    .build();
};

// POST /applications
export interface PostApplications {
  body: Application;
}

export type PostApplicationsPayload =
  | ValidatedResponse<'Application', 200, Application>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionPostApplications = Action<
  PostApplicationsPayload,
  ActionValidatableConfig
>;
export const actionPostApplications = (
    params: PostApplications
): ActionPostApplications => {
    const path = '/api/notifications/v1.0/applications';
    const query = {} as Record<string, any>;
    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [{ status: 200, zod: Application, type: 'Application' }]
    })
    .build();
};

// GET /notifications/defaults
const GetNotificationsDefaultsParamResponse200 = z.array(zodSchemaEndpoint());
type GetNotificationsDefaultsParamResponse200 = z.infer<
  typeof GetNotificationsDefaultsParamResponse200
>;
export type GetNotificationsDefaultsPayload =
  | ValidatedResponse<
      'GetNotificationsDefaultsParamResponse200',
      200,
      GetNotificationsDefaultsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionGetNotificationsDefaults = Action<
  GetNotificationsDefaultsPayload,
  ActionValidatableConfig
>;
export const actionGetNotificationsDefaults = (): ActionGetNotificationsDefaults => {
    const path = '/api/notifications/v1.0/notifications/defaults';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: GetNotificationsDefaultsParamResponse200,
                type: 'GetNotificationsDefaultsParamResponse200'
            }
        ]
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
const GetEndpointsByIdHistoryByHistoryIdDetailsParamLimit = z.number().int();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamLimit = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamLimit
>;
const GetEndpointsByIdHistoryByHistoryIdDetailsParamOffset = z.number().int();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamOffset = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamOffset
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
const GetEndpointsByIdHistoryByHistoryIdDetailsParamSortBy = z.string();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamSortBy = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamSortBy
>;
const GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200 = z.string();
type GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200 = z.infer<
  typeof GetEndpointsByIdHistoryByHistoryIdDetailsParamResponse200
>;
export interface GetEndpointsByIdHistoryByHistoryIdDetails {
  historyId: GetEndpointsByIdHistoryByHistoryIdDetailsParamHistoryId;
  id: UUID;
  limit?: GetEndpointsByIdHistoryByHistoryIdDetailsParamLimit;
  offset?: GetEndpointsByIdHistoryByHistoryIdDetailsParamOffset;
  pageNumber?: GetEndpointsByIdHistoryByHistoryIdDetailsParamPageNumber;
  pageSize?: GetEndpointsByIdHistoryByHistoryIdDetailsParamPageSize;
  sortBy?: GetEndpointsByIdHistoryByHistoryIdDetailsParamSortBy;
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
    if (params.limit !== undefined) {
        query.limit = params.limit.toString();
    }

    if (params.offset !== undefined) {
        query.offset = params.offset.toString();
    }

    if (params.pageNumber !== undefined) {
        query.pageNumber = params.pageNumber.toString();
    }

    if (params.pageSize !== undefined) {
        query.pageSize = params.pageSize.toString();
    }

    if (params.sortBy !== undefined) {
        query.sort_by = params.sortBy.toString();
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

// DELETE /notifications/{id}
const DeleteNotificationsByIdParamBody = z.number().int();
type DeleteNotificationsByIdParamBody = z.infer<
  typeof DeleteNotificationsByIdParamBody
>;
export interface DeleteNotificationsById {
  body: DeleteNotificationsByIdParamBody;
}

export type DeleteNotificationsByIdPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionDeleteNotificationsById = Action<
  DeleteNotificationsByIdPayload,
  ActionValidatableConfig
>;
export const actionDeleteNotificationsById = (
    params: DeleteNotificationsById
): ActionDeleteNotificationsById => {
    const path = '/api/notifications/v1.0/notifications/{id}';
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [{ status: 200, zod: Response, type: 'Response' }]
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

export function zodSchemaLocale() {
    return z.object({
        country: z.string().optional().nullable(),
        displayCountry: z.string().optional().nullable(),
        displayLanguage: z.string().optional().nullable(),
        displayName: z.string().optional().nullable(),
        displayScript: z.string().optional().nullable(),
        displayVariant: z.string().optional().nullable(),
        extensionKeys: zodSchemaSetCharacter().optional().nullable(),
        iSO3Country: z.string().optional().nullable(),
        iSO3Language: z.string().optional().nullable(),
        language: z.string().optional().nullable(),
        script: z.string().optional().nullable(),
        unicodeLocaleAttributes: zodSchemaSetString().optional().nullable(),
        unicodeLocaleKeys: zodSchemaSetString().optional().nullable(),
        variant: z.string().optional().nullable()
    });
}

export function zodSchemaWebhookAttributes() {
    return z.object({
        disable_ssl_verification: z.boolean().optional().nullable(),
        method: z.intersection(zodSchemaHttpType(), z.enum([ 'GET', 'POST', 'PUT' ])),
        secret_token: z.string().optional().nullable(),
        url: z.string()
    });
}

export function zodSchemaEventType() {
    return z.object({
        application: zodSchemaApplication().optional().nullable(),
        description: z.string(),
        endpoints: zodSchemaSetEndpoint().optional().nullable(),
        id: z.number().int().optional().nullable(),
        name: z.string()
    });
}

export function zodSchemaAttributes() {
    return z.unknown();
}

export function zodSchemaJsonObject() {
    return z.array(z.unknown());
}

export function zodSchemaURI() {
    return z.string();
}

export function zodSchemaNotification() {
    return z.object({
        endpoint: zodSchemaEndpoint().optional().nullable(),
        payload: z.unknown().optional().nullable(),
        tenant: z.string().optional().nullable()
    });
}

export function zodSchemaSetCharacter() {
    return z.array(z.string());
}

export function zodSchemaMultivaluedMapStringObject() {
    return z.record(z.unknown());
}

export function zodSchemaEndpoint() {
    return z.object({
        created: zodSchemaDate().optional().nullable(),
        description: z.string(),
        enabled: z.boolean().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        properties: z
        .union([ zodSchemaWebhookAttributes(), zodSchemaEmailAttributes() ])
        .optional()
        .nullable(),
        type: z.intersection(zodSchemaEndpointType(), z.enum([ 'webhook', 'email' ])),
        updated: zodSchemaDate().optional().nullable()
    });
}

export function zodSchemaEndpointType() {
    return z.enum([ 'webhook', 'email' ]);
}

export function zodSchemaSetLink() {
    return z.array(zodSchemaLink());
}

export function zodSchemaMediaType() {
    return z.object({
        parameters: zodSchemaMapStringString().optional().nullable(),
        subtype: z.string().optional().nullable(),
        type: z.string().optional().nullable(),
        wildcardSubtype: z.boolean().optional().nullable(),
        wildcardType: z.boolean().optional().nullable()
    });
}

export function zodSchemaEntityTag() {
    return z.object({
        value: z.string().optional().nullable(),
        weak: z.boolean().optional().nullable()
    });
}

export function zodSchemaUUID() {
    return z.string();
}

export function zodSchemaUriBuilder() {
    return z.unknown();
}

export function zodSchemaNewCookie() {
    return z.object({
        domain: z.string().optional().nullable(),
        name: z.string().optional().nullable(),
        path: z.string().optional().nullable(),
        value: z.string().optional().nullable(),
        version: z.number().int().optional().nullable(),
        comment: z.string().optional().nullable(),
        expiry: zodSchemaDate().optional().nullable(),
        httpOnly: z.boolean().optional().nullable(),
        maxAge: z.number().int().optional().nullable(),
        secure: z.boolean().optional().nullable()
    });
}

export function zodSchemaSetString() {
    return z.array(z.string());
}

export function zodSchemaMapStringNewCookie() {
    return z.record(zodSchemaNewCookie());
}

export function zodSchemaMapStringString() {
    return z.record(z.string());
}

export function zodSchemaHttpType() {
    return z.enum([ 'GET', 'POST', 'PUT' ]);
}

export function zodSchemaDate() {
    return z.string();
}

export function zodSchemaResponse() {
    return z.object({
        allowedMethods: zodSchemaSetString().optional().nullable(),
        cookies: zodSchemaMapStringNewCookie().optional().nullable(),
        date: zodSchemaDate().optional().nullable(),
        entity: z.unknown().optional().nullable(),
        entityTag: zodSchemaEntityTag().optional().nullable(),
        headers: zodSchemaMultivaluedMapStringObject().optional().nullable(),
        language: zodSchemaLocale().optional().nullable(),
        lastModified: zodSchemaDate().optional().nullable(),
        length: z.number().int().optional().nullable(),
        links: zodSchemaSetLink().optional().nullable(),
        location: zodSchemaURI().optional().nullable(),
        mediaType: zodSchemaMediaType().optional().nullable(),
        metadata: zodSchemaMultivaluedMapStringObject().optional().nullable(),
        status: z.number().int().optional().nullable(),
        statusInfo: zodSchemaStatusType().optional().nullable(),
        stringHeaders: zodSchemaMultivaluedMapStringString().optional().nullable()
    });
}

export function zodSchemaSetEndpoint() {
    return z.array(zodSchemaEndpoint());
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

export function zodSchemaStatusType() {
    return z.object({
        family: zodSchemaFamily().optional().nullable(),
        reasonPhrase: z.string().optional().nullable(),
        statusCode: z.number().int().optional().nullable()
    });
}

export function zodSchemaMultivaluedMapStringString() {
    return z.record(z.string());
}

export function zodSchemaFamily() {
    return z.enum([
        'CLIENT_ERROR',
        'INFORMATIONAL',
        'OTHER',
        'REDIRECTION',
        'SERVER_ERROR',
        'SUCCESSFUL'
    ]);
}

export function zodSchemaListString() {
    return z.array(z.string());
}

export function zodSchemaEmailAttributes() {
    return z.unknown();
}

export function zodSchemaApplication() {
    return z.object({
        created: zodSchemaDate().optional().nullable(),
        description: z.string(),
        eventTypes: z.unknown(), // z.lazy(() => zodSchemaSetEventType().optional().nullable()),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        updated: zodSchemaDate().optional().nullable()
    });
}

export function zodSchemaLink() {
    return z.object({
        params: zodSchemaMapStringString().optional().nullable(),
        rel: z.string().optional().nullable(),
        rels: zodSchemaListString().optional().nullable(),
        title: z.string().optional().nullable(),
        type: z.string().optional().nullable(),
        uri: zodSchemaURI().optional().nullable(),
        uriBuilder: zodSchemaUriBuilder().optional().nullable()
    });
}

export function zodSchemaSetEventType() {
    return z.array(zodSchemaEventType());
}
