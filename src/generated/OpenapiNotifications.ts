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
    created?: LocalDateTime | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: LocalDateTime | undefined | null;
  };

  export const BehaviorGroup = zodSchemaBehaviorGroup();
  export type BehaviorGroup = {
    actions?: Array<BehaviorGroupAction> | undefined | null;
    behaviors?: Array<EventTypeBehavior> | undefined | null;
    bundle?: Bundle | undefined | null;
    bundle_id: UUID;
    created?: LocalDateTime | undefined | null;
    default_behavior?: boolean | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    updated?: LocalDateTime | undefined | null;
  };

  export const BehaviorGroupAction = zodSchemaBehaviorGroupAction();
  export type BehaviorGroupAction = {
    created?: LocalDateTime | undefined | null;
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
    created?: LocalDateTime | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: LocalDateTime | undefined | null;
  };

  export const CreateBehaviorGroupRequest =
    zodSchemaCreateBehaviorGroupRequest();
  export type CreateBehaviorGroupRequest = {
    bundle_id?: UUID | undefined | null;
    bundle_name?: string | undefined | null;
    bundle_uuid_or_bundle_name_valid?: boolean | undefined | null;
    display_name: string;
    endpoint_ids?: Array<string> | undefined | null;
    event_type_ids?: Array<string> | undefined | null;
  };

  export const CreateBehaviorGroupResponse =
    zodSchemaCreateBehaviorGroupResponse();
  export type CreateBehaviorGroupResponse = {
    bundle_id: UUID;
    created: LocalDateTime;
    display_name: string;
    endpoints: Array<string>;
    event_types: Array<string>;
    id: UUID;
  };

  export const DrawerEntryPayload = zodSchemaDrawerEntryPayload();
  export type DrawerEntryPayload = {
    bundle?: string | undefined | null;
    created?: LocalDateTime | undefined | null;
    description?: string | undefined | null;
    id?: UUID | undefined | null;
    read: boolean;
    source?: string | undefined | null;
    title?: string | undefined | null;
  };

  export const Endpoint = zodSchemaEndpoint();
  export type Endpoint = {
    created?: LocalDateTime | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    id?: UUID | undefined | null;
    name: string;
    properties?: EndpointProperties | undefined | null;
    server_errors?: number | undefined | null;
    status?: EndpointStatus | undefined | null;
    sub_type?: string | undefined | null;
    type?: EndpointType | undefined | null;
    updated?: LocalDateTime | undefined | null;
  };

  export const EndpointProperties = zodSchemaEndpointProperties();
  export type EndpointProperties = unknown;

  export const EndpointStatus = zodSchemaEndpointStatus();
  export type EndpointStatus =
    | 'READY'
    | 'UNKNOWN'
    | 'NEW'
    | 'PROVISIONING'
    | 'DELETING'
    | 'FAILED';

  export const EndpointType = zodSchemaEndpointType();
  export type EndpointType =
    | 'ansible'
    | 'camel'
    | 'drawer'
    | 'email_subscription'
    | 'webhook'
    | 'pagerduty';

  export const EventLogEntry = zodSchemaEventLogEntry();
  export type EventLogEntry = {
    actions: Array<EventLogEntryAction>;
    application: string;
    bundle: string;
    created: LocalDateTime;
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
    status: EventLogEntryActionStatus;
  };

  export const EventLogEntryActionStatus = zodSchemaEventLogEntryActionStatus();
  export type EventLogEntryActionStatus =
    | 'SENT'
    | 'SUCCESS'
    | 'PROCESSING'
    | 'FAILED'
    | 'UNKNOWN';

  export const EventType = zodSchemaEventType();
  export type EventType = {
    application?: Application | undefined | null;
    application_id: UUID;
    description?: string | undefined | null;
    display_name: string;
    fully_qualified_name?: string | undefined | null;
    id?: UUID | undefined | null;
    name: string;
    not_subscription_locked_or_subscribed_by_default?:
      | boolean
      | undefined
      | null;
    subscribed_by_default?: boolean | undefined | null;
    subscription_locked?: boolean | undefined | null;
    visible?: boolean | undefined | null;
  };

  export const EventTypeBehavior = zodSchemaEventTypeBehavior();
  export type EventTypeBehavior = {
    created?: LocalDateTime | undefined | null;
    event_type?: EventType | undefined | null;
    id?: EventTypeBehaviorId | undefined | null;
  };

  export const EventTypeBehaviorId = zodSchemaEventTypeBehaviorId();
  export type EventTypeBehaviorId = {
    behaviorGroupId: UUID;
    eventTypeId: UUID;
  };

  export const Facet = zodSchemaFacet();
  export type Facet = {
    children?: Array<Facet> | undefined | null;
    displayName: string;
    id: string;
    name: string;
  };

  export const LocalDate = zodSchemaLocalDate();
  export type LocalDate = string;

  export const LocalDateTime = zodSchemaLocalDateTime();
  export type LocalDateTime = string;

  export const LocalTime = zodSchemaLocalTime();
  export type LocalTime = string;

  export const Meta = zodSchemaMeta();
  export type Meta = {
    count: number;
  };

  export const PageDrawerEntryPayload = zodSchemaPageDrawerEntryPayload();
  export type PageDrawerEntryPayload = {
    data: Array<DrawerEntryPayload>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const PageEventLogEntry = zodSchemaPageEventLogEntry();
  export type PageEventLogEntry = {
    data: Array<EventLogEntry>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const PageEventType = zodSchemaPageEventType();
  export type PageEventType = {
    data: Array<EventType>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const UpdateBehaviorGroupRequest =
    zodSchemaUpdateBehaviorGroupRequest();
  export type UpdateBehaviorGroupRequest = {
    display_name?: string | undefined | null;
    display_name_not_null_and_blank?: boolean | undefined | null;
    endpoint_ids?: Array<string> | undefined | null;
    event_type_ids?: Array<string> | undefined | null;
  };

  export const UpdateNotificationDrawerStatus =
    zodSchemaUpdateNotificationDrawerStatus();
  export type UpdateNotificationDrawerStatus = {
    notification_ids: Array<string>;
    read_status: boolean;
  };

  export const __Empty = zodSchema__Empty();
  export type __Empty = string | undefined;

  function zodSchemaApplication() {
    return z
      .object({
        bundle_id: zodSchemaUUID(),
        created: zodSchemaLocalDateTime().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroup() {
    return z
      .object({
        actions: z.array(zodSchemaBehaviorGroupAction()).optional().nullable(),
        behaviors: z.array(zodSchemaEventTypeBehavior()).optional().nullable(),
        bundle: zodSchemaBundle().optional().nullable(),
        bundle_id: zodSchemaUUID(),
        created: zodSchemaLocalDateTime().optional().nullable(),
        default_behavior: z.boolean().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupAction() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        endpoint: zodSchemaEndpoint().optional().nullable(),
        id: zodSchemaBehaviorGroupActionId().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupActionId() {
    return z
      .object({
        behaviorGroupId: zodSchemaUUID(),
        endpointId: zodSchemaUUID(),
      })
      .nonstrict();
  }

  function zodSchemaBundle() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaCreateBehaviorGroupRequest() {
    return z
      .object({
        bundle_id: zodSchemaUUID().optional().nullable(),
        bundle_name: z.string().optional().nullable(),
        bundle_uuid_or_bundle_name_valid: z.boolean().optional().nullable(),
        display_name: z.string(),
        endpoint_ids: z.array(z.string()).optional().nullable(),
        event_type_ids: z.array(z.string()).optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaCreateBehaviorGroupResponse() {
    return z
      .object({
        bundle_id: zodSchemaUUID(),
        created: zodSchemaLocalDateTime(),
        display_name: z.string(),
        endpoints: z.array(z.string()),
        event_types: z.array(z.string()),
        id: zodSchemaUUID(),
      })
      .nonstrict();
  }

  function zodSchemaDrawerEntryPayload() {
    return z
      .object({
        bundle: z.string().optional().nullable(),
        created: zodSchemaLocalDateTime().optional().nullable(),
        description: z.string().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        read: z.boolean(),
        source: z.string().optional().nullable(),
        title: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEndpoint() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        description: z.string(),
        enabled: z.boolean().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        properties: zodSchemaEndpointProperties().optional().nullable(),
        server_errors: z.number().int().optional().nullable(),
        status: zodSchemaEndpointStatus().optional().nullable(),
        sub_type: z.string().optional().nullable(),
        type: zodSchemaEndpointType().optional().nullable(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointProperties() {
    return z.unknown();
  }

  function zodSchemaEndpointStatus() {
    return z.enum([
      'READY',
      'UNKNOWN',
      'NEW',
      'PROVISIONING',
      'DELETING',
      'FAILED',
    ]);
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

  function zodSchemaEventLogEntry() {
    return z
      .object({
        actions: z.array(zodSchemaEventLogEntryAction()),
        application: z.string(),
        bundle: z.string(),
        created: zodSchemaLocalDateTime(),
        event_type: z.string(),
        id: zodSchemaUUID(),
        payload: z.string().optional().nullable(),
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
        status: zodSchemaEventLogEntryActionStatus(),
      })
      .nonstrict();
  }

  function zodSchemaEventLogEntryActionStatus() {
    return z.enum(['SENT', 'SUCCESS', 'PROCESSING', 'FAILED', 'UNKNOWN']);
  }

  function zodSchemaEventType() {
    return z
      .object({
        application: zodSchemaApplication().optional().nullable(),
        application_id: zodSchemaUUID(),
        description: z.string().optional().nullable(),
        display_name: z.string(),
        fully_qualified_name: z.string().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        not_subscription_locked_or_subscribed_by_default: z
          .boolean()
          .optional()
          .nullable(),
        subscribed_by_default: z.boolean().optional().nullable(),
        subscription_locked: z.boolean().optional().nullable(),
        visible: z.boolean().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEventTypeBehavior() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        event_type: zodSchemaEventType().optional().nullable(),
        id: zodSchemaEventTypeBehaviorId().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEventTypeBehaviorId() {
    return z
      .object({
        behaviorGroupId: zodSchemaUUID(),
        eventTypeId: zodSchemaUUID(),
      })
      .nonstrict();
  }

  function zodSchemaFacet() {
    return z
      .object({
        children: z
          .array(z.lazy(() => zodSchemaFacet()))
          .optional()
          .nullable(),
        displayName: z.string(),
        id: z.string(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaLocalDate() {
    return z.string();
  }

  function zodSchemaLocalDateTime() {
    return z.string();
  }

  function zodSchemaLocalTime() {
    return z.string();
  }

  function zodSchemaMeta() {
    return z
      .object({
        count: z.number().int(),
      })
      .nonstrict();
  }

  function zodSchemaPageDrawerEntryPayload() {
    return z
      .object({
        data: z.array(zodSchemaDrawerEntryPayload()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaPageEventLogEntry() {
    return z
      .object({
        data: z.array(zodSchemaEventLogEntry()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaPageEventType() {
    return z
      .object({
        data: z.array(zodSchemaEventType()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaUUID() {
    return z.string();
  }

  function zodSchemaUpdateBehaviorGroupRequest() {
    return z
      .object({
        display_name: z.string().optional().nullable(),
        display_name_not_null_and_blank: z.boolean().optional().nullable(),
        endpoint_ids: z.array(z.string()).optional().nullable(),
        event_type_ids: z.array(z.string()).optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaUpdateNotificationDrawerStatus() {
    return z
      .object({
        notification_ids: z.array(z.string()),
        read_status: z.boolean(),
      })
      .nonstrict();
  }

  function zodSchema__Empty() {
    return z.string().max(0).optional();
  }
}

export module Operations {
  // POST /notifications/behaviorGroups
  // Create a behavior group
  export module NotificationResource$v1CreateBehaviorGroup {
    const Response400 = z.string();
    type Response400 = string;
    export interface Params {
      body: Schemas.CreateBehaviorGroupRequest;
    }

    export type Payload =
      | ValidatedResponse<
          'CreateBehaviorGroupResponse',
          200,
          Schemas.CreateBehaviorGroupResponse
        >
      | ValidatedResponse<'unknown', 400, Response400>
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
            new ValidateRule(
              Schemas.CreateBehaviorGroupResponse,
              'CreateBehaviorGroupResponse',
              200
            ),
            new ValidateRule(Response400, 'unknown', 400),
          ],
        })
        .build();
    };
  }
  // GET /notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}
  // List the behavior groups affected by the removal of an endpoint
  export module NotificationResource$v1GetBehaviorGroupsAffectedByRemovalOfEndpoint {
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
      const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}'.replace(
          '{endpointId}',
          params['endpointId'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // PUT /notifications/behaviorGroups/{behaviorGroupId}/actions
  // Update the list of behavior group actions
  export module NotificationResource$v1UpdateBehaviorGroupActions {
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
      const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{behaviorGroupId}/actions'.replace(
          '{behaviorGroupId}',
          params['behaviorGroupId'].toString()
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
  // PUT /notifications/behaviorGroups/{id}
  // Update a behavior group
  export module NotificationResource$v1UpdateBehaviorGroup {
    const Response200 = z.boolean();
    type Response200 = boolean;
    const Response400 = z.string();
    type Response400 = string;
    const Response404 = z.string();
    type Response404 = string;
    export interface Params {
      id: Schemas.UUID;
      body: Schemas.UpdateBehaviorGroupRequest;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', 400, Response400>
      | ValidatedResponse<'unknown', 404, Response404>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
          '{id}',
          params['id'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [
            new ValidateRule(Response200, 'unknown', 200),
            new ValidateRule(Response400, 'unknown', 400),
            new ValidateRule(Response404, 'unknown', 404),
          ],
        })
        .build();
    };
  }
  // DELETE /notifications/behaviorGroups/{id}
  // Delete a behavior group
  export module NotificationResource$v1DeleteBehaviorGroup {
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
      const path =
        '/api/notifications/v1.0/notifications/behaviorGroups/{id}'.replace(
          '{id}',
          params['id'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleId}/behaviorGroups
  // List behavior groups in a bundle
  export module NotificationResource$v1FindBehaviorGroupsByBundleId {
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
      const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleId}/behaviorGroups'.replace(
          '{bundleId}',
          params['bundleId'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleName}
  // Retrieve a bundle by name
  export module NotificationResource$v1GetBundleByName {
    const BundleName = z.string();
    type BundleName = string;
    export interface Params {
      bundleName: BundleName;
    }

    export type Payload =
      | ValidatedResponse<'Bundle', 200, Schemas.Bundle>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}'.replace(
          '{bundleName}',
          params['bundleName'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.Bundle, 'Bundle', 200)],
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleName}/applications/{applicationName}
  // Retrieve an application by bundle and application names
  export module NotificationResource$v1GetApplicationByNameAndBundleName {
    const ApplicationName = z.string();
    type ApplicationName = string;
    const BundleName = z.string();
    type BundleName = string;
    export interface Params {
      applicationName: ApplicationName;
      bundleName: BundleName;
    }

    export type Payload =
      | ValidatedResponse<'Application', 200, Schemas.Application>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}/applications/{applicationName}'
          .replace('{applicationName}', params['applicationName'].toString())
          .replace('{bundleName}', params['bundleName'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.Application, 'Application', 200)],
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleName}/applications/{applicationName}/eventTypes/{eventTypeName}
  // Retrieve an event type by bundle, application and event type names
  export module NotificationResource$v1GetEventTypesByNameAndBundleAndApplicationName {
    const ApplicationName = z.string();
    type ApplicationName = string;
    const BundleName = z.string();
    type BundleName = string;
    const EventTypeName = z.string();
    type EventTypeName = string;
    export interface Params {
      applicationName: ApplicationName;
      bundleName: BundleName;
      eventTypeName: EventTypeName;
    }

    export type Payload =
      | ValidatedResponse<'EventType', 200, Schemas.EventType>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}/applications/{applicationName}/eventTypes/{eventTypeName}'
          .replace('{applicationName}', params['applicationName'].toString())
          .replace('{bundleName}', params['bundleName'].toString())
          .replace('{eventTypeName}', params['eventTypeName'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.EventType, 'EventType', 200)],
        })
        .build();
    };
  }
  // GET /notifications/drawer
  // Retrieve drawer notifications entries.
  export module DrawerResource$v1GetDrawerEntries {
    const AppIds = z.array(z.string());
    type AppIds = Array<string>;
    const BundleIds = z.array(z.string());
    type BundleIds = Array<string>;
    const EventTypeIds = z.array(z.string());
    type EventTypeIds = Array<string>;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const ReadStatus = z.boolean();
    type ReadStatus = boolean;
    const SortBy = z.string();
    type SortBy = string;
    export interface Params {
      appIds?: AppIds;
      bundleIds?: BundleIds;
      endDate?: Schemas.LocalDateTime;
      eventTypeIds?: EventTypeIds;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      readStatus?: ReadStatus;
      sortBy?: SortBy;
      startDate?: Schemas.LocalDateTime;
    }

    export type Payload =
      | ValidatedResponse<
          'PageDrawerEntryPayload',
          200,
          Schemas.PageDrawerEntryPayload
        >
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/notifications/v1.0/notifications/drawer';
      const query = {} as Record<string, any>;
      if (params['appIds'] !== undefined) {
        query['appIds'] = params['appIds'];
      }

      if (params['bundleIds'] !== undefined) {
        query['bundleIds'] = params['bundleIds'];
      }

      if (params['endDate'] !== undefined) {
        query['endDate'] = params['endDate'];
      }

      if (params['eventTypeIds'] !== undefined) {
        query['eventTypeIds'] = params['eventTypeIds'];
      }

      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
      }

      if (params['readStatus'] !== undefined) {
        query['readStatus'] = params['readStatus'];
      }

      if (params['sortBy'] !== undefined) {
        query['sort_by'] = params['sortBy'];
      }

      if (params['startDate'] !== undefined) {
        query['startDate'] = params['startDate'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [
            new ValidateRule(
              Schemas.PageDrawerEntryPayload,
              'PageDrawerEntryPayload',
              200
            ),
          ],
        })
        .build();
    };
  }
  // PUT /notifications/drawer/read
  // Update drawer notifications status.
  export module DrawerResource$v1UpdateNotificationReadStatus {
    const Response200 = z.number().int();
    type Response200 = number;
    export interface Params {
      body: Schemas.UpdateNotificationDrawerStatus;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/notifications/v1.0/notifications/drawer/read';
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
  // GET /notifications/eventTypes
  // List all event types
  export module NotificationResource$v1GetEventTypes {
    const ApplicationIds = z.array(z.string());
    type ApplicationIds = Array<string>;
    const EventTypeName = z.string();
    type EventTypeName = string;
    const ExcludeMutedTypes = z.boolean();
    type ExcludeMutedTypes = boolean;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    export interface Params {
      applicationIds?: ApplicationIds;
      bundleId?: Schemas.UUID;
      eventTypeName?: EventTypeName;
      excludeMutedTypes?: ExcludeMutedTypes;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'PageEventType', 200, Schemas.PageEventType>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/notifications/v1.0/notifications/eventTypes';
      const query = {} as Record<string, any>;
      if (params['applicationIds'] !== undefined) {
        query['applicationIds'] = params['applicationIds'];
      }

      if (params['bundleId'] !== undefined) {
        query['bundleId'] = params['bundleId'];
      }

      if (params['eventTypeName'] !== undefined) {
        query['eventTypeName'] = params['eventTypeName'];
      }

      if (params['excludeMutedTypes'] !== undefined) {
        query['excludeMutedTypes'] = params['excludeMutedTypes'];
      }

      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
      }

      if (params['sortBy'] !== undefined) {
        query['sort_by'] = params['sortBy'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [
            new ValidateRule(Schemas.PageEventType, 'PageEventType', 200),
          ],
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}
  // List the event types affected by the removal of a behavior group
  export module NotificationResource$v1GetEventTypesAffectedByRemovalOfBehaviorGroup {
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
      const path =
        '/api/notifications/v1.0/notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}'.replace(
          '{behaviorGroupId}',
          params['behaviorGroupId'].toString()
        );
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/{eventTypeId}/behaviorGroups
  // List the behavior groups linked to an event type
  export module NotificationResource$v1GetLinkedBehaviorGroups {
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
      const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
          '{eventTypeId}',
          params['eventTypeId'].toString()
        );
      const query = {} as Record<string, any>;
      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
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
  // PUT /notifications/eventTypes/{eventTypeId}/behaviorGroups
  // Update the list of behavior groups for an event type
  export module NotificationResource$v1UpdateEventTypeBehaviors {
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
      const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups'.replace(
          '{eventTypeId}',
          params['eventTypeId'].toString()
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
  // DELETE /notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}
  // Delete a behavior group from an event type
  export module NotificationResource$v1DeleteBehaviorGroupFromEventType {
    export interface Params {
      behaviorGroupId: Schemas.UUID;
      eventTypeId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}'
          .replace('{behaviorGroupId}', params['behaviorGroupId'].toString())
          .replace('{eventTypeId}', params['eventTypeId'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.__Empty, '__Empty', 204)],
        })
        .build();
    };
  }
  // PUT /notifications/eventTypes/{eventTypeUuid}/behaviorGroups/{behaviorGroupUuid}
  // Add a behavior group to the given event type.
  export module NotificationResource$v1AppendBehaviorGroupToEventType {
    export interface Params {
      behaviorGroupUuid: Schemas.UUID;
      eventTypeUuid: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeUuid}/behaviorGroups/{behaviorGroupUuid}'
          .replace(
            '{behaviorGroupUuid}',
            params['behaviorGroupUuid'].toString()
          )
          .replace('{eventTypeUuid}', params['eventTypeUuid'].toString());
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Schemas.__Empty, '__Empty', 204)],
        })
        .build();
    };
  }
  // GET /notifications/events
  // Retrieve the event log entries
  export module EventResource$v1GetEvents {
    const AppIds = z.array(z.string());
    type AppIds = Array<string>;
    const BundleIds = z.array(z.string());
    type BundleIds = Array<string>;
    const EndpointTypes = z.array(z.string());
    type EndpointTypes = Array<string>;
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
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    const Status = z.array(Schemas.EventLogEntryActionStatus);
    type Status = Array<Schemas.EventLogEntryActionStatus>;
    export interface Params {
      appIds?: AppIds;
      bundleIds?: BundleIds;
      endDate?: Schemas.LocalDate;
      endpointTypes?: EndpointTypes;
      eventTypeDisplayName?: EventTypeDisplayName;
      includeActions?: IncludeActions;
      includeDetails?: IncludeDetails;
      includePayload?: IncludePayload;
      invocationResults?: InvocationResults;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
      startDate?: Schemas.LocalDate;
      status?: Status;
    }

    export type Payload =
      | ValidatedResponse<'PageEventLogEntry', 200, Schemas.PageEventLogEntry>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/notifications/v1.0/notifications/events';
      const query = {} as Record<string, any>;
      if (params['appIds'] !== undefined) {
        query['appIds'] = params['appIds'];
      }

      if (params['bundleIds'] !== undefined) {
        query['bundleIds'] = params['bundleIds'];
      }

      if (params['endDate'] !== undefined) {
        query['endDate'] = params['endDate'];
      }

      if (params['endpointTypes'] !== undefined) {
        query['endpointTypes'] = params['endpointTypes'];
      }

      if (params['eventTypeDisplayName'] !== undefined) {
        query['eventTypeDisplayName'] = params['eventTypeDisplayName'];
      }

      if (params['includeActions'] !== undefined) {
        query['includeActions'] = params['includeActions'];
      }

      if (params['includeDetails'] !== undefined) {
        query['includeDetails'] = params['includeDetails'];
      }

      if (params['includePayload'] !== undefined) {
        query['includePayload'] = params['includePayload'];
      }

      if (params['invocationResults'] !== undefined) {
        query['invocationResults'] = params['invocationResults'];
      }

      if (params['limit'] !== undefined) {
        query['limit'] = params['limit'];
      }

      if (params['offset'] !== undefined) {
        query['offset'] = params['offset'];
      }

      if (params['pageNumber'] !== undefined) {
        query['pageNumber'] = params['pageNumber'];
      }

      if (params['sortBy'] !== undefined) {
        query['sort_by'] = params['sortBy'];
      }

      if (params['startDate'] !== undefined) {
        query['startDate'] = params['startDate'];
      }

      if (params['status'] !== undefined) {
        query['status'] = params['status'];
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
          ],
        })
        .build();
    };
  }
  // GET /notifications/facets/applications
  // List configured applications
  export module NotificationResource$v1GetApplicationsFacets {
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
      if (params['bundleName'] !== undefined) {
        query['bundleName'] = params['bundleName'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /notifications/facets/bundles
  // List configured bundles
  export module NotificationResource$v1GetBundleFacets {
    const IncludeApplications = z.boolean();
    type IncludeApplications = boolean;
    const Response200 = z.array(Schemas.Facet);
    type Response200 = Array<Schemas.Facet>;
    export interface Params {
      includeApplications?: IncludeApplications;
    }

    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/notifications/v1.0/notifications/facets/bundles';
      const query = {} as Record<string, any>;
      if (params['includeApplications'] !== undefined) {
        query['includeApplications'] = params['includeApplications'];
      }

      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // GET /org-config/daily-digest/time-preference
  // Retrieve the daily digest time
  export module OrgConfigResource$v1GetDailyDigestTimePreference {
    const Response200 = z.string();
    type Response200 = string;
    export type Payload =
      | ValidatedResponse<'unknown', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
      const path =
        '/api/notifications/v1.0/org-config/daily-digest/time-preference';
      const query = {} as Record<string, any>;
      return actionBuilder('GET', path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, 'unknown', 200)],
        })
        .build();
    };
  }
  // PUT /org-config/daily-digest/time-preference
  // Set the daily digest time
  export module OrgConfigResource$v1SaveDailyDigestTimePreference {
    export interface Params {
      body: Schemas.LocalTime;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 400, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path =
        '/api/notifications/v1.0/org-config/daily-digest/time-preference';
      const query = {} as Record<string, any>;
      return actionBuilder('PUT', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [
            new ValidateRule(Schemas.__Empty, '__Empty', 204),
            new ValidateRule(Schemas.__Empty, '__Empty', 400),
          ],
        })
        .build();
    };
  }
}
