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

export module Schemas {
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
    subscription_type: SubscriptionType;
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

  export const ApplicationDTO = zodSchemaApplicationDTO();
  export type ApplicationDTO = {
    bundle_id: UUID;
    display_name: string;
    event_types?: Array<EventTypeDTO> | undefined | null;
    id?: UUID | undefined | null;
    name: string;
  };

  export const ApplicationDTO1 = zodSchemaApplicationDTO1();
  export type ApplicationDTO1 = {
    bundle_id: UUID;
    created?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
    owner_role?: string | undefined | null;
  };

  export const ApplicationSettingsValue = zodSchemaApplicationSettingsValue();
  export type ApplicationSettingsValue = {
    eventTypes?:
      | {
          [x: string]: EventTypeSettingsValue;
        }
      | undefined
      | null;
  };

  export const BasicAuthenticationDTO = zodSchemaBasicAuthenticationDTO();
  export type BasicAuthenticationDTO = {
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

  export const BundleDTO = zodSchemaBundleDTO();
  export type BundleDTO = {
    applications?: Array<ApplicationDTO> | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
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

  export const CamelPropertiesDTO = zodSchemaCamelPropertiesDTO();
  export type CamelPropertiesDTO = {
    basicAuthentication?: BasicAuthenticationDTO | undefined | null;
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

  export const EndpointDTO = zodSchemaEndpointDTO();
  export type EndpointDTO = {
    created?: LocalDateTime | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    event_types?: Array<string> | undefined | null;
    event_types_group_by_bundles_and_applications?:
      | Array<BundleDTO>
      | undefined
      | null;
    id?: UUID | undefined | null;
    name: string;
    properties?:
      | (
          | CamelPropertiesDTO
          | SystemSubscriptionPropertiesDTO
          | WebhookPropertiesDTO
          | PagerDutyPropertiesDTO
        )
      | undefined
      | null;
    server_errors?: number | undefined | null;
    status?: EndpointStatusDTO | undefined | null;
    sub_type?: string | undefined | null;
    type: EndpointTypeDTO;
    updated?: LocalDateTime | undefined | null;
  };

  export const EndpointPage = zodSchemaEndpointPage();
  export type EndpointPage = {
    data: Array<EndpointDTO>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const EndpointProperties = zodSchemaEndpointProperties();
  export type EndpointProperties = unknown;

  export const EndpointPropertiesDTO = zodSchemaEndpointPropertiesDTO();
  export type EndpointPropertiesDTO = unknown;

  export const EndpointStatus = zodSchemaEndpointStatus();
  export type EndpointStatus =
    | 'READY'
    | 'UNKNOWN'
    | 'NEW'
    | 'PROVISIONING'
    | 'DELETING'
    | 'FAILED';

  export const EndpointStatusDTO = zodSchemaEndpointStatusDTO();
  export type EndpointStatusDTO =
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

  export const EndpointTypeDTO = zodSchemaEndpointTypeDTO();
  export type EndpointTypeDTO =
    | 'ansible'
    | 'camel'
    | 'drawer'
    | 'email_subscription'
    | 'webhook';

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

  export const EventTypeDTO = zodSchemaEventTypeDTO();
  export type EventTypeDTO = {
    application?: ApplicationDTO | undefined | null;
    description?: string | undefined | null;
    display_name: string;
    id?: UUID | undefined | null;
    name: string;
  };

  export const EventTypeSettingsValue = zodSchemaEventTypeSettingsValue();
  export type EventTypeSettingsValue = {
    emailSubscriptionTypes?:
      | {
          [x: string]: boolean;
        }
      | undefined
      | null;
    hasForcedEmail?: boolean | undefined | null;
    subscriptionLocked?: boolean | undefined | null;
  };

  export const EventsReplayRequest = zodSchemaEventsReplayRequest();
  export type EventsReplayRequest = {
    end_date: LocalDateTime;
    org_id?: string | undefined | null;
    start_date: LocalDateTime;
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

  export const PageBehaviorGroup = zodSchemaPageBehaviorGroup();
  export type PageBehaviorGroup = {
    data: Array<BehaviorGroup>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
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

  export const PageNotificationHistory = zodSchemaPageNotificationHistory();
  export type PageNotificationHistory = {
    data: Array<NotificationHistory>;
    links: {
      [x: string]: string;
    };
    meta: Meta;
  };

  export const PagerDutyPropertiesDTO = zodSchemaPagerDutyPropertiesDTO();
  export type PagerDutyPropertiesDTO = {
    secretToken: string;
    severity: PagerDutySeverityDTO;
  };

  export const PagerDutySeverity = zodSchemaPagerDutySeverity();
  export type PagerDutySeverity = 'critical' | 'error' | 'warning' | 'info';

  export const PagerDutySeverityDTO = zodSchemaPagerDutySeverityDTO();
  export type PagerDutySeverityDTO = 'critical' | 'error' | 'warning' | 'info';

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

  export const RequestSystemSubscriptionProperties =
    zodSchemaRequestSystemSubscriptionProperties();
  export type RequestSystemSubscriptionProperties = {
    group_id?: UUID | undefined | null;
    only_admins: boolean;
  };

  export const ServerInfo = zodSchemaServerInfo();
  export type ServerInfo = {
    environment?: Environment | undefined | null;
  };

  export const SettingsValuesByEventType = zodSchemaSettingsValuesByEventType();
  export type SettingsValuesByEventType = {
    bundles?:
      | {
          [x: string]: BundleSettingsValue;
        }
      | undefined
      | null;
  };

  export const Status = zodSchemaStatus();
  export type Status = 'UP' | 'MAINTENANCE';

  export const SubscriptionType = zodSchemaSubscriptionType();
  export type SubscriptionType = 'INSTANT' | 'DAILY' | 'DRAWER';

  export const SystemSubscriptionPropertiesDTO =
    zodSchemaSystemSubscriptionPropertiesDTO();
  export type SystemSubscriptionPropertiesDTO = {
    groupId?: UUID | undefined | null;
    ignorePreferences?: boolean | undefined | null;
    onlyAdmins?: boolean | undefined | null;
  };

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

  export const UpdateApplicationRequest = zodSchemaUpdateApplicationRequest();
  export type UpdateApplicationRequest = {
    display_name?: string | undefined | null;
    name?: string | undefined | null;
    owner_role?: string | undefined | null;
  };

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

  export const WebhookPropertiesDTO = zodSchemaWebhookPropertiesDTO();
  export type WebhookPropertiesDTO = {
    basicAuthentication?: BasicAuthenticationDTO | undefined | null;
    bearerAuthentication?: string | undefined | null;
    disableSslVerification: boolean;
    method: HttpType;
    secretToken?: string | undefined | null;
    url: string;
  };

  export const X509Certificate = zodSchemaX509Certificate();
  export type X509Certificate = {
    application: string;
    bundle: string;
    id?: UUID | undefined | null;
    source_environment: string;
    subject_dn: string;
  };

  export const __Empty = zodSchema__Empty();
  export type __Empty = string | undefined;

  function zodSchemaAddAccessRequest() {
    return z
      .object({
        application_id: zodSchemaUUID().optional().nullable(),
        role: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaAddApplicationRequest() {
    return z
      .object({
        bundle_id: zodSchemaUUID(),
        display_name: z.string(),
        name: z.string(),
        owner_role: z.string().optional().nullable(),
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
        subscription_type: zodSchemaSubscriptionType(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
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
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaApplication1() {
    return z
      .object({
        display_name: z.string(),
        id: zodSchemaUUID(),
      })
      .nonstrict();
  }

  function zodSchemaApplicationDTO() {
    return z
      .object({
        bundle_id: zodSchemaUUID(),
        display_name: z.string(),
        event_types: z.array(zodSchemaEventTypeDTO()).optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaApplicationDTO1() {
    return z
      .object({
        bundle_id: zodSchemaUUID(),
        created: z.string().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        owner_role: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaApplicationSettingsValue() {
    return z
      .object({
        eventTypes: z
          .record(zodSchemaEventTypeSettingsValue())
          .optional()
          .nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBasicAuthenticationDTO() {
    return z
      .object({
        password: z.string().optional().nullable(),
        username: z.string().optional().nullable(),
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

  function zodSchemaBundleDTO() {
    return z
      .object({
        applications: z.array(zodSchemaApplicationDTO()).optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaBundleSettingsValue() {
    return z
      .object({
        applications: z
          .record(zodSchemaApplicationSettingsValue())
          .optional()
          .nullable(),
      })
      .nonstrict();
  }

  function zodSchemaCamelPropertiesDTO() {
    return z
      .object({
        basicAuthentication: zodSchemaBasicAuthenticationDTO()
          .optional()
          .nullable(),
        disableSslVerification: z.boolean(),
        extras: z.record(z.string()).optional().nullable(),
        secretToken: z.string().optional().nullable(),
        url: z.string(),
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

  function zodSchemaCurrentStatus() {
    return z
      .object({
        end_time: zodSchemaLocalDateTime().optional().nullable(),
        start_time: zodSchemaLocalDateTime().optional().nullable(),
        status: zodSchemaStatus(),
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

  function zodSchemaEndpointDTO() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        description: z.string(),
        enabled: z.boolean().optional().nullable(),
        event_types: z.array(z.string()).optional().nullable(),
        event_types_group_by_bundles_and_applications: z
          .array(zodSchemaBundleDTO())
          .optional()
          .nullable(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        properties: z
          .union([
            zodSchemaCamelPropertiesDTO(),
            zodSchemaSystemSubscriptionPropertiesDTO(),
            zodSchemaWebhookPropertiesDTO(),
            zodSchemaPagerDutyPropertiesDTO(),
          ])
          .optional()
          .nullable(),
        server_errors: z.number().int().optional().nullable(),
        status: zodSchemaEndpointStatusDTO().optional().nullable(),
        sub_type: z.string().optional().nullable(),
        type: zodSchemaEndpointTypeDTO(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointPage() {
    return z
      .object({
        data: z.array(zodSchemaEndpointDTO()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaEndpointProperties() {
    return z.unknown();
  }

  function zodSchemaEndpointPropertiesDTO() {
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

  function zodSchemaEndpointStatusDTO() {
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

  function zodSchemaEndpointTypeDTO() {
    return z.enum([
      'ansible',
      'camel',
      'drawer',
      'email_subscription',
      'webhook',
    ]);
  }

  function zodSchemaEnvironment() {
    return z.enum(['PROD', 'STAGE', 'EPHEMERAL', 'LOCAL_SERVER']);
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

  function zodSchemaEventTypeDTO() {
    return z
      .object({
        application: z
          .lazy(() => zodSchemaApplicationDTO())
          .optional()
          .nullable(),
        description: z.string().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaEventTypeSettingsValue() {
    return z
      .object({
        emailSubscriptionTypes: z.record(z.boolean()).optional().nullable(),
        hasForcedEmail: z.boolean().optional().nullable(),
        subscriptionLocked: z.boolean().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEventsReplayRequest() {
    return z
      .object({
        end_date: zodSchemaLocalDateTime(),
        org_id: z.string().optional().nullable(),
        start_date: zodSchemaLocalDateTime(),
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

  function zodSchemaHttpType() {
    return z.enum(['GET', 'POST', 'PUT']);
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
        updated: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaInternalApplicationUserPermission() {
    return z
      .object({
        application_display_name: z.string(),
        application_id: zodSchemaUUID(),
        role: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaInternalRoleAccess() {
    return z
      .object({
        application_id: zodSchemaUUID(),
        id: zodSchemaUUID().optional().nullable(),
        role: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaInternalUserPermissions() {
    return z
      .object({
        applications: z.array(zodSchemaApplication1()),
        is_admin: z.boolean(),
        roles: z.array(z.string()),
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
        errors: z.record(z.array(z.string())),
      })
      .nonstrict();
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
        endpointSubType: z.string().optional().nullable(),
        endpointType: zodSchemaEndpointType().optional().nullable(),
        id: zodSchemaUUID().optional().nullable(),
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

  function zodSchemaPageBehaviorGroup() {
    return z
      .object({
        data: z.array(zodSchemaBehaviorGroup()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
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

  function zodSchemaPageNotificationHistory() {
    return z
      .object({
        data: z.array(zodSchemaNotificationHistory()),
        links: z.record(z.string()),
        meta: zodSchemaMeta(),
      })
      .nonstrict();
  }

  function zodSchemaPagerDutyPropertiesDTO() {
    return z
      .object({
        secretToken: z.string(),
        severity: zodSchemaPagerDutySeverityDTO(),
      })
      .nonstrict();
  }

  function zodSchemaPagerDutySeverity() {
    return z.enum(['critical', 'error', 'warning', 'info']);
  }

  function zodSchemaPagerDutySeverityDTO() {
    return z.enum(['critical', 'error', 'warning', 'info']);
  }

  function zodSchemaRenderEmailTemplateRequest() {
    return z
      .object({
        payload: z.string(),
        template: z.array(z.string()),
      })
      .nonstrict();
  }

  function zodSchemaRequestDefaultBehaviorGroupPropertyList() {
    return z
      .object({
        ignore_preferences: z.boolean(),
        only_admins: z.boolean(),
      })
      .nonstrict();
  }

  function zodSchemaRequestSystemSubscriptionProperties() {
    return z
      .object({
        group_id: zodSchemaUUID().optional().nullable(),
        only_admins: z.boolean(),
      })
      .nonstrict();
  }

  function zodSchemaServerInfo() {
    return z
      .object({
        environment: zodSchemaEnvironment().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaSettingsValuesByEventType() {
    return z
      .object({
        bundles: z.record(zodSchemaBundleSettingsValue()).optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaStatus() {
    return z.enum(['UP', 'MAINTENANCE']);
  }

  function zodSchemaSubscriptionType() {
    return z.enum(['INSTANT', 'DAILY', 'DRAWER']);
  }

  function zodSchemaSystemSubscriptionPropertiesDTO() {
    return z
      .object({
        groupId: zodSchemaUUID().optional().nullable(),
        ignorePreferences: z.boolean().optional().nullable(),
        onlyAdmins: z.boolean().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaTemplate() {
    return z
      .object({
        created: zodSchemaLocalDateTime().optional().nullable(),
        data: z.string(),
        description: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        name: z.string(),
        updated: zodSchemaLocalDateTime().optional().nullable(),
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
        start: zodSchemaLocalDateTime().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaUUID() {
    return z.string();
  }

  function zodSchemaUpdateApplicationRequest() {
    return z
      .object({
        display_name: z.string().optional().nullable(),
        name: z.string().optional().nullable(),
        owner_role: z.string().optional().nullable(),
      })
      .nonstrict();
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

  function zodSchemaWebhookPropertiesDTO() {
    return z
      .object({
        basicAuthentication: zodSchemaBasicAuthenticationDTO()
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

  function zodSchemaX509Certificate() {
    return z
      .object({
        application: z.string(),
        bundle: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        source_environment: z.string(),
        subject_dn: z.string(),
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
      body: Schemas.EndpointDTO;
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
      | ValidatedResponse<'EndpointDTO', 200, Schemas.EndpointDTO>
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
          rules: [new ValidateRule(Schemas.EndpointDTO, 'EndpointDTO', 200)],
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
      | ValidatedResponse<'EndpointDTO', 200, Schemas.EndpointDTO>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = '/api/integrations/v1.0/endpoints/system/email_subscription';
      const query = {} as Record<string, any>;
      return actionBuilder('POST', path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Schemas.EndpointDTO, 'EndpointDTO', 200)],
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
      | ValidatedResponse<'EndpointDTO', 200, Schemas.EndpointDTO>
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
          rules: [new ValidateRule(Schemas.EndpointDTO, 'EndpointDTO', 200)],
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
      body: Schemas.EndpointDTO;
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
