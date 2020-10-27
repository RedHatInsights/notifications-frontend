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

// GET /endpoints
const EndpointServiceGetEndpointsParamActive = z.boolean();
type EndpointServiceGetEndpointsParamActive = boolean;
const EndpointServiceGetEndpointsParamLimit = z.number().int();
type EndpointServiceGetEndpointsParamLimit = number;
const EndpointServiceGetEndpointsParamOffset = z.number().int();
type EndpointServiceGetEndpointsParamOffset = number;
const EndpointServiceGetEndpointsParamPageNumber = z.number().int();
type EndpointServiceGetEndpointsParamPageNumber = number;
const EndpointServiceGetEndpointsParamSortBy = z.string();
type EndpointServiceGetEndpointsParamSortBy = string;
const EndpointServiceGetEndpointsParamType = z.string();
type EndpointServiceGetEndpointsParamType = string;
const EndpointServiceGetEndpointsParamResponse200 = z.array(
    zodSchemaEndpoint()
);
type EndpointServiceGetEndpointsParamResponse200 = Array<Endpoint>;
export interface EndpointServiceGetEndpoints {
  active?: EndpointServiceGetEndpointsParamActive;
  limit?: EndpointServiceGetEndpointsParamLimit;
  offset?: EndpointServiceGetEndpointsParamOffset;
  pageNumber?: EndpointServiceGetEndpointsParamPageNumber;
  sortBy?: EndpointServiceGetEndpointsParamSortBy;
  type?: EndpointServiceGetEndpointsParamType;
}

export type EndpointServiceGetEndpointsPayload =
  | ValidatedResponse<
      'EndpointServiceGetEndpointsParamResponse200',
      200,
      EndpointServiceGetEndpointsParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceGetEndpoints = Action<
  EndpointServiceGetEndpointsPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceGetEndpoints = (
    params: EndpointServiceGetEndpoints
): ActionEndpointServiceGetEndpoints => {
    const path = '/api/integrations/v1.0/endpoints';
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
            new ValidateRule(
                EndpointServiceGetEndpointsParamResponse200,
                'EndpointServiceGetEndpointsParamResponse200',
                200
            )
        ]
    })
    .build();
};

// POST /endpoints
export interface EndpointServiceCreateEndpoint {
  body: Endpoint;
}

export type EndpointServiceCreateEndpointPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceCreateEndpoint = Action<
  EndpointServiceCreateEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceCreateEndpoint = (
    params: EndpointServiceCreateEndpoint
): ActionEndpointServiceCreateEndpoint => {
    const path = '/api/integrations/v1.0/endpoints';
    const query = {} as Record<string, any>;
    return actionBuilder('POST', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [ new ValidateRule(Endpoint, 'Endpoint', 200) ]
    })
    .build();
};

// GET /endpoints/{id}
export interface EndpointServiceGetEndpoint {
  id: UUID;
}

export type EndpointServiceGetEndpointPayload =
  | ValidatedResponse<'Endpoint', 200, Endpoint>
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceGetEndpoint = Action<
  EndpointServiceGetEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceGetEndpoint = (
    params: EndpointServiceGetEndpoint
): ActionEndpointServiceGetEndpoint => {
    const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [ new ValidateRule(Endpoint, 'Endpoint', 200) ]
    })
    .build();
};

// PUT /endpoints/{id}
const EndpointServiceUpdateEndpointParamResponse200 = z.string();
type EndpointServiceUpdateEndpointParamResponse200 = string;
export interface EndpointServiceUpdateEndpoint {
  id: UUID;
  body: Endpoint;
}

export type EndpointServiceUpdateEndpointPayload =
  | ValidatedResponse<
      'EndpointServiceUpdateEndpointParamResponse200',
      200,
      EndpointServiceUpdateEndpointParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceUpdateEndpoint = Action<
  EndpointServiceUpdateEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceUpdateEndpoint = (
    params: EndpointServiceUpdateEndpoint
): ActionEndpointServiceUpdateEndpoint => {
    const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .data(params.body)
    .config({
        rules: [
            new ValidateRule(
                EndpointServiceUpdateEndpointParamResponse200,
                'EndpointServiceUpdateEndpointParamResponse200',
                200
            )
        ]
    })
    .build();
};

// DELETE /endpoints/{id}
const EndpointServiceDeleteEndpointParamResponse200 = z.string();
type EndpointServiceDeleteEndpointParamResponse200 = string;
export interface EndpointServiceDeleteEndpoint {
  id: UUID;
}

export type EndpointServiceDeleteEndpointPayload =
  | ValidatedResponse<
      'EndpointServiceDeleteEndpointParamResponse200',
      200,
      EndpointServiceDeleteEndpointParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceDeleteEndpoint = Action<
  EndpointServiceDeleteEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceDeleteEndpoint = (
    params: EndpointServiceDeleteEndpoint
): ActionEndpointServiceDeleteEndpoint => {
    const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [
            new ValidateRule(
                EndpointServiceDeleteEndpointParamResponse200,
                'EndpointServiceDeleteEndpointParamResponse200',
                200
            )
        ]
    })
    .build();
};

// PUT /endpoints/{id}/enable
const EndpointServiceEnableEndpointParamResponse200 = z.string();
type EndpointServiceEnableEndpointParamResponse200 = string;
export interface EndpointServiceEnableEndpoint {
  id: UUID;
}

export type EndpointServiceEnableEndpointPayload =
  | ValidatedResponse<
      'EndpointServiceEnableEndpointParamResponse200',
      200,
      EndpointServiceEnableEndpointParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceEnableEndpoint = Action<
  EndpointServiceEnableEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceEnableEndpoint = (
    params: EndpointServiceEnableEndpoint
): ActionEndpointServiceEnableEndpoint => {
    const path = '/api/integrations/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('PUT', path)
    .queryParams(query)
    .config({
        rules: [
            new ValidateRule(
                EndpointServiceEnableEndpointParamResponse200,
                'EndpointServiceEnableEndpointParamResponse200',
                200
            )
        ]
    })
    .build();
};

// DELETE /endpoints/{id}/enable
const EndpointServiceDisableEndpointParamResponse200 = z.string();
type EndpointServiceDisableEndpointParamResponse200 = string;
export interface EndpointServiceDisableEndpoint {
  id: UUID;
}

export type EndpointServiceDisableEndpointPayload =
  | ValidatedResponse<
      'EndpointServiceDisableEndpointParamResponse200',
      200,
      EndpointServiceDisableEndpointParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceDisableEndpoint = Action<
  EndpointServiceDisableEndpointPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceDisableEndpoint = (
    params: EndpointServiceDisableEndpoint
): ActionEndpointServiceDisableEndpoint => {
    const path = '/api/integrations/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('DELETE', path)
    .queryParams(query)
    .config({
        rules: [
            new ValidateRule(
                EndpointServiceDisableEndpointParamResponse200,
                'EndpointServiceDisableEndpointParamResponse200',
                200
            )
        ]
    })
    .build();
};

// GET /endpoints/{id}/history
const EndpointServiceGetEndpointHistoryParamResponse200 = z.array(
    zodSchemaNotificationHistory()
);
type EndpointServiceGetEndpointHistoryParamResponse200 = Array<
  NotificationHistory
>;
export interface EndpointServiceGetEndpointHistory {
  id: UUID;
}

export type EndpointServiceGetEndpointHistoryPayload =
  | ValidatedResponse<
      'EndpointServiceGetEndpointHistoryParamResponse200',
      200,
      EndpointServiceGetEndpointHistoryParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceGetEndpointHistory = Action<
  EndpointServiceGetEndpointHistoryPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceGetEndpointHistory = (
    params: EndpointServiceGetEndpointHistory
): ActionEndpointServiceGetEndpointHistory => {
    const path = '/api/integrations/v1.0/endpoints/{id}/history'.replace(
        '{id}',
        params.id.toString()
    );
    const query = {} as Record<string, any>;
    return actionBuilder('GET', path)
    .queryParams(query)
    .config({
        rules: [
            new ValidateRule(
                EndpointServiceGetEndpointHistoryParamResponse200,
                'EndpointServiceGetEndpointHistoryParamResponse200',
                200
            )
        ]
    })
    .build();
};

// GET /endpoints/{id}/history/{history_id}/details
const EndpointServiceGetDetailedEndpointHistoryParamHistoryId = z
.number()
.int();
type EndpointServiceGetDetailedEndpointHistoryParamHistoryId = number;
const EndpointServiceGetDetailedEndpointHistoryParamLimit = z.number().int();
type EndpointServiceGetDetailedEndpointHistoryParamLimit = number;
const EndpointServiceGetDetailedEndpointHistoryParamOffset = z.number().int();
type EndpointServiceGetDetailedEndpointHistoryParamOffset = number;
const EndpointServiceGetDetailedEndpointHistoryParamPageNumber = z
.number()
.int();
type EndpointServiceGetDetailedEndpointHistoryParamPageNumber = number;
const EndpointServiceGetDetailedEndpointHistoryParamPageSize = z.number().int();
type EndpointServiceGetDetailedEndpointHistoryParamPageSize = number;
const EndpointServiceGetDetailedEndpointHistoryParamSortBy = z.string();
type EndpointServiceGetDetailedEndpointHistoryParamSortBy = string;
const EndpointServiceGetDetailedEndpointHistoryParamResponse200 = z.string();
type EndpointServiceGetDetailedEndpointHistoryParamResponse200 = string;
export interface EndpointServiceGetDetailedEndpointHistory {
  historyId: EndpointServiceGetDetailedEndpointHistoryParamHistoryId;
  id: UUID;
  limit?: EndpointServiceGetDetailedEndpointHistoryParamLimit;
  offset?: EndpointServiceGetDetailedEndpointHistoryParamOffset;
  pageNumber?: EndpointServiceGetDetailedEndpointHistoryParamPageNumber;
  pageSize?: EndpointServiceGetDetailedEndpointHistoryParamPageSize;
  sortBy?: EndpointServiceGetDetailedEndpointHistoryParamSortBy;
}

export type EndpointServiceGetDetailedEndpointHistoryPayload =
  | ValidatedResponse<
      'EndpointServiceGetDetailedEndpointHistoryParamResponse200',
      200,
      EndpointServiceGetDetailedEndpointHistoryParamResponse200
    >
  | ValidatedResponse<'unknown', undefined, unknown>;
export type ActionEndpointServiceGetDetailedEndpointHistory = Action<
  EndpointServiceGetDetailedEndpointHistoryPayload,
  ActionValidatableConfig
>;
export const actionEndpointServiceGetDetailedEndpointHistory = (
    params: EndpointServiceGetDetailedEndpointHistory
): ActionEndpointServiceGetDetailedEndpointHistory => {
    const path = '/api/integrations/v1.0/endpoints/{id}/history/{history_id}/details'
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
            new ValidateRule(
                EndpointServiceGetDetailedEndpointHistoryParamResponse200,
                'EndpointServiceGetDetailedEndpointHistoryParamResponse200',
                200
            )
        ]
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
