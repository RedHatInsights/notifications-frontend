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
  export const AddAccessRequest = zodSchemaAddAccessRequest();
  export type AddAccessRequest = {
    application_id?: UUID | undefined | null;
    role?: string | undefined | null;
  };

  export const AddApplicationRequest = zodSchemaAddApplicationRequest();
  export type AddApplicationRequest = {
    bundle_id: UUID;
    display_name: string;
    name: string;
    owner_role?: string | undefined | null;
  };

  export const AggregationEmailTemplate = zodSchemaAggregationEmailTemplate();
  export type AggregationEmailTemplate = {
    application?: Application | undefined | null;
    application_id?: UUID | undefined | null;
    body_template?: Template | undefined | null;
    body_template_id: UUID;
    created?: LocalDateTime | undefined | null;
    id?: UUID | undefined | null;
    subject_template?: Template | undefined | null;
    subject_template_id: UUID;
    subscription_type: EmailSubscriptionType;
    updated?: LocalDateTime | undefined | null;
  };

  export const Application = zodSchemaApplication();
  export type Application = {
    bundle_id: UUID;
    created?: LocalDateTime | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: LocalDateTime | undefined | null;
  };

  export const Application1 = zodSchemaApplication1();
  export type Application1 = {
    display_name: string;
    id: UUID;
  };

  export const ApplicationSettingsValue = zodSchemaApplicationSettingsValue();
  export type ApplicationSettingsValue = {
    hasForcedEmail?: boolean | undefined | null;
    notifications?:
      | {
          [x: string]: boolean;
        }
      | undefined
      | null;
  };

  export const BasicAuthentication = zodSchemaBasicAuthentication();
  export type BasicAuthentication = {
    password?: string | undefined | null;
    username?: string | undefined | null;
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

  export const BundleSettingsValue = zodSchemaBundleSettingsValue();
  export type BundleSettingsValue = {
    applications?:
      | {
          [x: string]: ApplicationSettingsValue;
        }
      | undefined
      | null;
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
    url: string;
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

  export const CurrentStatus = zodSchemaCurrentStatus();
  export type CurrentStatus = {
    end_time?: LocalDateTime | undefined | null;
    start_time?: LocalDateTime | undefined | null;
    status: Status;
  };

  export const DuplicateNameMigrationReport =
    zodSchemaDuplicateNameMigrationReport();
  export type DuplicateNameMigrationReport = {
    updatedBehaviorGroups?: number | undefined | null;
    updatedIntegrations?: number | undefined | null;
  };

  export const EmailSubscriptionProperties =
    zodSchemaEmailSubscriptionProperties();
  export type EmailSubscriptionProperties = {
    group_id?: UUID | undefined | null;
    ignore_preferences: boolean;
    only_admins: boolean;
  };

  export const EmailSubscriptionType = zodSchemaEmailSubscriptionType();
  export type EmailSubscriptionType = 'INSTANT' | 'DAILY';

  export const Endpoint = zodSchemaEndpoint();
  export type Endpoint = {
    created?: LocalDateTime | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    id?: UUID | undefined | null;
    name: string;
    properties?:
      | (WebhookProperties | EmailSubscriptionProperties | CamelProperties)
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
    | 'READY'
    | 'UNKNOWN'
    | 'NEW'
    | 'PROVISIONING'
    | 'DELETING'
    | 'FAILED';

  export const EndpointType = zodSchemaEndpointType();
  export type EndpointType =
    | 'webhook'
    | 'email_subscription'
    | 'camel'
    | 'ansible';

  export const Environment = zodSchemaEnvironment();
  export type Environment = 'PROD' | 'STAGE' | 'EPHEMERAL' | 'LOCAL_SERVER';

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

  export const HttpType = zodSchemaHttpType();
  export type HttpType = 'GET' | 'POST' | 'PUT';

  export const InstantEmailTemplate = zodSchemaInstantEmailTemplate();
  export type InstantEmailTemplate = {
    body_template?: Template | undefined | null;
    body_template_id: UUID;
    created?: LocalDateTime | undefined | null;
    event_type?: EventType | undefined | null;
    event_type_id?: UUID | undefined | null;
    id?: UUID | undefined | null;
    subject_template?: Template | undefined | null;
    subject_template_id: UUID;
    updated?: LocalDateTime | undefined | null;
  };

  export const InternalApplicationUserPermission =
    zodSchemaInternalApplicationUserPermission();
  export type InternalApplicationUserPermission = {
    application_display_name: string;
    application_id: UUID;
    role: string;
  };

  export const InternalRoleAccess = zodSchemaInternalRoleAccess();
  export type InternalRoleAccess = {
    application_id: UUID;
    id?: UUID | undefined | null;
    role: string;
  };

  export const InternalUserPermissions = zodSchemaInternalUserPermissions();
  export type InternalUserPermissions = {
    applications: Array<Application1>;
    is_admin: boolean;
    roles: Array<string>;
  };

  export const LocalDate = zodSchemaLocalDate();
  export type LocalDate = string;

  export const LocalDateTime = zodSchemaLocalDateTime();
  export type LocalDateTime = string;

  export const LocalTime = zodSchemaLocalTime();
  export type LocalTime = string;

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
    created?: LocalDateTime | undefined | null;
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
    payload: string;
    template: Array<string>;
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
    group_id?: UUID | undefined | null;
    only_admins: boolean;
  };

  export const ServerInfo = zodSchemaServerInfo();
  export type ServerInfo = {
    environment?: Environment | undefined | null;
  };

  export const SettingsValues = zodSchemaSettingsValues();
  export type SettingsValues = {
    bundles?:
      | {
          [x: string]: BundleSettingsValue;
        }
      | undefined
      | null;
  };

  export const Status = zodSchemaStatus();
  export type Status = 'UP' | 'MAINTENANCE';

  export const Template = zodSchemaTemplate();
  export type Template = {
    created?: LocalDateTime | undefined | null;
    data: string;
    description: string;
    id?: UUID | undefined | null;
    name: string;
    updated?: LocalDateTime | undefined | null;
  };

  export const TriggerDailyDigestRequest = zodSchemaTriggerDailyDigestRequest();
  export type TriggerDailyDigestRequest = {
    application_name: string;
    bundle_name: string;
    end?: LocalDateTime | undefined | null;
    org_id: string;
    start?: LocalDateTime | undefined | null;
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

  export const UserConfigPreferences = zodSchemaUserConfigPreferences();
  export type UserConfigPreferences = {
    daily_email?: boolean | undefined | null;
    instant_email?: boolean | undefined | null;
  };

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

  function zodSchemaAddAccessRequest() {
      return z
      .object({
          application_id: zodSchemaUUID().optional().nullable(),
          role: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaAddApplicationRequest() {
      return z
      .object({
          bundle_id: zodSchemaUUID(),
          display_name: z.string(),
          name: z.string(),
          owner_role: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaAggregationEmailTemplate() {
      return z
      .object({
          application: zodSchemaApplication().optional().nullable(),
          application_id: zodSchemaUUID().optional().nullable(),
          body_template: zodSchemaTemplate().optional().nullable(),
          body_template_id: zodSchemaUUID(),
          created: zodSchemaLocalDateTime().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          subject_template: zodSchemaTemplate().optional().nullable(),
          subject_template_id: zodSchemaUUID(),
          subscription_type: zodSchemaEmailSubscriptionType(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaApplication() {
      return z
      .object({
          bundle_id: zodSchemaUUID(),
          created: zodSchemaLocalDateTime().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaApplication1() {
      return z
      .object({
          display_name: z.string(),
          id: zodSchemaUUID()
      })
      .nonstrict();
  }

  function zodSchemaApplicationSettingsValue() {
      return z
      .object({
          hasForcedEmail: z.boolean().optional().nullable(),
          notifications: z.record(z.boolean()).optional().nullable()
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
          behaviors: z.array(zodSchemaEventTypeBehavior()).optional().nullable(),
          bundle: zodSchemaBundle().optional().nullable(),
          bundle_id: zodSchemaUUID(),
          created: zodSchemaLocalDateTime().optional().nullable(),
          default_behavior: z.boolean().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupAction() {
      return z
      .object({
          created: zodSchemaLocalDateTime().optional().nullable(),
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
          created: zodSchemaLocalDateTime().optional().nullable(),
          display_name: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaBundleSettingsValue() {
      return z
      .object({
          applications: z
          .record(zodSchemaApplicationSettingsValue())
          .optional()
          .nullable()
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
          url: z.string()
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
          event_type_ids: z.array(z.string()).optional().nullable()
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
          id: zodSchemaUUID()
      })
      .nonstrict();
  }

  function zodSchemaCurrentStatus() {
      return z
      .object({
          end_time: zodSchemaLocalDateTime().optional().nullable(),
          start_time: zodSchemaLocalDateTime().optional().nullable(),
          status: zodSchemaStatus()
      })
      .nonstrict();
  }

  function zodSchemaDuplicateNameMigrationReport() {
      return z
      .object({
          updatedBehaviorGroups: z.number().int().optional().nullable(),
          updatedIntegrations: z.number().int().optional().nullable()
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
      return z.enum([ 'INSTANT', 'DAILY' ]);
  }

  function zodSchemaEndpoint() {
      return z
      .object({
          created: zodSchemaLocalDateTime().optional().nullable(),
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
          server_errors: z.number().int().optional().nullable(),
          status: zodSchemaEndpointStatus().optional().nullable(),
          sub_type: z.string().optional().nullable(),
          type: zodSchemaEndpointType(),
          updated: zodSchemaLocalDateTime().optional().nullable()
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

  function zodSchemaEndpointStatus() {
      return z.enum([
          'READY',
          'UNKNOWN',
          'NEW',
          'PROVISIONING',
          'DELETING',
          'FAILED'
      ]);
  }

  function zodSchemaEndpointType() {
      return z.enum([ 'webhook', 'email_subscription', 'camel', 'ansible' ]);
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
          created: zodSchemaLocalDateTime(),
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
          status: zodSchemaEventLogEntryActionStatus()
      })
      .nonstrict();
  }

  function zodSchemaEventLogEntryActionStatus() {
      return z.enum([ 'SENT', 'SUCCESS', 'PROCESSING', 'FAILED', 'UNKNOWN' ]);
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
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaEventTypeBehavior() {
      return z
      .object({
          created: zodSchemaLocalDateTime().optional().nullable(),
          event_type: zodSchemaEventType().optional().nullable(),
          id: zodSchemaEventTypeBehaviorId().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaEventTypeBehaviorId() {
      return z
      .object({
          behaviorGroupId: zodSchemaUUID(),
          eventTypeId: zodSchemaUUID()
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
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaHttpType() {
      return z.enum([ 'GET', 'POST', 'PUT' ]);
  }

  function zodSchemaInstantEmailTemplate() {
      return z
      .object({
          body_template: zodSchemaTemplate().optional().nullable(),
          body_template_id: zodSchemaUUID(),
          created: zodSchemaLocalDateTime().optional().nullable(),
          event_type: zodSchemaEventType().optional().nullable(),
          event_type_id: zodSchemaUUID().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          subject_template: zodSchemaTemplate().optional().nullable(),
          subject_template_id: zodSchemaUUID(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaInternalApplicationUserPermission() {
      return z
      .object({
          application_display_name: z.string(),
          application_id: zodSchemaUUID(),
          role: z.string()
      })
      .nonstrict();
  }

  function zodSchemaInternalRoleAccess() {
      return z
      .object({
          application_id: zodSchemaUUID(),
          id: zodSchemaUUID().optional().nullable(),
          role: z.string()
      })
      .nonstrict();
  }

  function zodSchemaInternalUserPermissions() {
      return z
      .object({
          applications: z.array(zodSchemaApplication1()),
          is_admin: z.boolean(),
          roles: z.array(z.string())
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

  function zodSchemaMessageValidationResponse() {
      return z
      .object({
          errors: z.record(z.array(z.string()))
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

  function zodSchemaNotificationHistory() {
      return z
      .object({
          created: zodSchemaLocalDateTime().optional().nullable(),
          details: z.record(z.unknown()).optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          endpointSubType: z.string().optional().nullable(),
          endpointType: zodSchemaEndpointType().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          invocationTime: z.number().int(),
          status: zodSchemaNotificationStatus()
      })
      .nonstrict();
  }

  function zodSchemaNotificationStatus() {
      return z.enum([
          'FAILED_INTERNAL',
          'FAILED_EXTERNAL',
          'PROCESSING',
          'SENT',
          'SUCCESS'
      ]);
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

  function zodSchemaPageEventType() {
      return z
      .object({
          data: z.array(zodSchemaEventType()),
          links: z.record(z.string()),
          meta: zodSchemaMeta()
      })
      .nonstrict();
  }

  function zodSchemaRenderEmailTemplateRequest() {
      return z
      .object({
          payload: z.string(),
          template: z.array(z.string())
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
          group_id: zodSchemaUUID().optional().nullable(),
          only_admins: z.boolean()
      })
      .nonstrict();
  }

  function zodSchemaServerInfo() {
      return z
      .object({
          environment: zodSchemaEnvironment().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaSettingsValues() {
      return z
      .object({
          bundles: z.record(zodSchemaBundleSettingsValue()).optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaStatus() {
      return z.enum([ 'UP', 'MAINTENANCE' ]);
  }

  function zodSchemaTemplate() {
      return z
      .object({
          created: zodSchemaLocalDateTime().optional().nullable(),
          data: z.string(),
          description: z.string(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: zodSchemaLocalDateTime().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaTriggerDailyDigestRequest() {
      return z
      .object({
          application_name: z.string(),
          bundle_name: z.string(),
          end: zodSchemaLocalDateTime().optional().nullable(),
          org_id: z.string(),
          start: zodSchemaLocalDateTime().optional().nullable()
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
          event_type_ids: z.array(z.string()).optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaUserConfigPreferences() {
      return z
      .object({
          daily_email: z.boolean().optional().nullable(),
          instant_email: z.boolean().optional().nullable()
      })
      .nonstrict();
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
  // Create a behavior group - assigning actions and linking to event types as requested
  export namespace NotificationResourceCreateBehaviorGroup {
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
                new ValidateRule(
                    Schemas.CreateBehaviorGroupResponse,
                    'CreateBehaviorGroupResponse',
                    200
                ),
                new ValidateRule(Response400, 'unknown', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/behaviorGroups/affectedByRemovalOfEndpoint/{endpointId}
  // Retrieve the behavior groups affected by the removal of an endpoint.
  export namespace NotificationResourceGetBehaviorGroupsAffectedByRemovalOfEndpoint {
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
  export namespace NotificationResourceUpdateBehaviorGroupActions {
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
  export namespace NotificationResourceUpdateBehaviorGroup {
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', 404, Response404>
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
                new ValidateRule(Response400, 'unknown', 400),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403),
                new ValidateRule(Response404, 'unknown', 404)
            ]
        })
        .build();
    };
  }
  // DELETE /notifications/behaviorGroups/{id}
  // Delete a behavior group.
  export namespace NotificationResourceDeleteBehaviorGroup {
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
  export namespace NotificationResourceFindBehaviorGroupsByBundleId {
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
  // GET /notifications/bundles/{bundleName}
  // Retrieve the bundle by name
  export namespace NotificationResourceGetBundleByName {
    const BundleName = z.string();
    type BundleName = string;
    export interface Params {
      bundleName: BundleName;
    }

    export type Payload =
      | ValidatedResponse<'Bundle', 200, Schemas.Bundle>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}'.replace(
            '{bundleName}',
            params.bundleName.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.Bundle, 'Bundle', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleName}/applications/{applicationName}
  // Retrieve the application by name of a given bundle name
  export namespace NotificationResourceGetApplicationByNameAndBundleName {
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}/applications/{applicationName}'
        .replace('{applicationName}', params.applicationName.toString())
        .replace('{bundleName}', params.bundleName.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.Application, 'Application', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/bundles/{bundleName}/applications/{applicationName}/eventTypes/{eventTypeName}
  // Retrieve the event type by name of a given bundle name and application name
  export namespace NotificationResourceGetEventTypesByNameAndBundleAndApplicationName {
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
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/bundles/{bundleName}/applications/{applicationName}/eventTypes/{eventTypeName}'
        .replace('{applicationName}', params.applicationName.toString())
        .replace('{bundleName}', params.bundleName.toString())
        .replace('{eventTypeName}', params.eventTypeName.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.EventType, 'EventType', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes
  // Retrieve all event types. The returned list can be filtered by bundle or application.
  export namespace NotificationResourceGetEventTypes {
    const ApplicationIds = z.array(z.string());
    type ApplicationIds = Array<string>;
    const EventTypeName = z.string();
    type EventTypeName = string;
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
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'PageEventType', 200, Schemas.PageEventType>
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

        if (params.eventTypeName !== undefined) {
            query.eventTypeName = params.eventTypeName;
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
                new ValidateRule(Schemas.PageEventType, 'PageEventType', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}
  // Retrieve the event types affected by the removal of a behavior group.
  export namespace NotificationResourceGetEventTypesAffectedByRemovalOfBehaviorGroup {
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
  export namespace NotificationResourceGetLinkedBehaviorGroups {
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
  export namespace NotificationResourceUpdateEventTypeBehaviors {
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
  // DELETE /notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}
  // Delete a behavior group from the given event type.
  export namespace NotificationResourceDeleteBehaviorGroupFromEventType {
    export interface Params {
      behaviorGroupId: Schemas.UUID;
      eventTypeId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}'
        .replace('{behaviorGroupId}', params.behaviorGroupId.toString())
        .replace('{eventTypeId}', params.eventTypeId.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 204),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // PUT /notifications/eventTypes/{eventTypeUuid}/behaviorGroups/{behaviorGroupUuid}
  // Add a behavior group to the given event type.
  export namespace NotificationResourceAppendBehaviorGroupToEventType {
    export interface Params {
      behaviorGroupUuid: Schemas.UUID;
      eventTypeUuid: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 204, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/notifications/eventTypes/{eventTypeUuid}/behaviorGroups/{behaviorGroupUuid}'
        .replace(
            '{behaviorGroupUuid}',
            params.behaviorGroupUuid.toString()
        )
        .replace('{eventTypeUuid}', params.eventTypeUuid.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 204),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /notifications/events
  // Retrieve the event log entries.
  export namespace EventResourceGetEvents {
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

        if (params.pageNumber !== undefined) {
            query.pageNumber = params.pageNumber;
        }

        if (params.sortBy !== undefined) {
            query.sort_by = params.sortBy;
        }

        if (params.startDate !== undefined) {
            query.startDate = params.startDate;
        }

        if (params.status !== undefined) {
            query.status = params.status;
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
  export namespace NotificationResourceGetApplicationsFacets {
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
  export namespace NotificationResourceGetBundleFacets {
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
        if (params.includeApplications !== undefined) {
            query.includeApplications = params.includeApplications;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'unknown', 200) ]
        })
        .build();
    };
  }
  // GET /org-config/daily-digest/time-preference
  export namespace OrgConfigResourceGetDailyDigestTimePreference {
    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path =
        '/api/notifications/v1.0/org-config/daily-digest/time-preference';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(Schemas.__Empty, '__Empty', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // PUT /org-config/daily-digest/time-preference
  // Save the daily digest UTC time preference. To cover all time zones conversion to UTC, the accepted minute values are 00, 15, 30 and 45.
  export namespace OrgConfigResourceSaveDailyDigestTimePreference {
    export interface Params {
      body: Schemas.LocalTime;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 401, Schemas.__Empty>
      | ValidatedResponse<'__Empty', 403, Schemas.__Empty>
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
                new ValidateRule(Schemas.__Empty, '__Empty', 200),
                new ValidateRule(Schemas.__Empty, '__Empty', 401),
                new ValidateRule(Schemas.__Empty, '__Empty', 403)
            ]
        })
        .build();
    };
  }
  // GET /user-config/notification-preference
  export namespace UserConfigResourceGetSettingsSchema {
    const BundleName = z.string();
    type BundleName = string;
    export interface Params {
      bundleName?: BundleName;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/user-config/notification-preference';
        const query = {} as Record<string, any>;
        if (params.bundleName !== undefined) {
            query.bundleName = params.bundleName;
        }

        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Schemas.__Empty, '__Empty', 200) ]
        })
        .build();
    };
  }
  // POST /user-config/notification-preference
  export namespace UserConfigResourceSaveSettings {
    export interface Params {
      body: Schemas.SettingsValues;
    }

    export type Payload =
      | ValidatedResponse<'__Empty', 200, Schemas.__Empty>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/user-config/notification-preference';
        const query = {} as Record<string, any>;
        return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [ new ValidateRule(Schemas.__Empty, '__Empty', 200) ]
        })
        .build();
    };
  }
  // GET /user-config/notification-preference/{bundleName}/{applicationName}
  export namespace UserConfigResourceGetPreferences {
    const ApplicationName = z.string();
    type ApplicationName = string;
    const BundleName = z.string();
    type BundleName = string;
    export interface Params {
      applicationName: ApplicationName;
      bundleName: BundleName;
    }

    export type Payload =
      | ValidatedResponse<
          'UserConfigPreferences',
          200,
          Schemas.UserConfigPreferences
        >
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path =
        '/api/notifications/v1.0/user-config/notification-preference/{bundleName}/{applicationName}'
        .replace('{applicationName}', params.applicationName.toString())
        .replace('{bundleName}', params.bundleName.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [
                new ValidateRule(
                    Schemas.UserConfigPreferences,
                    'UserConfigPreferences',
                    200
                )
            ]
        })
        .build();
    };
  }
}
