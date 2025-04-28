/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import * as z from 'zod';
import { ValidatedResponse } from 'openapi2typescript';
import { Action } from 'react-fetching-library';
import { ValidateRule } from 'openapi2typescript';
import {
  ActionValidatableConfig,
  actionBuilder,
} from 'openapi2typescript/react-fetching-library';

export namespace Schemas {
  export const Application = zodSchemaApplication();
  export type Application = {
    bundle_id: UUID;
    display_name: string;
    event_types?: Array<EventType> | undefined | null;
    id?: UUID | undefined | null;
    name: string;
  };

  export const BasicAuthentication = zodSchemaBasicAuthentication();
  export type BasicAuthentication = {
    password?: string | undefined | null;
    username?: string | undefined | null;
  };

  export const Bundle = zodSchemaBundle();
  export type Bundle = {
    applications?: Array<Application> | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
  };

  export const CamelProperties = zodSchemaCamelProperties();
  export type CamelProperties = {
    basicAuthentication?: BasicAuthentication | undefined | null;
    disableSslVerification: boolean;
    extras?:
      | {
          [x: string]: string;
        }
      | undefined
      | null;
    secretToken?: string | undefined | null;
    url: string;
  };

  export const Endpoint = zodSchemaEndpoint();
  export type Endpoint = {
    created?: LocalDateTime | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    event_types?: Array<string> | undefined | null;
    event_types_group_by_bundles_and_applications?:
      | Array<Bundle>
      | undefined
      | null;
    id?: UUID | undefined | null;
    name: string;
    properties?:
      | (
          | CamelProperties
          | SystemSubscriptionProperties
          | WebhookProperties
          | PagerDutyProperties
        )
      | undefined
      | null;
    server_errors?: number | undefined | null;
    status?: EndpointStatus | undefined | null;
    sub_type?: string | undefined | null;
    type: EndpointType;
    updated?: LocalDateTime | undefined | null;
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

  export const EndpointStatus = zodSchemaEndpointStatus();
  export type EndpointStatus =
    | 'DELETING'
    | 'FAILED'
    | 'NEW'
    | 'PROVISIONING'
    | 'READY'
    | 'UNKNOWN';

  export const EndpointTestRequest = zodSchemaEndpointTestRequest();
  export type EndpointTestRequest = {
    message: string;
  };

  export const EndpointType = zodSchemaEndpointType();
  export type EndpointType =
    | 'ansible'
    | 'camel'
    | 'drawer'
    | 'email_subscription'
    | 'webhook'
    | 'pagerduty';

  export const EventType = zodSchemaEventType();
  export type EventType = {
    application?: Application | undefined | null;
    description?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
  };

  export const HttpType = zodSchemaHttpType();
  export type HttpType = 'GET' | 'POST' | 'PUT';

  export const LocalDateTime = zodSchemaLocalDateTime();
  export type LocalDateTime = string;

  export const Meta = zodSchemaMeta();
  export type Meta = {
    count: number;
  };

  export const NotificationHistory = zodSchemaNotificationHistory();
  export type NotificationHistory = {
    created?: LocalDateTime | undefined | null;
    details?:
      | {
          [x: string]: unknown;
        }
      | undefined
      | null;
    endpointId?: UUID | undefined | null;
    endpointType?: EndpointType | undefined | null;
    id?: UUID | undefined | null;
    invocationResult: boolean;
    invocationTime: number;
    status: NotificationStatus;
  };

  export const NotificationStatus = zodSchemaNotificationStatus();
  export type NotificationStatus =
    | 'FAILED_INTERNAL'
    | 'FAILED_EXTERNAL'
    | 'PROCESSING'
    | 'SENT'
    | 'SUCCESS';

  export const PagerDutyProperties = zodSchemaPagerDutyProperties();
  export type PagerDutyProperties = {
    secretToken: string;
    severity: PagerDutySeverity;
  };

  export const PagerDutySeverity = zodSchemaPagerDutySeverity();
  export type PagerDutySeverity = 'critical' | 'error' | 'warning' | 'info';

  export const RequestSystemSubscriptionProperties =
    zodSchemaRequestSystemSubscriptionProperties();
  export type RequestSystemSubscriptionProperties = {
    group_id?: UUID | undefined | null;
    only_admins: boolean;
  };

  export const SystemSubscriptionProperties =
    zodSchemaSystemSubscriptionProperties();
  export type SystemSubscriptionProperties = {
    groupId?: UUID | undefined | null;
    ignorePreferences?: boolean | undefined | null;
    onlyAdmins?: boolean | undefined | null;
  };

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const WebhookProperties = zodSchemaWebhookProperties();
  export type WebhookProperties = {
    basicAuthentication?: BasicAuthentication | undefined | null;
    bearerAuthentication?: string | undefined | null;
    disableSslVerification: boolean;
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
        display_name: z.string(),
        event_types: z.array(zodSchemaEventType()).optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaBasicAuthentication() {
    return z
      .object({
        password: z.string().optional().nullable(),
        username: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBundle() {
    return z
      .object({
        applications: z.array(zodSchemaApplication()).optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaCamelProperties() {
    return z
      .object({
        basicAuthentication: zodSchemaBasicAuthentication()
          .optional()
          .nullable(),
        disableSslVerification: z.boolean(),
        extras: z.record(z.string()).optional().nullable(),
        secretToken: z.string().optional().nullable(),
        url: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaEndpoint() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        description: z.string(),
        enabled: z.boolean().optional().nullable(),
        event_types: z.array(z.string()).optional().nullable(),
        event_types_group_by_bundles_and_applications: z
          .array(zodSchemaBundle())
          .optional()
          .nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        properties: z
          .union([
            zodSchemaCamelProperties(),
            zodSchemaSystemSubscriptionProperties(),
            zodSchemaWebhookProperties(),
            zodSchemaPagerDutyProperties(),
          ])
          .optional()
          .nullable(),
        server_errors: z.number().int().optional().nullable(),
        status: zodSchemaEndpointStatus().optional().nullable(),
        sub_type: z.string().optional().nullable(),
        type: zodSchemaEndpointType(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointPage() {
    return z
      .object({
        data: z.array(zodSchemaEndpoint()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointProperties() {
    return z.unknown();
  }

  function zodSchemaEndpointStatus() {
    return z.enum([
      'DELETING',
      'FAILED',
      'NEW',
      'PROVISIONING',
      'READY',
      'UNKNOWN',
    ]);
  }

  function zodSchemaEndpointTestRequest() {
    return z
      .object({
        message: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointType() {
    return z.enum([
      'ansible',
      'camel',
      'drawer',
      'email_subscription',
      'webhook',
      'pagerduty',
    ]);
  }

  function zodSchemaEventType() {
    return z
      .object({
        application: z
          .lazy(() => zodSchemaApplication())
          .optional()
          .nullable(),
        description: z.string().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaHttpType() {
    return z.enum(['GET', 'POST', 'PUT']);
  }

  function zodSchemaLocalDateTime() {
    return z.string();
  }

  function zodSchemaMeta() {
    return z
      .object({
        count: z.number().int(),
      })
      .nonstrict();
  }

  function zodSchemaNotificationHistory() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        details: z.record(z.unknown()).optional().nullable(),
        endpointId: zodSchemaUUID().optional().nullable(),
        endpointType: zodSchemaEndpointType().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        invocationResult: z.boolean(),
        invocationTime: z.number().int(),
        status: zodSchemaNotificationStatus(),
      })
      .nonstrict();
  }

  function zodSchemaNotificationStatus() {
    return z.enum([
      'FAILED_INTERNAL',
      'FAILED_EXTERNAL',
      'PROCESSING',
      'SENT',
      'SUCCESS',
    ]);
  }

  function zodSchemaPagerDutyProperties() {
    return z
      .object({
        secretToken: z.string(),
        severity: zodSchemaPagerDutySeverity(),
      })
      .nonstrict();
  }

  function zodSchemaPagerDutySeverity() {
    return z.enum(['critical', 'error', 'warning', 'info']);
  }

  function zodSchemaRequestSystemSubscriptionProperties() {
    return z
      .object({
        group_id: zodSchemaUUID().optional().nullable(),
        only_admins: z.boolean(),
      })
      .nonstrict();
  }

  function zodSchemaSystemSubscriptionProperties() {
    return z
      .object({
        groupId: zodSchemaUUID().optional().nullable(),
        ignorePreferences: z.boolean().optional().nullable(),
        onlyAdmins: z.boolean().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaUUID() {
    return z.string();
  }

  function zodSchemaWebhookProperties() {
    return z
      .object({
        basicAuthentication: zodSchemaBasicAuthentication()
          .optional()
          .nullable(),
        bearerAuthentication: z.string().optional().nullable(),
        disableSslVerification: z.boolean(),
        method: zodSchemaHttpType(),
        secretToken: z.string().optional().nullable(),
        url: z.string(),
      })
      .nonstrict();
  }

  function zodSchema__Empty() {
    return z.string().max(0).optional();
  }
}

export module Operations {
  // GET /endpoints
  // List endpoints
  export module EndpointResource$v1GetEndpoints {
    const Limit = z.number().int();
    type Limit = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const Active = z.boolean();
    type Active = boolean;
    const Name = z.string();
    type Name = string;
    const Offset = z.number().int();
    type Offset = number;
    const SortBy = z.string();
    type SortBy = string;
    const Type = z.array(z.string());
    type Type = Array<string>;
    export interface Params {
      limit?: Limit;
      pageNumber?: PageNumber;
      active?: Active;
      name?: Name;
      offset?: Offset;
      sortBy?: SortBy;
      type?: Type;
    }

    export type Payload =
      | ValidatedResponse<'EndpointPage', 200, Schemas.EndpointPage>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints';
      const query = {} as Record<string, any>;
      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
      }

      if (params['active'] !== undefined) {
        query['active'] = params['active'];
      }

      if (params['name'] !== undefined) {
        query['name'] = params['name'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['sortBy'] !== undefined) {
        query['sort_by'] = params['sortBy'];
      }

      if (params['type'] !== undefined) {
        query['type'] = params['type'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.EndpointPage, 'EndpointPage', 200)],
        })
        .build();
    };
  }
  // POST /endpoints
  // Create a new endpoint
  export module EndpointResource$v1CreateEndpoint {
    export interface Params {
      body: Schemas.Endpoint;
    }

    export type Payload =
      | ValidatedResponse<'Endpoint', 200, Schemas.Endpoint>
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints';
      const query = {} as Record<string, any>;
      return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [
            new ValidateRule(Schemas.Endpoint, 'Endpoint', 200),
            new ValidateRule(Schemas.__Empty, '__Empty', 400),
          ],
        })
        .build();
    };
  }
  // POST /endpoints/system/drawer_subscription
  // Add a drawer endpoint
  export module EndpointResource$v1GetOrCreateDrawerSubscriptionEndpoint {
    export interface Params {
      body: Schemas.RequestSystemSubscriptionProperties;
    }

    export type Payload =
      | ValidatedResponse<'Endpoint', 200, Schemas.Endpoint>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/integrations/v1.0/endpoints/system/drawer_subscription';
      const query = {} as Record<string, any>;
      return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Schemas.Endpoint, 'Endpoint', 200)],
        })
        .build();
    };
  }
  // POST /endpoints/system/email_subscription
  // Create an email subscription endpoint
  export module EndpointResource$v1GetOrCreateEmailSubscriptionEndpoint {
    export interface Params {
      body: Schemas.RequestSystemSubscriptionProperties;
    }

    export type Payload =
      | ValidatedResponse<'Endpoint', 200, Schemas.Endpoint>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/system/email_subscription';
      const query = {} as Record<string, any>;
      return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Schemas.Endpoint, 'Endpoint', 200)],
        })
        .build();
    };
  }
  // PUT /endpoints/{endpointId}/eventType/{eventTypeId}
  // Add a link between an endpoint and an event type
  export module EndpointResource$v1AddEventTypeToEndpoint {
    const Response204 = z.string();
    type Response204 = string;
    const Response404 = z.string();
    type Response404 = string;
    export interface Params {
      endpointId: Schemas.UUID;
      eventTypeId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 204, Response204>
      | ValidatedResponse<'unknown', 404, Response404>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/integrations/v1.0/endpoints/{endpointId}/eventType/{eventTypeId}'
          .replace('{endpointId}', params['endpointId'].toString())
          .replace('{eventTypeId}', params['eventTypeId'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
          rules: [
            new ValidateRule(Response204, 'unknown', 204),
            new ValidateRule(Response404, 'unknown', 404),
          ],
        })
        .build();
    };
  }
  // DELETE /endpoints/{endpointId}/eventType/{eventTypeId}
  // Delete the link between an endpoint and an event type
  export module EndpointResource$v1DeleteEventTypeFromEndpoint {
    const Response204 = z.string();
    type Response204 = string;
    const Response404 = z.string();
    type Response404 = string;
    export interface Params {
      endpointId: Schemas.UUID;
      eventTypeId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 204, Response204>
      | ValidatedResponse<'unknown', 404, Response404>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/integrations/v1.0/endpoints/{endpointId}/eventType/{eventTypeId}'
          .replace('{endpointId}', params['endpointId'].toString())
          .replace('{eventTypeId}', params['eventTypeId'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
          rules: [
            new ValidateRule(Response204, 'unknown', 204),
            new ValidateRule(Response404, 'unknown', 404),
          ],
        })
        .build();
    };
  }
  // PUT /endpoints/{endpointId}/eventTypes
  // Update  links between an endpoint and event types
  export module EndpointResource$v1UpdateEventTypesLinkedToEndpoint {
    const Body = z.array(z.string());
    type Body = Array<string>;
    const Response204 = z.string();
    type Response204 = string;
    const Response404 = z.string();
    type Response404 = string;
    export interface Params {
      endpointId: Schemas.UUID;
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 204, Response204>
      | ValidatedResponse<'unknown', 404, Response404>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/integrations/v1.0/endpoints/{endpointId}/eventTypes'.replace(
          '{endpointId}',
          params['endpointId'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [
            new ValidateRule(Response204, 'unknown', 204),
            new ValidateRule(Response404, 'unknown', 404),
          ],
        })
        .build();
    };
  }
  // GET /endpoints/{id}
  // Retrieve an endpoint
  export module EndpointResource$v1GetEndpoint {
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'Endpoint', 200, Schemas.Endpoint>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.Endpoint, 'Endpoint', 200)],
        })
        .build();
    };
  }
  // PUT /endpoints/{id}
  // Update an endpoint
  export module EndpointResource$v1UpdateEndpoint {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      id: Schemas.UUID;
      body: Schemas.Endpoint;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // DELETE /endpoints/{id}
  // Delete an endpoint
  export module EndpointResource$v1DeleteEndpoint {
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.__Empty, '__Empty', 204)],
        })
        .build();
    };
  }
  // PUT /endpoints/{id}/enable
  // Enable an endpoint
  export module EndpointResource$v1EnableEndpoint {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // DELETE /endpoints/{id}/enable
  // Disable an endpoint
  export module EndpointResource$v1DisableEndpoint {
    export interface Params {
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}/enable'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.__Empty, '__Empty', 204)],
        })
        .build();
    };
  }
  // GET /endpoints/{id}/history
  export module EndpointResource$v1GetEndpointHistory {
    const Limit = z.number().int();
    type Limit = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const IncludeDetail = z.boolean();
    type IncludeDetail = boolean;
    const Offset = z.number().int();
    type Offset = number;
    const SortBy = z.string();
    type SortBy = string;
    const Response200 = z.array(Schemas.NotificationHistory);
    type Response200 = Array<Schemas.NotificationHistory>;
    export interface Params {
      limit?: Limit;
      pageNumber?: PageNumber;
      includeDetail?: IncludeDetail;
      id: Schemas.UUID;
      offset?: Offset;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{id}/history'.replace(
        '{id}',
        params['id'].toString()
      );
      const query = {} as Record<string, any>;
      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
      }

      if (params['includeDetail'] !== undefined) {
        query['includeDetail'] = params['includeDetail'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['sortBy'] !== undefined) {
        query['sort_by'] = params['sortBy'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /endpoints/{id}/history/{history_id}/details
  // Retrieve event notification details
  export module EndpointResource$v1GetDetailedEndpointHistory {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      historyId: Schemas.UUID;
      id: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/integrations/v1.0/endpoints/{id}/history/{history_id}/details'
          .replace('{history_id}', params['historyId'].toString())
          .replace('{id}', params['id'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // POST /endpoints/{uuid}/test
  // Generate a test notification
  export module EndpointResource$v1TestEndpoint {
    const Uuid = z.string();
    type Uuid = string;
    export interface Params {
      uuid: Uuid;
      body: Schemas.EndpointTestRequest;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/{uuid}/test'.replace(
        '{uuid}',
        params['uuid'].toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Schemas.__Empty, '__Empty', 204)],
        })
        .build();
    };
  }
}
