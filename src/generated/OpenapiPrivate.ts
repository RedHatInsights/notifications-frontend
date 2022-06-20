/* eslint-disable */
/**
 * Generated code, DO NOT modify directly.
 */
import { ValidatedResponse } from 'openapi2typescript';
import { ValidateRule } from 'openapi2typescript';
import {
    actionBuilder,
    ActionValidatableConfig
} from 'openapi2typescript-plugin-react-fetching-library';
import { Action } from 'react-fetching-library';
import * as z from 'zod';

export namespace Schemas {
  export const AddAccessRequest = zodSchemaAddAccessRequest();
  export type AddAccessRequest = {
    applicationId?: UUID | undefined | null;
    role?: string | undefined | null;
  };

  export const AddApplicationRequest = zodSchemaAddApplicationRequest();
  export type AddApplicationRequest = {
    bundleId: UUID;
    displayName: string;
    name: string;
    ownerRole?: string | undefined | null;
  };

  export const AggregationEmailTemplate = zodSchemaAggregationEmailTemplate();
  export type AggregationEmailTemplate = {
    application?: Application1 | undefined | null;
    applicationId?: UUID | undefined | null;
    bodyTemplate?: Template | undefined | null;
    bodyTemplateId: UUID;
    created?: string | undefined | null;
    id?: UUID | undefined | null;
    subjectTemplate?: Template | undefined | null;
    subjectTemplateId: UUID;
    subscriptionType: EmailSubscriptionType;
    updated?: string | undefined | null;
  };

  export const Application = zodSchemaApplication();
  export type Application = {
    displayName: string;
    id: UUID;
  };

  export const Application1 = zodSchemaApplication1();
  export type Application1 = {
    bundleId: UUID;
    created?: string | undefined | null;
    displayName: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: string | undefined | null;
  };

  export const BasicAuthentication = zodSchemaBasicAuthentication();
  export type BasicAuthentication = {
    password?: string | undefined | null;
    username?: string | undefined | null;
  };

  export const BehaviorGroup = zodSchemaBehaviorGroup();
  export type BehaviorGroup = {
    actions?: Array<BehaviorGroupAction> | undefined | null;
    bundle?: Bundle | undefined | null;
    bundleId: UUID;
    created?: string | undefined | null;
    defaultBehavior?: boolean | undefined | null;
    displayName: string;
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
    displayName: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: string | undefined | null;
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
    subType?: string | undefined | null;
    url: string;
  };

  export const CurrentStatus = zodSchemaCurrentStatus();
  export type CurrentStatus = {
    endTime?: string | undefined | null;
    startTime?: string | undefined | null;
    status: Status;
  };

  export const EmailSubscriptionProperties =
    zodSchemaEmailSubscriptionProperties();
  export type EmailSubscriptionProperties = {
    groupId?: UUID | undefined | null;
    ignorePreferences: boolean;
    onlyAdmins: boolean;
  };

  export const EmailSubscriptionType = zodSchemaEmailSubscriptionType();
  export type EmailSubscriptionType = 'INSTANT' | 'DAILY';

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
    subType?: string | undefined | null;
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

  export const Environment = zodSchemaEnvironment();
  export type Environment = 'PROD' | 'STAGE' | 'EPHEMERAL' | 'LOCAL_SERVER';

  export const EventLogEntry = zodSchemaEventLogEntry();
  export type EventLogEntry = {
    actions: Array<EventLogEntryAction>;
    application: string;
    bundle: string;
    created: string;
    eventType: string;
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
    endpointId?: UUID | undefined | null;
    endpointSubType?: string | undefined | null;
    endpointType: EndpointType;
    id: UUID;
    invocationResult: boolean;
  };

  export const EventType = zodSchemaEventType();
  export type EventType = {
    application?: Application1 | undefined | null;
    applicationId: UUID;
    description?: string | undefined | null;
    displayName: string;
    id?: UUID | undefined | null;
    name: string;
  };

  export const Facet = zodSchemaFacet();
  export type Facet = {
    children?: Array<Facet> | undefined | null;
    displayName: string;
    id: string;
    name: string;
  };

  export const HttpType = zodSchemaHttpType();
  export type HttpType = 'GET' | 'POST' | 'PUT';

  export const InstantEmailTemplate = zodSchemaInstantEmailTemplate();
  export type InstantEmailTemplate = {
    bodyTemplate?: Template | undefined | null;
    bodyTemplateId: UUID;
    created?: string | undefined | null;
    eventType?: EventType | undefined | null;
    eventTypeId?: UUID | undefined | null;
    id?: UUID | undefined | null;
    subjectTemplate?: Template | undefined | null;
    subjectTemplateId: UUID;
    updated?: string | undefined | null;
  };

  export const InternalApplicationUserPermission =
    zodSchemaInternalApplicationUserPermission();
  export type InternalApplicationUserPermission = {
    applicationDisplayName: string;
    applicationId: UUID;
    role: string;
  };

  export const InternalRoleAccess = zodSchemaInternalRoleAccess();
  export type InternalRoleAccess = {
    applicationId: UUID;
    id?: UUID | undefined | null;
    role: string;
  };

  export const InternalUserPermissions = zodSchemaInternalUserPermissions();
  export type InternalUserPermissions = {
    applications: Array<Application>;
    isAdmin: boolean;
    roles: Array<string>;
  };

  export const MessageValidationResponse = zodSchemaMessageValidationResponse();
  export type MessageValidationResponse = {
    errors: {
      [x: string]: Array<string>;
    };
  };

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
    endpointSubType?: string | undefined | null;
    endpointType?: EndpointType | undefined | null;
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

  export const PageEventType = zodSchemaPageEventType();
  export type PageEventType = {
    data: Array<EventType>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const RenderEmailTemplateRequest =
    zodSchemaRenderEmailTemplateRequest();
  export type RenderEmailTemplateRequest = {
    bodyTemplate: string;
    payload: string;
    subjectTemplate: string;
  };

  export const RequestDefaultBehaviorGroupPropertyList =
    zodSchemaRequestDefaultBehaviorGroupPropertyList();
  export type RequestDefaultBehaviorGroupPropertyList = {
    ignorePreferences: boolean;
    onlyAdmins: boolean;
  };

  export const RequestEmailSubscriptionProperties =
    zodSchemaRequestEmailSubscriptionProperties();
  export type RequestEmailSubscriptionProperties = {
    groupId?: UUID | undefined | null;
    onlyAdmins: boolean;
  };

  export const ServerInfo = zodSchemaServerInfo();
  export type ServerInfo = {
    environment?: Environment | undefined | null;
  };

  export const Status = zodSchemaStatus();
  export type Status = 'UP' | 'MAINTENANCE';

  export const Template = zodSchemaTemplate();
  export type Template = {
    created?: string | undefined | null;
    data: string;
    description: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: string | undefined | null;
  };

  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const WebhookProperties = zodSchemaWebhookProperties();
  export type WebhookProperties = {
    basicAuthentication?: BasicAuthentication | undefined | null;
    disableSslVerification: boolean;
    method: HttpType;
    secretToken?: string | undefined | null;
    url: string;
  };

  function zodSchemaAddAccessRequest() {
      return z
      .object({
          application_id: zodSchemaUUID().optional().nullable(),
          role: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          applicationId: o.application_id,
          role: o.role
      }));
  }

  function zodSchemaAddApplicationRequest() {
      return z
      .object({
          bundle_id: zodSchemaUUID(),
          display_name: z.string(),
          name: z.string(),
          owner_role: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          bundleId: o.bundle_id,
          displayName: o.display_name,
          name: o.name,
          ownerRole: o.owner_role
      }));
  }

  function zodSchemaAggregationEmailTemplate() {
      return z
      .object({
          application: zodSchemaApplication1().optional().nullable(),
          application_id: zodSchemaUUID().optional().nullable(),
          body_template: zodSchemaTemplate().optional().nullable(),
          body_template_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          subject_template: zodSchemaTemplate().optional().nullable(),
          subject_template_id: zodSchemaUUID(),
          subscription_type: zodSchemaEmailSubscriptionType(),
          updated: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          application: o.application,
          applicationId: o.application_id,
          bodyTemplate: o.body_template,
          bodyTemplateId: o.body_template_id,
          created: o.created,
          id: o.id,
          subjectTemplate: o.subject_template,
          subjectTemplateId: o.subject_template_id,
          subscriptionType: o.subscription_type,
          updated: o.updated
      }));
  }

  function zodSchemaApplication() {
      return z
      .object({
          display_name: z.string(),
          id: zodSchemaUUID()
      })
      .nonstrict()
      .transform((o) => ({
          displayName: o.display_name,
          id: o.id
      }));
  }

  function zodSchemaApplication1() {
      return z
      .object({
          bundle_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          bundleId: o.bundle_id,
          created: o.created,
          displayName: o.display_name,
          id: o.id,
          name: o.name,
          updated: o.updated
      }));
  }

  function zodSchemaBasicAuthentication() {
      return z
      .object({
          password: z.string().optional().nullable(),
          username: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          password: o.password,
          username: o.username
      }));
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
      .nonstrict()
      .transform((o) => ({
          actions: o.actions,
          bundle: o.bundle,
          bundleId: o.bundle_id,
          created: o.created,
          defaultBehavior: o.default_behavior,
          displayName: o.display_name,
          id: o.id,
          updated: o.updated
      }));
  }

  function zodSchemaBehaviorGroupAction() {
      return z
      .object({
          created: z.string().optional().nullable(),
          endpoint: zodSchemaEndpoint().optional().nullable(),
          id: zodSchemaBehaviorGroupActionId().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          created: o.created,
          endpoint: o.endpoint,
          id: o.id
      }));
  }

  function zodSchemaBehaviorGroupActionId() {
      return z
      .object({
          behaviorGroupId: zodSchemaUUID(),
          endpointId: zodSchemaUUID()
      })
      .nonstrict()
      .transform((o) => ({
          behaviorGroupId: o.behaviorGroupId,
          endpointId: o.endpointId
      }));
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
      .nonstrict()
      .transform((o) => ({
          created: o.created,
          displayName: o.display_name,
          id: o.id,
          name: o.name,
          updated: o.updated
      }));
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
      .nonstrict()
      .transform((o) => ({
          basicAuthentication: o.basic_authentication,
          disableSslVerification: o.disable_ssl_verification,
          extras: o.extras,
          secretToken: o.secret_token,
          subType: o.sub_type,
          url: o.url
      }));
  }

  function zodSchemaCurrentStatus() {
      return z
      .object({
          end_time: z.string().optional().nullable(),
          start_time: z.string().optional().nullable(),
          status: zodSchemaStatus()
      })
      .nonstrict()
      .transform((o) => ({
          endTime: o.end_time,
          startTime: o.start_time,
          status: o.status
      }));
  }

  function zodSchemaEmailSubscriptionProperties() {
      return z
      .object({
          group_id: zodSchemaUUID().optional().nullable(),
          ignore_preferences: z.boolean(),
          only_admins: z.boolean()
      })
      .nonstrict()
      .transform((o) => ({
          groupId: o.group_id,
          ignorePreferences: o.ignore_preferences,
          onlyAdmins: o.only_admins
      }));
  }

  function zodSchemaEmailSubscriptionType() {
      return z.enum([ 'INSTANT', 'DAILY' ]);
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
      .nonstrict()
      .transform((o) => ({
          created: o.created,
          description: o.description,
          enabled: o.enabled,
          id: o.id,
          name: o.name,
          properties: o.properties,
          subType: o.sub_type,
          type: o.type,
          updated: o.updated
      }));
  }

  function zodSchemaEndpointPage() {
      return z
      .object({
          data: z.array(zodSchemaEndpoint()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict()
      .transform((o) => ({
          data: o.data,
          links: o.links,
          meta: o.meta
      }));
  }

  function zodSchemaEndpointProperties() {
      return z.unknown();
  }

  function zodSchemaEndpointType() {
      return z.enum([ 'webhook', 'email_subscription', 'default', 'camel' ]);
  }

  function zodSchemaEnvironment() {
      return z.enum([ 'PROD', 'STAGE', 'EPHEMERAL', 'LOCAL_SERVER' ]);
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
      .nonstrict()
      .transform((o) => ({
          actions: o.actions,
          application: o.application,
          bundle: o.bundle,
          created: o.created,
          eventType: o.event_type,
          id: o.id,
          payload: o.payload
      }));
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
      .nonstrict()
      .transform((o) => ({
          details: o.details,
          endpointId: o.endpoint_id,
          endpointSubType: o.endpoint_sub_type,
          endpointType: o.endpoint_type,
          id: o.id,
          invocationResult: o.invocation_result
      }));
  }

  function zodSchemaEventType() {
      return z
      .object({
          application: zodSchemaApplication1().optional().nullable(),
          application_id: zodSchemaUUID(),
          description: z.string().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string()
      })
      .nonstrict()
      .transform((o) => ({
          application: o.application,
          applicationId: o.application_id,
          description: o.description,
          displayName: o.display_name,
          id: o.id,
          name: o.name
      }));
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
          name: z.string()
      })
      .nonstrict()
      .transform((o) => ({
          children: o.children,
          displayName: o.displayName,
          id: o.id,
          name: o.name
      }));
  }

  function zodSchemaHttpType() {
      return z.enum([ 'GET', 'POST', 'PUT' ]);
  }

  function zodSchemaInstantEmailTemplate() {
      return z
      .object({
          body_template: zodSchemaTemplate().optional().nullable(),
          body_template_id: zodSchemaUUID(),
          created: z.string().optional().nullable(),
          event_type: zodSchemaEventType().optional().nullable(),
          event_type_id: zodSchemaUUID().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          subject_template: zodSchemaTemplate().optional().nullable(),
          subject_template_id: zodSchemaUUID(),
          updated: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          bodyTemplate: o.body_template,
          bodyTemplateId: o.body_template_id,
          created: o.created,
          eventType: o.event_type,
          eventTypeId: o.event_type_id,
          id: o.id,
          subjectTemplate: o.subject_template,
          subjectTemplateId: o.subject_template_id,
          updated: o.updated
      }));
  }

  function zodSchemaInternalApplicationUserPermission() {
      return z
      .object({
          application_display_name: z.string(),
          application_id: zodSchemaUUID(),
          role: z.string()
      })
      .nonstrict()
      .transform((o) => ({
          applicationDisplayName: o.application_display_name,
          applicationId: o.application_id,
          role: o.role
      }));
  }

  function zodSchemaInternalRoleAccess() {
      return z
      .object({
          application_id: zodSchemaUUID(),
          id: zodSchemaUUID().optional().nullable(),
          role: z.string()
      })
      .nonstrict()
      .transform((o) => ({
          applicationId: o.application_id,
          id: o.id,
          role: o.role
      }));
  }

  function zodSchemaInternalUserPermissions() {
      return z
      .object({
          applications: z.array(zodSchemaApplication()),
          is_admin: z.boolean(),
          roles: z.array(z.string())
      })
      .nonstrict()
      .transform((o) => ({
          applications: o.applications,
          isAdmin: o.is_admin,
          roles: o.roles
      }));
  }

  function zodSchemaMessageValidationResponse() {
      return z
      .object({
          errors: z.record(z.array(z.string()))
      })
      .nonstrict()
      .transform((o) => ({
          errors: o.errors
      }));
  }

  function zodSchemaMeta() {
      return z
      .object({
          count: z.number().int()
      })
      .nonstrict()
      .transform((o) => ({
          count: o.count
      }));
  }

  function zodSchemaNotificationHistory() {
      return z
      .object({
          created: z.string().optional().nullable(),
          details: z.record(z.unknown()).optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          endpointSubType: z.string().optional().nullable(),
          endpointType: zodSchemaEndpointType().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          invocationResult: z.boolean(),
          invocationTime: z.number().int()
      })
      .nonstrict()
      .transform((o) => ({
          created: o.created,
          details: o.details,
          endpointId: o.endpointId,
          endpointSubType: o.endpointSubType,
          endpointType: o.endpointType,
          id: o.id,
          invocationResult: o.invocationResult,
          invocationTime: o.invocationTime
      }));
  }

  function zodSchemaPageEventLogEntry() {
      return z
      .object({
          data: z.array(zodSchemaEventLogEntry()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict()
      .transform((o) => ({
          data: o.data,
          links: o.links,
          meta: o.meta
      }));
  }

  function zodSchemaPageEventType() {
      return z
      .object({
          data: z.array(zodSchemaEventType()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict()
      .transform((o) => ({
          data: o.data,
          links: o.links,
          meta: o.meta
      }));
  }

  function zodSchemaRenderEmailTemplateRequest() {
      return z
      .object({
          body_template: z.string(),
          payload: z.string(),
          subject_template: z.string()
      })
      .nonstrict()
      .transform((o) => ({
          bodyTemplate: o.body_template,
          payload: o.payload,
          subjectTemplate: o.subject_template
      }));
  }

  function zodSchemaRequestDefaultBehaviorGroupPropertyList() {
      return z
      .object({
          ignore_preferences: z.boolean(),
          only_admins: z.boolean()
      })
      .nonstrict()
      .transform((o) => ({
          ignorePreferences: o.ignore_preferences,
          onlyAdmins: o.only_admins
      }));
  }

  function zodSchemaRequestEmailSubscriptionProperties() {
      return z
      .object({
          group_id: zodSchemaUUID().optional().nullable(),
          only_admins: z.boolean()
      })
      .nonstrict()
      .transform((o) => ({
          groupId: o.group_id,
          onlyAdmins: o.only_admins
      }));
  }

  function zodSchemaServerInfo() {
      return z
      .object({
          environment: zodSchemaEnvironment().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          environment: o.environment
      }));
  }

  function zodSchemaStatus() {
      return z.enum([ 'UP', 'MAINTENANCE' ]);
  }

  function zodSchemaTemplate() {
      return z
      .object({
          created: z.string().optional().nullable(),
          data: z.string(),
          description: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: z.string().optional().nullable()
      })
      .nonstrict()
      .transform((o) => ({
          created: o.created,
          data: o.data,
          description: o.description,
          id: o.id,
          name: o.name,
          updated: o.updated
      }));
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
      .nonstrict()
      .transform((o) => ({
          basicAuthentication: o.basic_authentication,
          disableSslVerification: o.disable_ssl_verification,
          method: o.method,
          secretToken: o.secret_token,
          url: o.url
      }));
  }
}

export namespace Operations {
  // GET /api/notifications/v1.0/status
  export namespace StatusResourceGetCurrentStatus {
    export type Payload =
      | ValidatedResponse<'CurrentStatus', 200, Schemas.CurrentStatus>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/notifications/v1.0/status';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.CurrentStatus, 'CurrentStatus', 200)
            ]
        })
        .build();
    };
  }
}
