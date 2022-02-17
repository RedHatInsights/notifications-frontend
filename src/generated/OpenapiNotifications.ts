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

  export const BasicAuthentication = zodSchemaBasicAuthentication();
  export type BasicAuthentication = {
    password: string;
    username: string;
  };

  export const BehaviorGroup = zodSchemaBehaviorGroup();
  export type BehaviorGroup = {
    actions?: Array<BehaviorGroupAction> | undefined | null;
    bundle?: Bundle | undefined | null;
    bundle_id: UUID;
    created?: string | undefined | null;
    default_behavior?: boolean | undefined | null;
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

  export const EmailSubscriptionProperties =
    zodSchemaEmailSubscriptionProperties();
  export type EmailSubscriptionProperties = {
    group_id?: UUID | undefined | null;
    ignore_preferences: boolean;
    only_admins: boolean;
  };

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
    sub_type?: string | undefined | null;
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

  export const EventLogEntry = zodSchemaEventLogEntry();
  export type EventLogEntry = {
    actions: Array<EventLogEntryAction>;
    application: string;
    bundle: string;
    created: string;
    event_type: string;
    id: UUID;
    payload?: string | undefined | null;
  };

  export const EventLogEntryAction = zodSchemaEventLogEntryAction();
  export type EventLogEntryAction = {
    details?:
      | {
          [x: string]: unknown;
        }
      | undefined
      | null;
    endpoint_id?: UUID | undefined | null;
    endpoint_sub_type?: string | undefined | null;
    endpoint_type: EndpointType;
    id: UUID;
    invocation_result: boolean;
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

  export const HttpType = zodSchemaHttpType();
  export type HttpType = 'GET' | 'POST' | 'PUT';

  export const Meta = zodSchemaMeta();
  export type Meta = {
    count: number;
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
    id?: UUID | undefined | null;
    invocationResult: boolean;
    invocationTime: number;
  };

  export const PageEventLogEntry = zodSchemaPageEventLogEntry();
  export type PageEventLogEntry = {
    data: Array<EventLogEntry>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const RenderEmailTemplateRequest =
    zodSchemaRenderEmailTemplateRequest();
  export type RenderEmailTemplateRequest = {
    body_template: string;
    payload: string;
    subject_template: string;
  };

  export const RequestDefaultBehaviorGroupPropertyList =
    zodSchemaRequestDefaultBehaviorGroupPropertyList();
  export type RequestDefaultBehaviorGroupPropertyList = {
    ignore_preferences: boolean;
    only_admins: boolean;
  };

  export const RequestEmailSubscriptionProperties =
    zodSchemaRequestEmailSubscriptionProperties();
  export type RequestEmailSubscriptionProperties = {
    only_admins: boolean;
  };

  export const Status = zodSchemaStatus();
  export type Status = 'MAINTENANCE' | 'UP';

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const WebhookProperties = zodSchemaWebhookProperties();
  export type WebhookProperties = {
    basic_authentication?: BasicAuthentication | undefined | null;
    disable_ssl_verification: boolean;
    method: HttpType;
    secret_token?: string | undefined | null;
    url: string;
  };

  export const __Empty = zodSchema__Empty();
  export type __Empty = string | undefined;

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

  function zodSchemaBasicAuthentication() {
      return z
      .object({
          password: z.string(),
          username: z.string()
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroup() {
      return z
      .object({
          actions: z.array(zodSchemaBehaviorGroupAction()).optional().nullable(),
          bundle: zodSchemaBundle().optional().nullable(),
          bundle_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          default_behavior: z.boolean().optional().nullable(),
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
      return z
      .object({
          group_id: zodSchemaUUID().optional().nullable(),
          ignore_preferences: z.boolean(),
          only_admins: z.boolean()
      })
      .nonstrict();
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
          sub_type: z.string().optional().nullable(),
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

  function zodSchemaEventLogEntry() {
      return z
      .object({
          actions: z.array(zodSchemaEventLogEntryAction()),
          application: z.string(),
          bundle: z.string(),
          created: z.string(),
          event_type: z.string(),
          id: zodSchemaUUID(),
          payload: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaEventLogEntryAction() {
      return z
      .object({
          details: z.record(z.unknown()).optional().nullable(),
          endpoint_id: zodSchemaUUID().optional().nullable(),
          endpoint_sub_type: z.string().optional().nullable(),
          endpoint_type: zodSchemaEndpointType(),
          id: zodSchemaUUID(),
          invocation_result: z.boolean()
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

  function zodSchemaHttpType() {
      return z.enum([ 'GET', 'POST', 'PUT' ]);
  }

  function zodSchemaMeta() {
      return z
      .object({
          count: z.number().int()
      })
      .nonstrict();
  }

  function zodSchemaNotificationHistory() {
      return z
      .object({
          created: z.string().optional().nullable(),
          details: z.record(z.unknown()).optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          invocationResult: z.boolean(),
          invocationTime: z.number().int()
      })
      .nonstrict();
  }

  function zodSchemaPageEventLogEntry() {
      return z
      .object({
          data: z.array(zodSchemaEventLogEntry()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict();
  }

  function zodSchemaRenderEmailTemplateRequest() {
      return z
      .object({
          body_template: z.string(),
          payload: z.string(),
          subject_template: z.string()
      })
      .nonstrict();
  }

  function zodSchemaRequestDefaultBehaviorGroupPropertyList() {
      return z
      .object({
          ignore_preferences: z.boolean(),
          only_admins: z.boolean()
      })
      .nonstrict();
  }

  function zodSchemaRequestEmailSubscriptionProperties() {
      return z
      .object({
          only_admins: z.boolean()
      })
      .nonstrict();
  }

  function zodSchemaStatus() {
      return z.enum([ 'MAINTENANCE', 'UP' ]);
  }

  function zodSchemaUUID() {
      return z.string();
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

  function zodSchema__Empty() {
      return z.string().max(0).optional();
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
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
                new ValidateRule(Schemas.BehaviorGroup, 'BehaviorGroup', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}'.replace(
            '{endpointId}',
            params.endpointId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{behaviorGroupId}/actions'.replace(
            '{behaviorGroupId}',
            params.behaviorGroupId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
            '{id}',
            params.id.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleId}/behaviorGroups'.replace(
            '{bundleId}',
            params.bundleId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
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
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}'.replace(
            '{behaviorGroupId}',
            params.behaviorGroupId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
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
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
            '{eventTypeId}',
            params.eventTypeId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [
                new ValidateRule(Response200, 'unknown', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/events
  // Retrieve the event log entries.
  export namespace EventServiceGetEvents {
    const AppIds = z.array(z.string());
    type AppIds = Array<string>;
    const BundleIds = z.array(z.string());
    type BundleIds = Array<string>;
    const EndDate = z.string();
    type EndDate = string;
    const EndpointTypes = z.array(Schemas.EndpointType);
    type EndpointTypes = Array<Schemas.EndpointType>;
    const EventTypeDisplayName = z.string();
    type EventTypeDisplayName = string;
    const IncludeActions = z.boolean();
    type IncludeActions = boolean;
    const IncludeDetails = z.boolean();
    type IncludeDetails = boolean;
    const IncludePayload = z.boolean();
    type IncludePayload = boolean;
    const InvocationResults = z.array(z.boolean());
    type InvocationResults = Array<boolean>;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const SortBy = z.string();
    type SortBy = string;
    const StartDate = z.string();
    type StartDate = string;
    export interface Params {
      appIds?: AppIds;
      bundleIds?: BundleIds;
      endDate?: EndDate;
      endpointTypes?: EndpointTypes;
      eventTypeDisplayName?: EventTypeDisplayName;
      includeActions?: IncludeActions;
      includeDetails?: IncludeDetails;
      includePayload?: IncludePayload;
      invocationResults?: InvocationResults;
      limit?: Limit;
      offset?: Offset;
      sortBy?: SortBy;
      startDate?: StartDate;
    }

    export type Payload =
      | ValidatedResponse<'PageEventLogEntry', 200, Schemas.PageEventLogEntry>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/events';
        const query = {} as Record<string, any>;
        if (params.appIds !== undefined) {
            query.appIds = params.appIds;
        }

        if (params.bundleIds !== undefined) {
            query.bundleIds = params.bundleIds;
        }

        if (params.endDate !== undefined) {
            query.endDate = params.endDate;
        }

        if (params.endpointTypes !== undefined) {
            query.endpointTypes = params.endpointTypes;
        }

        if (params.eventTypeDisplayName !== undefined) {
            query.eventTypeDisplayName = params.eventTypeDisplayName;
        }

        if (params.includeActions !== undefined) {
            query.includeActions = params.includeActions;
        }

        if (params.includeDetails !== undefined) {
            query.includeDetails = params.includeDetails;
        }

        if (params.includePayload !== undefined) {
            query.includePayload = params.includePayload;
        }

        if (params.invocationResults !== undefined) {
            query.invocationResults = params.invocationResults;
        }

        if (params.limit !== undefined) {
            query.limit = params.limit;
        }

        if (params.offset !== undefined) {
            query.offset = params.offset;
        }

        if (params.sortBy !== undefined) {
            query.sortBy = params.sortBy;
        }

        if (params.startDate !== undefined) {
            query.startDate = params.startDate;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(
                    Schemas.PageEventLogEntry,
                    'PageEventLogEntry',
                    200
                ),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
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
