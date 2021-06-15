/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import { ValidatedResponse } from 'openapi2typescript';
import { ValidateRule } from 'openapi2typescript';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript/react-fetching-library';
import { Action } from 'react-fetching-library';
import * as z from 'zod';

export namespace Schemas {
  export const Application = zodSchemaApplication();
  export type Application = {
    bundle_id: UUID;
    created?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: string | undefined | null;
  };

  export const AtomicLong = zodSchemaAtomicLong();
  export type AtomicLong = {
    acquire?: number | undefined | null;
    andDecrement?: number | undefined | null;
    andIncrement?: number | undefined | null;
    opaque?: number | undefined | null;
    plain?: number | undefined | null;
    release?: number | undefined | null;
    value?: number | undefined | null;
  };

  export const BasicAuthentication = zodSchemaBasicAuthentication();
  export type BasicAuthentication = {
    password?: string | undefined | null;
    username?: string | undefined | null;
  };

  export const BehaviorGroup = zodSchemaBehaviorGroup();
  export type BehaviorGroup = {
    actions?: Array<BehaviorGroupAction> | undefined | null;
    bundle_id: UUID;
    created?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    updated?: string | undefined | null;
  };

  export const BehaviorGroupAction = zodSchemaBehaviorGroupAction();
  export type BehaviorGroupAction = {
    created?: string | undefined | null;
    endpoint?: Endpoint | undefined | null;
    id?: BehaviorGroupActionId | undefined | null;
  };

  export const BehaviorGroupActionId = zodSchemaBehaviorGroupActionId();
  export type BehaviorGroupActionId = {
    behaviorGroupId: UUID;
    endpointId: UUID;
  };

  export const Bundle = zodSchemaBundle();
  export type Bundle = {
    created?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: string | undefined | null;
  };

  export const CamelProperties = zodSchemaCamelProperties();
  export type CamelProperties = {
    basic_authentication?: BasicAuthentication | undefined | null;
    disable_ssl_verification: boolean;
    extras?:
      | {
          [x: string]: string;
        }
      | undefined
      | null;
    secret_token?: string | undefined | null;
    sub_type?: string | undefined | null;
    url: string;
  };

  export const CurrentStatus = zodSchemaCurrentStatus();
  export type CurrentStatus = {
    end_time?: string | undefined | null;
    start_time?: string | undefined | null;
    status: Status;
  };

  export const EmailSubscriptionProperties = zodSchemaEmailSubscriptionProperties();
  export type EmailSubscriptionProperties = unknown;

  export const EmailSubscriptionType = zodSchemaEmailSubscriptionType();
  export type EmailSubscriptionType = 'DAILY' | 'INSTANT';

  export const Endpoint = zodSchemaEndpoint();
  export type Endpoint = {
    created?: string | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    id?: UUID | undefined | null;
    name: string;
    properties?:
      | (WebhookProperties | EmailSubscriptionProperties | CamelProperties)
      | undefined
      | null;
    type: EndpointType;
    updated?: string | undefined | null;
  };

  export const EndpointPage = zodSchemaEndpointPage();
  export type EndpointPage = {
    data: Array<Endpoint>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const EndpointProperties = zodSchemaEndpointProperties();
  export type EndpointProperties = unknown;

  export const EndpointType = zodSchemaEndpointType();
  export type EndpointType =
    | 'webhook'
    | 'email_subscription'
    | 'default'
    | 'camel';

  export const EntityTag = zodSchemaEntityTag();
  export type EntityTag = {
    value?: string | undefined | null;
    weak?: boolean | undefined | null;
  };

  export const EventType = zodSchemaEventType();
  export type EventType = {
    application?: Application | undefined | null;
    application_id: UUID;
    description?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
  };

  export const Facet = zodSchemaFacet();
  export type Facet = {
    displayName: string;
    id: string;
    name: string;
  };

  export const Family = zodSchemaFamily();
  export type Family =
    | 'CLIENT_ERROR'
    | 'INFORMATIONAL'
    | 'OTHER'
    | 'REDIRECTION'
    | 'SERVER_ERROR'
    | 'SUCCESSFUL';

  export const HttpType = zodSchemaHttpType();
  export type HttpType = 'GET' | 'POST' | 'PUT';

  export const Link = zodSchemaLink();
  export type Link = {
    params?:
      | {
          [x: string]: string;
        }
      | undefined
      | null;
    rel?: string | undefined | null;
    rels?: Array<string> | undefined | null;
    title?: string | undefined | null;
    type?: string | undefined | null;
    uri?: string | undefined | null;
    uriBuilder?: UriBuilder | undefined | null;
  };

  export const Locale = zodSchemaLocale();
  export type Locale = {
    country?: string | undefined | null;
    displayCountry?: string | undefined | null;
    displayLanguage?: string | undefined | null;
    displayName?: string | undefined | null;
    displayScript?: string | undefined | null;
    displayVariant?: string | undefined | null;
    extensionKeys?: Array<string> | undefined | null;
    iSO3Country?: string | undefined | null;
    iSO3Language?: string | undefined | null;
    language?: string | undefined | null;
    script?: string | undefined | null;
    unicodeLocaleAttributes?: Array<string> | undefined | null;
    unicodeLocaleKeys?: Array<string> | undefined | null;
    variant?: string | undefined | null;
  };

  export const MediaType = zodSchemaMediaType();
  export type MediaType = {
    parameters?:
      | {
          [x: string]: string;
        }
      | undefined
      | null;
    subtype?: string | undefined | null;
    type?: string | undefined | null;
    wildcardSubtype?: boolean | undefined | null;
    wildcardType?: boolean | undefined | null;
  };

  export const Meta = zodSchemaMeta();
  export type Meta = {
    count: number;
  };

  export const MigrationReport = zodSchemaMigrationReport();
  export type MigrationReport = {
    accountsWithDefaults?: AtomicLong | undefined | null;
    accountsWithNonDefaults?: AtomicLong | undefined | null;
    actionsPersisted?: AtomicLong | undefined | null;
    behaviorGroupsAggregated?: AtomicLong | undefined | null;
    behaviorGroupsPersisted?: AtomicLong | undefined | null;
    behaviorsPersisted?: AtomicLong | undefined | null;
    durationInMs?: AtomicLong | undefined | null;
  };

  export const MultivaluedMapStringObject = zodSchemaMultivaluedMapStringObject();
  export type MultivaluedMapStringObject = {
    [x: string]: Array<unknown>;
  };

  export const MultivaluedMapStringString = zodSchemaMultivaluedMapStringString();
  export type MultivaluedMapStringString = {
    [x: string]: Array<string>;
  };

  export const NewCookie = zodSchemaNewCookie();
  export type NewCookie = {
    comment?: string | undefined | null;
    domain?: string | undefined | null;
    expiry?: string | undefined | null;
    httpOnly?: boolean | undefined | null;
    maxAge?: number | undefined | null;
    name?: string | undefined | null;
    path?: string | undefined | null;
    secure?: boolean | undefined | null;
    value?: string | undefined | null;
    version?: number | undefined | null;
  };

  export const NotificationHistory = zodSchemaNotificationHistory();
  export type NotificationHistory = {
    created?: string | undefined | null;
    details?:
      | {
          [x: string]: unknown;
        }
      | undefined
      | null;
    endpointId?: UUID | undefined | null;
    eventId?: string | undefined | null;
    id?: UUID | undefined | null;
    invocationResult: boolean;
    invocationTime: number;
  };

  export const RbacRaw = zodSchemaRbacRaw();
  export type RbacRaw = {
    data?:
      | Array<{
          [x: string]: unknown;
        }>
      | undefined
      | null;
    links?:
      | {
          [x: string]: string;
        }
      | undefined
      | null;
    meta?:
      | {
          [x: string]: number;
        }
      | undefined
      | null;
  };

  export const Response = zodSchemaResponse();
  export type Response = {
    allowedMethods?: Array<string> | undefined | null;
    cookies?:
      | {
          [x: string]: NewCookie;
        }
      | undefined
      | null;
    date?: string | undefined | null;
    entity?: unknown | undefined | null;
    entityTag?: EntityTag | undefined | null;
    headers?: MultivaluedMapStringObject | undefined | null;
    language?: Locale | undefined | null;
    lastModified?: string | undefined | null;
    length?: number | undefined | null;
    links?: Array<Link> | undefined | null;
    location?: string | undefined | null;
    mediaType?: MediaType | undefined | null;
    metadata?: MultivaluedMapStringObject | undefined | null;
    status?: number | undefined | null;
    statusInfo?: StatusType | undefined | null;
    stringHeaders?: MultivaluedMapStringString | undefined | null;
  };

  export const Status = zodSchemaStatus();
  export type Status = 'MAINTENANCE' | 'UP';

  export const StatusType = zodSchemaStatusType();
  export type StatusType = {
    family?: Family | undefined | null;
    reasonPhrase?: string | undefined | null;
    statusCode?: number | undefined | null;
  };

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const UriBuilder = zodSchemaUriBuilder();
  export type UriBuilder = unknown;

  export const WebhookProperties = zodSchemaWebhookProperties();
  export type WebhookProperties = {
    basic_authentication?: BasicAuthentication | undefined | null;
    disable_ssl_verification: boolean;
    method: HttpType;
    secret_token?: string | undefined | null;
    url: string;
  };

  function zodSchemaApplication() {
      return z
      .object({
          bundle_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaAtomicLong() {
      return z
      .object({
          acquire: z.number().int().optional().nullable(),
          andDecrement: z.number().int().optional().nullable(),
          andIncrement: z.number().int().optional().nullable(),
          opaque: z.number().int().optional().nullable(),
          plain: z.number().int().optional().nullable(),
          release: z.number().int().optional().nullable(),
          value: z.number().int().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBasicAuthentication() {
      return z
      .object({
          password: z.string().optional().nullable(),
          username: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroup() {
      return z
      .object({
          actions: z.array(zodSchemaBehaviorGroupAction()).optional().nullable(),
          bundle_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          updated: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupAction() {
      return z
      .object({
          created: z.string().optional().nullable(),
          endpoint: zodSchemaEndpoint().optional().nullable(),
          id: zodSchemaBehaviorGroupActionId().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupActionId() {
      return z
      .object({
          behaviorGroupId: zodSchemaUUID(),
          endpointId: zodSchemaUUID()
      })
      .nonstrict();
  }

  function zodSchemaBundle() {
      return z
      .object({
          created: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaCamelProperties() {
      return z
      .object({
          basic_authentication: zodSchemaBasicAuthentication()
          .optional()
          .nullable(),
          disable_ssl_verification: z.boolean(),
          extras: z.record(z.string()).optional().nullable(),
          secret_token: z.string().optional().nullable(),
          sub_type: z.string().optional().nullable(),
          url: z.string()
      })
      .nonstrict();
  }

  function zodSchemaCurrentStatus() {
      return z
      .object({
          end_time: z.string().optional().nullable(),
          start_time: z.string().optional().nullable(),
          status: zodSchemaStatus()
      })
      .nonstrict();
  }

  function zodSchemaEmailSubscriptionProperties() {
      return z.unknown();
  }

  function zodSchemaEmailSubscriptionType() {
      return z.enum([ 'DAILY', 'INSTANT' ]);
  }

  function zodSchemaEndpoint() {
      return z
      .object({
          created: z.string().optional().nullable(),
          description: z.string(),
          enabled: z.boolean().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          properties: z
          .union([
              zodSchemaWebhookProperties(),
              zodSchemaEmailSubscriptionProperties(),
              zodSchemaCamelProperties()
          ])
          .optional()
          .nullable(),
          type: zodSchemaEndpointType(),
          updated: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaEndpointPage() {
      return z
      .object({
          data: z.array(zodSchemaEndpoint()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict();
  }

  function zodSchemaEndpointProperties() {
      return z.unknown();
  }

  function zodSchemaEndpointType() {
      return z.enum([ 'webhook', 'email_subscription', 'default', 'camel' ]);
  }

  function zodSchemaEntityTag() {
      return z
      .object({
          value: z.string().optional().nullable(),
          weak: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaEventType() {
      return z
      .object({
          application: zodSchemaApplication().optional().nullable(),
          application_id: zodSchemaUUID(),
          description: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaFacet() {
      return z
      .object({
          displayName: z.string(),
          id: z.string(),
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaFamily() {
      return z.enum([
          'CLIENT_ERROR',
          'INFORMATIONAL',
          'OTHER',
          'REDIRECTION',
          'SERVER_ERROR',
          'SUCCESSFUL'
      ]);
  }

  function zodSchemaHttpType() {
      return z.enum([ 'GET', 'POST', 'PUT' ]);
  }

  function zodSchemaLink() {
      return z
      .object({
          params: z.record(z.string()).optional().nullable(),
          rel: z.string().optional().nullable(),
          rels: z.array(z.string()).optional().nullable(),
          title: z.string().optional().nullable(),
          type: z.string().optional().nullable(),
          uri: z.string().optional().nullable(),
          uriBuilder: zodSchemaUriBuilder().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaLocale() {
      return z
      .object({
          country: z.string().optional().nullable(),
          displayCountry: z.string().optional().nullable(),
          displayLanguage: z.string().optional().nullable(),
          displayName: z.string().optional().nullable(),
          displayScript: z.string().optional().nullable(),
          displayVariant: z.string().optional().nullable(),
          extensionKeys: z.array(z.string()).optional().nullable(),
          iSO3Country: z.string().optional().nullable(),
          iSO3Language: z.string().optional().nullable(),
          language: z.string().optional().nullable(),
          script: z.string().optional().nullable(),
          unicodeLocaleAttributes: z.array(z.string()).optional().nullable(),
          unicodeLocaleKeys: z.array(z.string()).optional().nullable(),
          variant: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMediaType() {
      return z
      .object({
          parameters: z.record(z.string()).optional().nullable(),
          subtype: z.string().optional().nullable(),
          type: z.string().optional().nullable(),
          wildcardSubtype: z.boolean().optional().nullable(),
          wildcardType: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMeta() {
      return z
      .object({
          count: z.number().int()
      })
      .nonstrict();
  }

  function zodSchemaMigrationReport() {
      return z
      .object({
          accountsWithDefaults: zodSchemaAtomicLong().optional().nullable(),
          accountsWithNonDefaults: zodSchemaAtomicLong().optional().nullable(),
          actionsPersisted: zodSchemaAtomicLong().optional().nullable(),
          behaviorGroupsAggregated: zodSchemaAtomicLong().optional().nullable(),
          behaviorGroupsPersisted: zodSchemaAtomicLong().optional().nullable(),
          behaviorsPersisted: zodSchemaAtomicLong().optional().nullable(),
          durationInMs: zodSchemaAtomicLong().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMultivaluedMapStringObject() {
      return z.record(z.array(z.unknown()));
  }

  function zodSchemaMultivaluedMapStringString() {
      return z.record(z.array(z.string()));
  }

  function zodSchemaNewCookie() {
      return z
      .object({
          comment: z.string().optional().nullable(),
          domain: z.string().optional().nullable(),
          expiry: z.string().optional().nullable(),
          httpOnly: z.boolean().optional().nullable(),
          maxAge: z.number().int().optional().nullable(),
          name: z.string().optional().nullable(),
          path: z.string().optional().nullable(),
          secure: z.boolean().optional().nullable(),
          value: z.string().optional().nullable(),
          version: z.number().int().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaNotificationHistory() {
      return z
      .object({
          created: z.string().optional().nullable(),
          details: z.record(z.unknown()).optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          eventId: z.string().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          invocationResult: z.boolean(),
          invocationTime: z.number().int()
      })
      .nonstrict();
  }

  function zodSchemaRbacRaw() {
      return z
      .object({
          data: z.array(z.record(z.unknown())).optional().nullable(),
          links: z.record(z.string()).optional().nullable(),
          meta: z.record(z.number().int()).optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaResponse() {
      return z
      .object({
          allowedMethods: z.array(z.string()).optional().nullable(),
          cookies: z.record(zodSchemaNewCookie()).optional().nullable(),
          date: z.string().optional().nullable(),
          entity: z.unknown().optional().nullable(),
          entityTag: zodSchemaEntityTag().optional().nullable(),
          headers: zodSchemaMultivaluedMapStringObject().optional().nullable(),
          language: zodSchemaLocale().optional().nullable(),
          lastModified: z.string().optional().nullable(),
          length: z.number().int().optional().nullable(),
          links: z.array(zodSchemaLink()).optional().nullable(),
          location: z.string().optional().nullable(),
          mediaType: zodSchemaMediaType().optional().nullable(),
          metadata: zodSchemaMultivaluedMapStringObject().optional().nullable(),
          status: z.number().int().optional().nullable(),
          statusInfo: zodSchemaStatusType().optional().nullable(),
          stringHeaders: zodSchemaMultivaluedMapStringString()
          .optional()
          .nullable()
      })
      .nonstrict();
  }

  function zodSchemaStatus() {
      return z.enum([ 'MAINTENANCE', 'UP' ]);
  }

  function zodSchemaStatusType() {
      return z
      .object({
          family: zodSchemaFamily().optional().nullable(),
          reasonPhrase: z.string().optional().nullable(),
          statusCode: z.number().int().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaUUID() {
      return z.string();
  }

  function zodSchemaUriBuilder() {
      return z.unknown();
  }

  function zodSchemaWebhookProperties() {
      return z
      .object({
          basic_authentication: zodSchemaBasicAuthentication()
          .optional()
          .nullable(),
          disable_ssl_verification: z.boolean(),
          method: zodSchemaHttpType(),
          secret_token: z.string().optional().nullable(),
          url: z.string()
      })
      .nonstrict();
  }
}

export namespace Operations {
  // POST /notifications/behaviorGroups
  // Create a behavior group.
  export namespace NotificationServiceCreateBehaviorGroup {
    export interface Params {
      body: Schemas.BehaviorGroup;
    }

    export type Payload =
      | ValidatedResponse<'BehaviorGroup', 200, Schemas.BehaviorGroup>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/behaviorGroups';
        const query = {} as Record<string, any>;
        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Schemas.BehaviorGroup, 'BehaviorGroup', 200)
            ]
        })
        .build();
    };
  }
  // GET /notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}
  // Retrieve the behavior groups affected by the removal of an endpoint.
  export namespace NotificationServiceGetBehaviorGroupsAffectedByRemovalOfEndpoint {
    const Response200 = z.array(Schemas.BehaviorGroup);
    type Response200 = Array<Schemas.BehaviorGroup>;
    export interface Params {
      endpointId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}'.replace(
            '{endpointId}',
            params.endpointId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // PUT /notifications/behaviorGroups/{behaviorGroupId}/actions
  // Update the list of actions of a behavior group.
  export namespace NotificationServiceUpdateBehaviorGroupActions {
    const Body = z.array(z.string());
    type Body = Array<string>;
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      behaviorGroupId: Schemas.UUID;
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/behaviorGroups/{behaviorGroupId}/actions'.replace(
            '{behaviorGroupId}',
            params.behaviorGroupId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // PUT /notifications/behaviorGroups/{id}
  // Update a behavior group.
  export namespace NotificationServiceUpdateBehaviorGroup {
    const Response200 = z.boolean();
    type Response200 = boolean;
    export interface Params {
      id: Schemas.UUID;
      body: Schemas.BehaviorGroup;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // DELETE /notifications/behaviorGroups/{id}
  // Delete a behavior group.
  export namespace NotificationServiceDeleteBehaviorGroup {
    const Response200 = z.boolean();
    type Response200 = boolean;
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleId}/behaviorGroups
  // Retrieve the behavior groups of a bundle.
  export namespace NotificationServiceFindBehaviorGroupsByBundleId {
    const Response200 = z.array(Schemas.BehaviorGroup);
    type Response200 = Array<Schemas.BehaviorGroup>;
    export interface Params {
      bundleId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/bundles/{bundleId}/behaviorGroups'.replace(
            '{bundleId}',
            params.bundleId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes
  // Retrieve all event types. The returned list can be filtered by bundle or application.
  export namespace NotificationServiceGetEventTypes {
    const ApplicationIds = z.array(z.string());
    type ApplicationIds = Array<string>;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    const Response200 = z.array(Schemas.EventType);
    type Response200 = Array<Schemas.EventType>;
    export interface Params {
      applicationIds?: ApplicationIds;
      bundleId?: Schemas.UUID;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes';
        const query = {} as Record<string, any>;
        if (params.applicationIds !== undefined) {
            query.applicationIds = params.applicationIds;
        }

        if (params.bundleId !== undefined) {
            query.bundleId = params.bundleId;
        }

        if (params.limit !== undefined) {
            query.limit = params.limit;
        }

        if (params.offset !== undefined) {
            query.offset = params.offset;
        }

        if (params.pageNumber !== undefined) {
            query.pageNumber = params.pageNumber;
        }

        if (params.sortBy !== undefined) {
            query.sort_by = params.sortBy;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}
  // Retrieve the event types affected by the removal of a behavior group.
  export namespace NotificationServiceGetEventTypesAffectedByRemovalOfBehaviorGroup {
    const Response200 = z.array(Schemas.EventType);
    type Response200 = Array<Schemas.EventType>;
    export interface Params {
      behaviorGroupId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}'.replace(
            '{behaviorGroupId}',
            params.behaviorGroupId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/{eventTypeId}/behaviorGroups
  // Retrieve the behavior groups linked to an event type.
  export namespace NotificationServiceGetLinkedBehaviorGroups {
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    const Response200 = z.array(Schemas.BehaviorGroup);
    type Response200 = Array<Schemas.BehaviorGroup>;
    export interface Params {
      eventTypeId: Schemas.UUID;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
            '{eventTypeId}',
            params.eventTypeId.toString()
        );
        const query = {} as Record<string, any>;
        if (params.limit !== undefined) {
            query.limit = params.limit;
        }

        if (params.offset !== undefined) {
            query.offset = params.offset;
        }

        if (params.pageNumber !== undefined) {
            query.pageNumber = params.pageNumber;
        }

        if (params.sortBy !== undefined) {
            query.sort_by = params.sortBy;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // PUT /notifications/eventTypes/{eventTypeId}/behaviorGroups
  // Update the list of behavior groups of an event type.
  export namespace NotificationServiceUpdateEventTypeBehaviors {
    const Body = z.array(z.string());
    type Body = Array<string>;
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      eventTypeId: Schemas.UUID;
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
            '{eventTypeId}',
            params.eventTypeId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/facets/applications
  // Return a thin list of configured applications. This can be used to configure a filter in the UI
  export namespace NotificationServiceGetApplicationsFacets {
    const BundleName = z.string();
    type BundleName = string;
    const Response200 = z.array(Schemas.Facet);
    type Response200 = Array<Schemas.Facet>;
    export interface Params {
      bundleName?: BundleName;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/facets/applications';
        const query = {} as Record<string, any>;
        if (params.bundleName !== undefined) {
            query.bundleName = params.bundleName;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/facets/bundles
  // Return a thin list of configured bundles. This can be used to configure a filter in the UI
  export namespace NotificationServiceGetBundleFacets {
    const Response200 = z.array(Schemas.Facet);
    type Response200 = Array<Schemas.Facet>;
    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/facets/bundles';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // DELETE /notifications/{id}
  export namespace NotificationServiceMarkRead {
    const Id = z.number().int();
    type Id = number;
    const Response204 = z.string();
    type Response204 = string;
    export interface Params {
      id: Id;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 204, Response204>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response204, 'unknown', 204) ]
        })
        .build();
    };
  }
}
