/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import * as z from 'zod';
import { ValidatedResponse } from 'openapi2typescript';
import { Action } from 'react-fetching-library';
import { ValidateRule } from 'openapi2typescript';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript/react-fetching-library';

export const UUID = zodSchemaUUID();
export type UUID = string;

export const SetString = zodSchemaSetString();
export type SetString = Array<string>;

export const NewCookie = zodSchemaNewCookie();
export type NewCookie = {
  domain?: string | undefined | null;
  name?: string | undefined | null;
  path?: string | undefined | null;
  value?: string | undefined | null;
  version?: number | undefined | null;
  comment?: string | undefined | null;
  expiry?: Date | undefined | null;
  httpOnly?: boolean | undefined | null;
  maxAge?: number | undefined | null;
  secure?: boolean | undefined | null;
};

export const MapStringNewCookie = zodSchemaMapStringNewCookie();
export type MapStringNewCookie = {
  [x: string]: NewCookie;
};

export const Date = zodSchemaDate();
export type Date = string;

export const EntityTag = zodSchemaEntityTag();
export type EntityTag = {
  value?: string | undefined | null;
  weak?: boolean | undefined | null;
};

export const MultivaluedMapStringObject = zodSchemaMultivaluedMapStringObject();
export type MultivaluedMapStringObject = {
  [x: string]: unknown;
};

export const Locale = zodSchemaLocale();
export type Locale = {
  country?: string | undefined | null;
  displayCountry?: string | undefined | null;
  displayLanguage?: string | undefined | null;
  displayName?: string | undefined | null;
  displayScript?: string | undefined | null;
  displayVariant?: string | undefined | null;
  extensionKeys?: SetCharacter | undefined | null;
  iSO3Country?: string | undefined | null;
  iSO3Language?: string | undefined | null;
  language?: string | undefined | null;
  script?: string | undefined | null;
  unicodeLocaleAttributes?: SetString | undefined | null;
  unicodeLocaleKeys?: SetString | undefined | null;
  variant?: string | undefined | null;
};

export const Link = zodSchemaLink();
export type Link = {
  params?: MapStringString | undefined | null;
  rel?: string | undefined | null;
  rels?: ListString | undefined | null;
  title?: string | undefined | null;
  type?: string | undefined | null;
  uri?: URI | undefined | null;
  uriBuilder?: UriBuilder | undefined | null;
};

export const SetLink = zodSchemaSetLink();
export type SetLink = Array<Link>;

export const URI = zodSchemaURI();
export type URI = string;

export const MediaType = zodSchemaMediaType();
export type MediaType = {
  parameters?: MapStringString | undefined | null;
  subtype?: string | undefined | null;
  type?: string | undefined | null;
  wildcardSubtype?: boolean | undefined | null;
  wildcardType?: boolean | undefined | null;
};

export const StatusType = zodSchemaStatusType();
export type StatusType = {
  family?: Family | undefined | null;
  reasonPhrase?: string | undefined | null;
  statusCode?: number | undefined | null;
};

export const MultivaluedMapStringString = zodSchemaMultivaluedMapStringString();
export type MultivaluedMapStringString = {
  [x: string]: string;
};

export const Family = zodSchemaFamily();
export type Family =
  | 'CLIENT_ERROR'
  | 'INFORMATIONAL'
  | 'OTHER'
  | 'REDIRECTION'
  | 'SERVER_ERROR'
  | 'SUCCESSFUL';

export const MapStringString = zodSchemaMapStringString();
export type MapStringString = {
  [x: string]: string;
};

export const ListString = zodSchemaListString();
export type ListString = Array<string>;

export const UriBuilder = zodSchemaUriBuilder();
export type UriBuilder = unknown;

export const SetCharacter = zodSchemaSetCharacter();
export type SetCharacter = Array<string>;

export const Response = zodSchemaResponse();
export type Response = {
  allowedMethods?: SetString | undefined | null;
  cookies?: MapStringNewCookie | undefined | null;
  date?: Date | undefined | null;
  entity?: unknown | undefined | null;
  entityTag?: EntityTag | undefined | null;
  headers?: MultivaluedMapStringObject | undefined | null;
  language?: Locale | undefined | null;
  lastModified?: Date | undefined | null;
  length?: number | undefined | null;
  links?: SetLink | undefined | null;
  location?: URI | undefined | null;
  mediaType?: MediaType | undefined | null;
  metadata?: MultivaluedMapStringObject | undefined | null;
  status?: number | undefined | null;
  statusInfo?: StatusType | undefined | null;
  stringHeaders?: MultivaluedMapStringString | undefined | null;
};

export const Attributes = zodSchemaAttributes();
export type Attributes = unknown;

export const BasicAuthentication = zodSchemaBasicAuthentication();
export type BasicAuthentication = {
  password?: string | undefined | null;
  username?: string | undefined | null;
};

export const HttpType = zodSchemaHttpType();
export type HttpType = 'GET' | 'POST' | 'PUT';

export const WebhookAttributes = zodSchemaWebhookAttributes();
export type WebhookAttributes = {
  basic_authentication?: BasicAuthentication | undefined | null;
  disable_ssl_verification?: boolean | undefined | null;
  method: HttpType & ('GET' | 'POST' | 'PUT');
  secret_token?: string | undefined | null;
  url: string;
};

export const EmailAttributes = zodSchemaEmailAttributes();
export type EmailAttributes = unknown;

export const EndpointType = zodSchemaEndpointType();
export type EndpointType = 'webhook' | 'email' | 'default';

export const Endpoint = zodSchemaEndpoint();
export type Endpoint = {
  created?: Date | undefined | null;
  description: string;
  enabled?: boolean | undefined | null;
  id?: UUID | undefined | null;
  name: string;
  properties?: (WebhookAttributes | EmailAttributes) | undefined | null;
  type: EndpointType & ('webhook' | 'email' | 'default');
  updated?: Date | undefined | null;
};

export const Application = zodSchemaApplication();
export type Application = {
  created?: Date | undefined | null;
  description: string;
  eventTypes?: SetEventType | undefined | null;
  id?: UUID | undefined | null;
  name: string;
  updated?: Date | undefined | null;
};

export const SetEndpoint = zodSchemaSetEndpoint();
export type SetEndpoint = Array<Endpoint>;

export const EventType = zodSchemaEventType();
export type EventType = {
  application?: Application | undefined | null;
  description: string;
  endpoints?: SetEndpoint | undefined | null;
  id?: number | undefined | null;
  name: string;
};

export const SetEventType = zodSchemaSetEventType();
export type SetEventType = Array<EventType>;

export const Notification = zodSchemaNotification();
export type Notification = {
  endpoint?: Endpoint | undefined | null;
  payload?: unknown | undefined | null;
  tenant?: string | undefined | null;
};

export const JsonObject = zodSchemaJsonObject();
export type JsonObject = Array<unknown>;

export const NotificationHistory = zodSchemaNotificationHistory();
export type NotificationHistory = {
  created?: Date | undefined | null;
  details?: JsonObject | undefined | null;
  endpointId?: UUID | undefined | null;
  id?: number | undefined | null;
  invocationResult?: boolean | undefined | null;
  invocationTime?: number | undefined | null;
};

// GET /notifications/defaults
const NotificationServiceGetEndpointsForDefaultsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type NotificationServiceGetEndpointsForDefaultsParamResponse200 = Array<
  Endpoint
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
            new ValidateRule(
                NotificationServiceGetEndpointsForDefaultsParamResponse200,
                'NotificationServiceGetEndpointsForDefaultsParamResponse200',
                200
            )
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
        rules: [ new ValidateRule(Response, 'Response', 200) ]
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
        rules: [ new ValidateRule(Response, 'Response', 200) ]
    })
    .build();
};

// GET /notifications/eventTypes
const NotificationServiceGetEventTypesParamLimit = z.number().int();
type NotificationServiceGetEventTypesParamLimit = number;
const NotificationServiceGetEventTypesParamOffset = z.number().int();
type NotificationServiceGetEventTypesParamOffset = number;
const NotificationServiceGetEventTypesParamPageNumber = z.number().int();
type NotificationServiceGetEventTypesParamPageNumber = number;
const NotificationServiceGetEventTypesParamSortBy = z.string();
type NotificationServiceGetEventTypesParamSortBy = string;
const NotificationServiceGetEventTypesParamResponse200 = z.array(
    zodSchemaEventType()
);
type NotificationServiceGetEventTypesParamResponse200 = Array<EventType>;
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
            new ValidateRule(
                NotificationServiceGetEventTypesParamResponse200,
                'NotificationServiceGetEventTypesParamResponse200',
                200
            )
        ]
    })
    .build();
};

// GET /notifications/eventTypes/{eventTypeId}
const NotificationServiceGetLinkedEndpointsParamEventTypeId = z.number().int();
type NotificationServiceGetLinkedEndpointsParamEventTypeId = number;
const NotificationServiceGetLinkedEndpointsParamLimit = z.number().int();
type NotificationServiceGetLinkedEndpointsParamLimit = number;
const NotificationServiceGetLinkedEndpointsParamOffset = z.number().int();
type NotificationServiceGetLinkedEndpointsParamOffset = number;
const NotificationServiceGetLinkedEndpointsParamPageNumber = z.number().int();
type NotificationServiceGetLinkedEndpointsParamPageNumber = number;
const NotificationServiceGetLinkedEndpointsParamSortBy = z.string();
type NotificationServiceGetLinkedEndpointsParamSortBy = string;
const NotificationServiceGetLinkedEndpointsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type NotificationServiceGetLinkedEndpointsParamResponse200 = Array<Endpoint>;
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
            new ValidateRule(
                NotificationServiceGetLinkedEndpointsParamResponse200,
                'NotificationServiceGetLinkedEndpointsParamResponse200',
                200
            )
        ]
    })
    .build();
};

// PUT /notifications/eventTypes/{eventTypeId}/{endpointId}
const NotificationServiceLinkEndpointToEventTypeParamEventTypeId = z
.number()
.int();
type NotificationServiceLinkEndpointToEventTypeParamEventTypeId = number;
const NotificationServiceLinkEndpointToEventTypeParamResponse200 = z.string();
type NotificationServiceLinkEndpointToEventTypeParamResponse200 = string;
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
            new ValidateRule(
                NotificationServiceLinkEndpointToEventTypeParamResponse200,
                'NotificationServiceLinkEndpointToEventTypeParamResponse200',
                200
            )
        ]
    })
    .build();
};

// DELETE /notifications/eventTypes/{eventTypeId}/{endpointId}
const NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId = z
.number()
.int();
type NotificationServiceUnlinkEndpointFromEventTypeParamEventTypeId = number;
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
        rules: [ new ValidateRule(Response, 'Response', 200) ]
    })
    .build();
};

// GET /notifications/updates
const NotificationServiceGetNotificationUpdatesParamResponse200 = z.array(
    zodSchemaNotification()
);
type NotificationServiceGetNotificationUpdatesParamResponse200 = Array<
  Notification
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
            new ValidateRule(
                NotificationServiceGetNotificationUpdatesParamResponse200,
                'NotificationServiceGetNotificationUpdatesParamResponse200',
                200
            )
        ]
    })
    .build();
};

// DELETE /notifications/{id}
const NotificationServiceMarkReadParamBody = z.number().int();
type NotificationServiceMarkReadParamBody = number;
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
        rules: [ new ValidateRule(Response, 'Response', 200) ]
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
        eventTypes: zodSchemaSetEventType().optional().nullable(),
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
        application: z
        .lazy(() => zodSchemaApplication())
        .optional()
        .nullable(),
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
