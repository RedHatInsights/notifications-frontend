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

export const UUID = zodSchemaUUID();
export type UUID = z.infer<typeof UUID>;

export const SetString = zodSchemaSetString();
export type SetString = z.infer<typeof SetString>;

export const NewCookie = zodSchemaNewCookie();
export type NewCookie = z.infer<typeof NewCookie>;

export const MapStringNewCookie = zodSchemaMapStringNewCookie();
export type MapStringNewCookie = z.infer<typeof MapStringNewCookie>;

export const Date = zodSchemaDate();
export type Date = z.infer<typeof Date>;

export const EntityTag = zodSchemaEntityTag();
export type EntityTag = z.infer<typeof EntityTag>;

export const MultivaluedMapStringObject = zodSchemaMultivaluedMapStringObject();
export type MultivaluedMapStringObject = z.infer<
  typeof MultivaluedMapStringObject
>;

export const Locale = zodSchemaLocale();
export type Locale = z.infer<typeof Locale>;

export const Link = zodSchemaLink();
export type Link = z.infer<typeof Link>;

export const SetLink = zodSchemaSetLink();
export type SetLink = z.infer<typeof SetLink>;

export const URI = zodSchemaURI();
export type URI = z.infer<typeof URI>;

export const MediaType = zodSchemaMediaType();
export type MediaType = z.infer<typeof MediaType>;

export const StatusType = zodSchemaStatusType();
export type StatusType = z.infer<typeof StatusType>;

export const MultivaluedMapStringString = zodSchemaMultivaluedMapStringString();
export type MultivaluedMapStringString = z.infer<
  typeof MultivaluedMapStringString
>;

export const Family = zodSchemaFamily();
export type Family = z.infer<typeof Family>;

export const MapStringString = zodSchemaMapStringString();
export type MapStringString = z.infer<typeof MapStringString>;

export const ListString = zodSchemaListString();
export type ListString = z.infer<typeof ListString>;

export const UriBuilder = zodSchemaUriBuilder();
export type UriBuilder = z.infer<typeof UriBuilder>;

export const SetCharacter = zodSchemaSetCharacter();
export type SetCharacter = z.infer<typeof SetCharacter>;

export const Response = zodSchemaResponse();
export type Response = z.infer<typeof Response>;

export const Attributes = zodSchemaAttributes();
export type Attributes = z.infer<typeof Attributes>;

export const BasicAuthentication = zodSchemaBasicAuthentication();
export type BasicAuthentication = z.infer<typeof BasicAuthentication>;

export const HttpType = zodSchemaHttpType();
export type HttpType = z.infer<typeof HttpType>;

export const WebhookAttributes = zodSchemaWebhookAttributes();
export type WebhookAttributes = z.infer<typeof WebhookAttributes>;

export const EmailAttributes = zodSchemaEmailAttributes();
export type EmailAttributes = z.infer<typeof EmailAttributes>;

export const EndpointType = zodSchemaEndpointType();
export type EndpointType = z.infer<typeof EndpointType>;

export const Endpoint = zodSchemaEndpoint();
export type Endpoint = z.infer<typeof Endpoint>;

export const Application = zodSchemaApplication();
export type Application = z.infer<typeof Application>;

export const SetEndpoint = zodSchemaSetEndpoint();
export type SetEndpoint = z.infer<typeof SetEndpoint>;

export const EventType = zodSchemaEventType();
export type EventType = z.infer<typeof EventType>;

export const SetEventType = zodSchemaSetEventType();
export type SetEventType = z.infer<typeof SetEventType>;

export const Notification = zodSchemaNotification();
export type Notification = z.infer<typeof Notification>;

export const JsonObject = zodSchemaJsonObject();
export type JsonObject = z.infer<typeof JsonObject>;

export const NotificationHistory = zodSchemaNotificationHistory();
export type NotificationHistory = z.infer<typeof NotificationHistory>;

// GET /notifications/defaults
const NotificationServiceGetEndpointsForDefaultsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type NotificationServiceGetEndpointsForDefaultsParamResponse200 = z.infer<
  typeof NotificationServiceGetEndpointsForDefaultsParamResponse200
>;
export type NotificationServiceGetEndpointsForDefaultsPayload =
  | ValidatedResponse<
      'NotificationServiceGetEndpointsForDefaultsParamResponse200',
      200,
      NotificationServiceGetEndpointsForDefaultsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceGetEndpointsForDefaults = Action<
  NotificationServiceGetEndpointsForDefaultsPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceGetEndpointsForDefaults = (): ActionNotificationServiceGetEndpointsForDefaults => {
    const path = '/api/notifications/v1.0/notifications/defaults';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: NotificationServiceGetEndpointsForDefaultsParamResponse200,
                type: 'NotificationServiceGetEndpointsForDefaultsParamResponse200'
            }
        ]
    })
    .build();
};

// PUT /notifications/defaults/{endpointId}
export interface NotificationServiceAddEndpointToDefaults {
  endpointId: UUID;
}

export type NotificationServiceAddEndpointToDefaultsPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceAddEndpointToDefaults = Action<
  NotificationServiceAddEndpointToDefaultsPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceAddEndpointToDefaults = (
    params: NotificationServiceAddEndpointToDefaults
): ActionNotificationServiceAddEndpointToDefaults => {
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
export interface NotificationServiceDeleteEndpointFromDefaults {
  endpointId: UUID;
}

export type NotificationServiceDeleteEndpointFromDefaultsPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceDeleteEndpointFromDefaults = Action<
  NotificationServiceDeleteEndpointFromDefaultsPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceDeleteEndpointFromDefaults = (
    params: NotificationServiceDeleteEndpointFromDefaults
): ActionNotificationServiceDeleteEndpointFromDefaults => {
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
const NotificationServiceGetEventTypesParamLimit = z.number().int();
type NotificationServiceGetEventTypesParamLimit = z.infer<
  typeof NotificationServiceGetEventTypesParamLimit
>;
const NotificationServiceGetEventTypesParamOffset = z.number().int();
type NotificationServiceGetEventTypesParamOffset = z.infer<
  typeof NotificationServiceGetEventTypesParamOffset
>;
const NotificationServiceGetEventTypesParamPageNumber = z.number().int();
type NotificationServiceGetEventTypesParamPageNumber = z.infer<
  typeof NotificationServiceGetEventTypesParamPageNumber
>;
const NotificationServiceGetEventTypesParamSortBy = z.string();
type NotificationServiceGetEventTypesParamSortBy = z.infer<
  typeof NotificationServiceGetEventTypesParamSortBy
>;
const NotificationServiceGetEventTypesParamResponse200 = z.array(
    zodSchemaEventType()
);
type NotificationServiceGetEventTypesParamResponse200 = z.infer<
  typeof NotificationServiceGetEventTypesParamResponse200
>;
export interface NotificationServiceGetEventTypes {
  limit?: NotificationServiceGetEventTypesParamLimit;
  offset?: NotificationServiceGetEventTypesParamOffset;
  pageNumber?: NotificationServiceGetEventTypesParamPageNumber;
  sortBy?: NotificationServiceGetEventTypesParamSortBy;
}

export type NotificationServiceGetEventTypesPayload =
  | ValidatedResponse<
      'NotificationServiceGetEventTypesParamResponse200',
      200,
      NotificationServiceGetEventTypesParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceGetEventTypes = Action<
  NotificationServiceGetEventTypesPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceGetEventTypes = (
    params: NotificationServiceGetEventTypes
): ActionNotificationServiceGetEventTypes => {
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
                zod: NotificationServiceGetEventTypesParamResponse200,
                type: 'NotificationServiceGetEventTypesParamResponse200'
            }
        ]
    })
    .build();
};

// GET /notifications/eventTypes/{eventTypeId}
const NotificationServiceGetLinkedEndpointsParamEventTypeId = z.number().int();
type NotificationServiceGetLinkedEndpointsParamEventTypeId = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamEventTypeId
>;
const NotificationServiceGetLinkedEndpointsParamLimit = z.number().int();
type NotificationServiceGetLinkedEndpointsParamLimit = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamLimit
>;
const NotificationServiceGetLinkedEndpointsParamOffset = z.number().int();
type NotificationServiceGetLinkedEndpointsParamOffset = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamOffset
>;
const NotificationServiceGetLinkedEndpointsParamPageNumber = z.number().int();
type NotificationServiceGetLinkedEndpointsParamPageNumber = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamPageNumber
>;
const NotificationServiceGetLinkedEndpointsParamSortBy = z.string();
type NotificationServiceGetLinkedEndpointsParamSortBy = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamSortBy
>;
const NotificationServiceGetLinkedEndpointsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type NotificationServiceGetLinkedEndpointsParamResponse200 = z.infer<
  typeof NotificationServiceGetLinkedEndpointsParamResponse200
>;
export interface NotificationServiceGetLinkedEndpoints {
  eventTypeId: NotificationServiceGetLinkedEndpointsParamEventTypeId;
  limit?: NotificationServiceGetLinkedEndpointsParamLimit;
  offset?: NotificationServiceGetLinkedEndpointsParamOffset;
  pageNumber?: NotificationServiceGetLinkedEndpointsParamPageNumber;
  sortBy?: NotificationServiceGetLinkedEndpointsParamSortBy;
}

export type NotificationServiceGetLinkedEndpointsPayload =
  | ValidatedResponse<
      'NotificationServiceGetLinkedEndpointsParamResponse200',
      200,
      NotificationServiceGetLinkedEndpointsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceGetLinkedEndpoints = Action<
  NotificationServiceGetLinkedEndpointsPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceGetLinkedEndpoints = (
    params: NotificationServiceGetLinkedEndpoints
): ActionNotificationServiceGetLinkedEndpoints => {
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
                zod: NotificationServiceGetLinkedEndpointsParamResponse200,
                type: 'NotificationServiceGetLinkedEndpointsParamResponse200'
            }
        ]
    })
    .build();
};

// PUT /notifications/eventTypes/{eventTypeId}/{endpointId}
const NotificationServiceLinkEndpointToEventTypeParamEventTypeId = z
.number()
.int();
type NotificationServiceLinkEndpointToEventTypeParamEventTypeId = z.infer<
  typeof NotificationServiceLinkEndpointToEventTypeParamEventTypeId
>;
const NotificationServiceLinkEndpointToEventTypeParamResponse200 = z.string();
type NotificationServiceLinkEndpointToEventTypeParamResponse200 = z.infer<
  typeof NotificationServiceLinkEndpointToEventTypeParamResponse200
>;
export interface NotificationServiceLinkEndpointToEventType {
  endpointId: UUID;
  eventTypeId: NotificationServiceLinkEndpointToEventTypeParamEventTypeId;
}

export type NotificationServiceLinkEndpointToEventTypePayload =
  | ValidatedResponse<
      'NotificationServiceLinkEndpointToEventTypeParamResponse200',
      200,
      NotificationServiceLinkEndpointToEventTypeParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceLinkEndpointToEventType = Action<
  NotificationServiceLinkEndpointToEventTypePayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceLinkEndpointToEventType = (
    params: NotificationServiceLinkEndpointToEventType
): ActionNotificationServiceLinkEndpointToEventType => {
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
                zod: NotificationServiceLinkEndpointToEventTypeParamResponse200,
                type: 'NotificationServiceLinkEndpointToEventTypeParamResponse200'
            }
        ]
    })
    .build();
};

// DELETE /notifications/eventTypes/{eventTypeId}/{endpointId}
const NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId = z
.number()
.int();
type NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId = z.infer<
  typeof NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId
>;
export interface NotificationServiceUnlinkEndpointFromEventType {
  endpointId: UUID;
  eventTypeId: NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId;
}

export type NotificationServiceUnlinkEndpointFromEventTypePayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceUnlinkEndpointFromEventType = Action<
  NotificationServiceUnlinkEndpointFromEventTypePayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceUnlinkEndpointFromEventType = (
    params: NotificationServiceUnlinkEndpointFromEventType
): ActionNotificationServiceUnlinkEndpointFromEventType => {
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

// GET /notifications/updates
const NotificationServiceGetNotificationUpdatesParamResponse200 = z.array(
    zodSchemaNotification()
);
type NotificationServiceGetNotificationUpdatesParamResponse200 = z.infer<
  typeof NotificationServiceGetNotificationUpdatesParamResponse200
>;
export type NotificationServiceGetNotificationUpdatesPayload =
  | ValidatedResponse<
      'NotificationServiceGetNotificationUpdatesParamResponse200',
      200,
      NotificationServiceGetNotificationUpdatesParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceGetNotificationUpdates = Action<
  NotificationServiceGetNotificationUpdatesPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceGetNotificationUpdates = (): ActionNotificationServiceGetNotificationUpdates => {
    const path = '/api/notifications/v1.0/notifications/updates';
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            {
                status: 200,
                zod: NotificationServiceGetNotificationUpdatesParamResponse200,
                type: 'NotificationServiceGetNotificationUpdatesParamResponse200'
            }
        ]
    })
    .build();
};

// DELETE /notifications/{id}
const NotificationServiceMarkReadParamBody = z.number().int();
type NotificationServiceMarkReadParamBody = z.infer<
  typeof NotificationServiceMarkReadParamBody
>;
export interface NotificationServiceMarkRead {
  body: NotificationServiceMarkReadParamBody;
}

export type NotificationServiceMarkReadPayload =
  | ValidatedResponse<'Response', 200, Response>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionNotificationServiceMarkRead = Action<
  NotificationServiceMarkReadPayload,
  ActionValidatableConfig
>;
export const actionNotificationServiceMarkRead = (
    params: NotificationServiceMarkRead
): ActionNotificationServiceMarkRead => {
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

export function zodSchemaUUID() {
    return z.string();
}

export function zodSchemaSetString() {
    return z.array(z.string());
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

export function zodSchemaMapStringNewCookie() {
    return z.record(zodSchemaNewCookie());
}

export function zodSchemaDate() {
    return z.string();
}

export function zodSchemaEntityTag() {
    return z.object({
        value: z.string().optional().nullable(),
        weak: z.boolean().optional().nullable()
    });
}

export function zodSchemaMultivaluedMapStringObject() {
    return z.record(z.unknown());
}

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

export function zodSchemaSetLink() {
    return z.array(zodSchemaLink());
}

export function zodSchemaURI() {
    return z.string();
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

export function zodSchemaMapStringString() {
    return z.record(z.string());
}

export function zodSchemaListString() {
    return z.array(z.string());
}

export function zodSchemaUriBuilder() {
    return z.unknown();
}

export function zodSchemaSetCharacter() {
    return z.array(z.string());
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

export function zodSchemaAttributes() {
    return z.unknown();
}

export function zodSchemaBasicAuthentication() {
    return z.object({
        password: z.string().optional().nullable(),
        username: z.string().optional().nullable()
    });
}

export function zodSchemaHttpType() {
    return z.enum([ 'GET', 'POST', 'PUT' ]);
}

export function zodSchemaWebhookAttributes() {
    return z.object({
        basic_authentication: zodSchemaBasicAuthentication().optional().nullable(),
        disable_ssl_verification: z.boolean().optional().nullable(),
        method: z.intersection(zodSchemaHttpType(), z.enum([ 'GET', 'POST', 'PUT' ])),
        secret_token: z.string().optional().nullable(),
        url: z.string()
    });
}

export function zodSchemaEmailAttributes() {
    return z.unknown();
}

export function zodSchemaEndpointType() {
    return z.enum([ 'webhook', 'email', 'default' ]);
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
        type: z.intersection(
            zodSchemaEndpointType(),
            z.enum([ 'webhook', 'email', 'default' ])
        ),
        updated: zodSchemaDate().optional().nullable()
    });
}

export function zodSchemaApplication() {
    return z.object({
        created: zodSchemaDate().optional().nullable(),
        description: z.string(),
        eventTypes: z.unknown(), // zodSchemaSetEventType().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        updated: zodSchemaDate().optional().nullable()
    });
}

export function zodSchemaSetEndpoint() {
    return z.array(zodSchemaEndpoint());
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

export function zodSchemaSetEventType() {
    return z.array(zodSchemaEventType());
}

export function zodSchemaNotification() {
    return z.object({
        endpoint: zodSchemaEndpoint().optional().nullable(),
        payload: z.unknown().optional().nullable(),
        tenant: z.string().optional().nullable()
    });
}

export function zodSchemaJsonObject() {
    return z.array(z.unknown());
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
