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

export namespace Schemas {
  export const UUID = zodSchemaUUID();
  export type UUID = string;

  export const Endpoint = zodSchemaEndpoint();
  export type Endpoint = {
    created?: Date | undefined | null;
    description: string;
    enabled?: boolean | undefined | null;
    id?: UUID | undefined | null;
    name: string;
    properties?:
      | (WebhookAttributes | EmailSubscriptionAttributes)
      | undefined
      | null;
    type: EndpointType & ('webhook' | 'email_subscription' | 'default');
    updated?: Date | undefined | null;
  };

  export const ListEndpoint = zodSchemaListEndpoint();
  export type ListEndpoint = Array<Endpoint>;

  export const Date = zodSchemaDate();
  export type Date = string;

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

  export const EmailSubscriptionAttributes = zodSchemaEmailSubscriptionAttributes();
  export type EmailSubscriptionAttributes = unknown;

  export const EndpointType = zodSchemaEndpointType();
  export type EndpointType = 'webhook' | 'email_subscription' | 'default';

  export const EventType = zodSchemaEventType();
  export type EventType = {
    application?: Application | undefined | null;
    description: string;
    endpoints?: SetEndpoint | undefined | null;
    id?: number | undefined | null;
    name: string;
  };

  export const ListEventType = zodSchemaListEventType();
  export type ListEventType = Array<EventType>;

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

  export const SetEventType = zodSchemaSetEventType();
  export type SetEventType = Array<EventType>;

  export const Action = zodSchemaAction();
  export type Action = {
    application?: string | undefined | null;
    endpoint_id?: UUID | undefined | null;
    event?: Context | undefined | null;
    event_id?: string | undefined | null;
    event_type?: string | undefined | null;
    params?: Map | undefined | null;
    tags?: ListTag | undefined | null;
    timestamp?: LocalDateTime | undefined | null;
    endpointId?: UUID | undefined | null;
    eventId?: string | undefined | null;
    eventType?: string | undefined | null;
    schema?: Schema | undefined | null;
    specificData?: SpecificData | undefined | null;
  };

  export const Context = zodSchemaContext();
  export type Context = {
    account_id?: string | undefined | null;
    message?: MapStringString | undefined | null;
    accountId?: string | undefined | null;
    schema?: Schema | undefined | null;
    specificData?: SpecificData | undefined | null;
  };

  export const Map = zodSchemaMap();
  export type Map = unknown;

  export const Tag = zodSchemaTag();
  export type Tag = {
    name?: string | undefined | null;
    value?: string | undefined | null;
    schema?: Schema | undefined | null;
    specificData?: SpecificData | undefined | null;
  };

  export const ListTag = zodSchemaListTag();
  export type ListTag = Array<Tag>;

  export const LocalDateTime = zodSchemaLocalDateTime();
  export type LocalDateTime = string;

  export const Schema = zodSchemaSchema();
  export type Schema = {
    props?: ConcurrentMapStringJsonNode | undefined | null;
    reserved?: SetString | undefined | null;
    objectProps?: MapStringObject | undefined | null;
    hashCode?: number | undefined | null;
    logicalType?: LogicalType | undefined | null;
    type?: Type | undefined | null;
    aliases?: SetString | undefined | null;
    doc?: string | undefined | null;
    elementType?: Schema | undefined | null;
    enumDefault?: string | undefined | null;
    enumSymbols?: ListString | undefined | null;
    fields?: ListField | undefined | null;
    fixedSize?: number | undefined | null;
    fullName?: string | undefined | null;
    name?: string | undefined | null;
    namespace?: string | undefined | null;
    types?: ListSchema | undefined | null;
    valueType?: Schema | undefined | null;
    error?: boolean | undefined | null;
    nullable?: boolean | undefined | null;
    union?: boolean | undefined | null;
  };

  export const SpecificData = zodSchemaSpecificData();
  export type SpecificData = {
    classLoader?: unknown | undefined | null;
    conversions?: MapStringConversionObject | undefined | null;
    conversionsByClass?:
      | MapClassObjectMapStringConversionObject
      | undefined
      | null;
    defaultValueCache?: MapFieldObject | undefined | null;
    fastReaderBuilder?: FastReaderBuilder | undefined | null;
    fastReaderEnabled?: boolean | undefined | null;
    classCache?: MapStringClass | undefined | null;
    schemaClassCache?: unknown | undefined | null;
    schemaTypeCache?: MapTypeSchema | undefined | null;
    stringableClasses?: SetClass | undefined | null;
    useCustomCoderFlag?: boolean | undefined | null;
    customCoders?: boolean | undefined | null;
  };

  export const ConversionObject = zodSchemaConversionObject();
  export type ConversionObject = {
    convertedType?: unknown | undefined | null;
    logicalTypeName?: string | undefined | null;
    recommendedSchema?: Schema | undefined | null;
  };

  export const MapStringConversionObject = zodSchemaMapStringConversionObject();
  export type MapStringConversionObject = {
    [x: string]: ConversionObject;
  };

  export const MapClassObjectMapStringConversionObject = zodSchemaMapClassObjectMapStringConversionObject();
  export type MapClassObjectMapStringConversionObject = {
    [x: string]: MapStringConversionObject;
  };

  export const MapFieldObject = zodSchemaMapFieldObject();
  export type MapFieldObject = {
    [x: string]: unknown;
  };

  export const FastReaderBuilder = zodSchemaFastReaderBuilder();
  export type FastReaderBuilder = {
    classPropEnabled?: boolean | undefined | null;
    data?: GenericData | undefined | null;
    keyClassEnabled?: boolean | undefined | null;
    readerCache?: MapSchemaMapSchemaRecordReader | undefined | null;
  };

  export const MapStringClass = zodSchemaMapStringClass();
  export type MapStringClass = {
    [x: string]: unknown;
  };

  export const MapTypeSchema = zodSchemaMapTypeSchema();
  export type MapTypeSchema = {
    [x: string]: Schema;
  };

  export const SetClass = zodSchemaSetClass();
  export type SetClass = Array<unknown>;

  export const JsonNode = zodSchemaJsonNode();
  export type JsonNode = {
    nodeType?: JsonNodeType | undefined | null;
    array?: boolean | undefined | null;
    bigDecimal?: boolean | undefined | null;
    bigInteger?: boolean | undefined | null;
    binary?: boolean | undefined | null;
    boolean?: boolean | undefined | null;
    containerNode?: boolean | undefined | null;
    double?: boolean | undefined | null;
    empty?: boolean | undefined | null;
    float?: boolean | undefined | null;
    floatingPointNumber?: boolean | undefined | null;
    int?: boolean | undefined | null;
    integralNumber?: boolean | undefined | null;
    long?: boolean | undefined | null;
    missingNode?: boolean | undefined | null;
    null?: boolean | undefined | null;
    number?: boolean | undefined | null;
    object?: boolean | undefined | null;
    pojo?: boolean | undefined | null;
    short?: boolean | undefined | null;
    textual?: boolean | undefined | null;
    valueNode?: boolean | undefined | null;
  };

  export const ConcurrentMapStringJsonNode = zodSchemaConcurrentMapStringJsonNode();
  export type ConcurrentMapStringJsonNode = {
    [x: string]: JsonNode;
  };

  export const SetString = zodSchemaSetString();
  export type SetString = Array<string>;

  export const MapStringObject = zodSchemaMapStringObject();
  export type MapStringObject = {
    [x: string]: unknown;
  };

  export const LogicalType = zodSchemaLogicalType();
  export type LogicalType = {
    name?: string | undefined | null;
  };

  export const Type = zodSchemaType();
  export type Type =
    | 'ARRAY'
    | 'BOOLEAN'
    | 'BYTES'
    | 'DOUBLE'
    | 'ENUM'
    | 'FIXED'
    | 'FLOAT'
    | 'INT'
    | 'LONG'
    | 'MAP'
    | 'NULL'
    | 'RECORD'
    | 'STRING'
    | 'UNION';

  export const ListString = zodSchemaListString();
  export type ListString = Array<string>;

  export const Field = zodSchemaField();
  export type Field = {
    props?: ConcurrentMapStringJsonNode | undefined | null;
    reserved?: SetString | undefined | null;
    objectProps?: MapStringObject | undefined | null;
    aliases?: SetString | undefined | null;
    defaultValue?: JsonNode | undefined | null;
    doc?: string | undefined | null;
    name?: string | undefined | null;
    order?: Order | undefined | null;
    position?: number | undefined | null;
    schema?: Schema | undefined | null;
  };

  export const ListField = zodSchemaListField();
  export type ListField = Array<Field>;

  export const ListSchema = zodSchemaListSchema();
  export type ListSchema = Array<Schema>;

  export const Order = zodSchemaOrder();
  export type Order = 'ASCENDING' | 'DESCENDING' | 'IGNORE';

  export const JsonNodeType = zodSchemaJsonNodeType();
  export type JsonNodeType =
    | 'ARRAY'
    | 'BINARY'
    | 'BOOLEAN'
    | 'MISSING'
    | 'NULL'
    | 'NUMBER'
    | 'OBJECT'
    | 'POJO'
    | 'STRING';

  export const GenericData = zodSchemaGenericData();
  export type GenericData = {
    classLoader?: unknown | undefined | null;
    conversions?: MapStringConversionObject | undefined | null;
    conversionsByClass?:
      | MapClassObjectMapStringConversionObject
      | undefined
      | null;
    defaultValueCache?: MapFieldObject | undefined | null;
    fastReaderBuilder?: FastReaderBuilder | undefined | null;
    fastReaderEnabled?: boolean | undefined | null;
  };

  export const MapSchemaRecordReader = zodSchemaMapSchemaRecordReader();
  export type MapSchemaRecordReader = {
    empty?: boolean | undefined | null;
  };

  export const MapSchemaMapSchemaRecordReader = zodSchemaMapSchemaMapSchemaRecordReader();
  export type MapSchemaMapSchemaRecordReader = {
    [x: string]: MapSchemaRecordReader;
  };

  export const MapStringString = zodSchemaMapStringString();
  export type MapStringString = {
    [x: string]: string;
  };

  export const Notification = zodSchemaNotification();
  export type Notification = {
    action?: Action | undefined | null;
    endpoint?: Endpoint | undefined | null;
    eventId?: string | undefined | null;
    tenant?: string | undefined | null;
  };

  export const JsonObject = zodSchemaJsonObject();
  export type JsonObject = Array<unknown>;

  export const NotificationHistory = zodSchemaNotificationHistory();
  export type NotificationHistory = {
    created?: Date | undefined | null;
    details?: JsonObject | undefined | null;
    endpointId?: UUID | undefined | null;
    eventId?: string | undefined | null;
    id?: number | undefined | null;
    invocationResult?: boolean | undefined | null;
    invocationTime?: number | undefined | null;
  };

  export const ListNotificationHistory = zodSchemaListNotificationHistory();
  export type ListNotificationHistory = Array<NotificationHistory>;

  export const ListApplication = zodSchemaListApplication();
  export type ListApplication = Array<Application>;

  function zodSchemaUUID() {
      return z.string();
  }

  function zodSchemaEndpoint() {
      return z
      .object({
          created: zodSchemaDate().optional().nullable(),
          description: z.string(),
          enabled: z.boolean().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          properties: z
          .union([
              zodSchemaWebhookAttributes(),
              zodSchemaEmailSubscriptionAttributes()
          ])
          .optional()
          .nullable(),
          type: z.intersection(
              zodSchemaEndpointType(),
              z.enum([ 'webhook', 'email_subscription', 'default' ])
          ),
          updated: zodSchemaDate().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaListEndpoint() {
      return z.array(zodSchemaEndpoint());
  }

  function zodSchemaDate() {
      return z.string();
  }

  function zodSchemaAttributes() {
      return z.unknown();
  }

  function zodSchemaBasicAuthentication() {
      return z
      .object({
          password: z.string().optional().nullable(),
          username: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaHttpType() {
      return z.enum([ 'GET', 'POST', 'PUT' ]);
  }

  function zodSchemaWebhookAttributes() {
      return z
      .object({
          basic_authentication: zodSchemaBasicAuthentication()
          .optional()
          .nullable(),
          disable_ssl_verification: z.boolean().optional().nullable(),
          method: z.intersection(
              zodSchemaHttpType(),
              z.enum([ 'GET', 'POST', 'PUT' ])
          ),
          secret_token: z.string().optional().nullable(),
          url: z.string()
      })
      .nonstrict();
  }

  function zodSchemaEmailSubscriptionAttributes() {
      return z.unknown();
  }

  function zodSchemaEndpointType() {
      return z.enum([ 'webhook', 'email_subscription', 'default' ]);
  }

  function zodSchemaEventType() {
      return z
      .object({
          application: zodSchemaApplication().optional().nullable(),
          description: z.string(),
          endpoints: zodSchemaSetEndpoint().optional().nullable(),
          id: z.number().int().optional().nullable(),
          name: z.string()
      })
      .nonstrict();
  }

  function zodSchemaListEventType() {
      return z.array(zodSchemaEventType());
  }

  function zodSchemaApplication() {
      return z
      .object({
          created: zodSchemaDate().optional().nullable(),
          description: z.string(),
          eventTypes: zodSchemaSetEventType().optional().nullable(),
          id: zodSchemaUUID().optional().nullable(),
          name: z.string(),
          updated: zodSchemaDate().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaSetEndpoint() {
      return z.array(zodSchemaEndpoint());
  }

  function zodSchemaSetEventType() {
      return z.array(z.lazy(() => zodSchemaEventType()));
  }

  function zodSchemaAction() {
      return z
      .object({
          application: z.string().optional().nullable(),
          endpoint_id: zodSchemaUUID().optional().nullable(),
          event: zodSchemaContext().optional().nullable(),
          event_id: z.string().optional().nullable(),
          event_type: z.string().optional().nullable(),
          params: zodSchemaMap().optional().nullable(),
          tags: zodSchemaListTag().optional().nullable(),
          timestamp: zodSchemaLocalDateTime().optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          eventId: z.string().optional().nullable(),
          eventType: z.string().optional().nullable(),
          schema: zodSchemaSchema().optional().nullable(),
          specificData: zodSchemaSpecificData().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaContext() {
      return z
      .object({
          account_id: z.string().optional().nullable(),
          message: zodSchemaMapStringString().optional().nullable(),
          accountId: z.string().optional().nullable(),
          schema: zodSchemaSchema().optional().nullable(),
          specificData: zodSchemaSpecificData().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMap() {
      return z.unknown();
  }

  function zodSchemaTag() {
      return z
      .object({
          name: z.string().optional().nullable(),
          value: z.string().optional().nullable(),
          schema: zodSchemaSchema().optional().nullable(),
          specificData: zodSchemaSpecificData().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaListTag() {
      return z.array(zodSchemaTag());
  }

  function zodSchemaLocalDateTime() {
      return z.string();
  }

  function zodSchemaSchema() {
      return z
      .object({
          props: zodSchemaConcurrentMapStringJsonNode().optional().nullable(),
          reserved: zodSchemaSetString().optional().nullable(),
          objectProps: zodSchemaMapStringObject().optional().nullable(),
          hashCode: z.number().int().optional().nullable(),
          logicalType: zodSchemaLogicalType().optional().nullable(),
          type: zodSchemaType().optional().nullable(),
          aliases: zodSchemaSetString().optional().nullable(),
          doc: z.string().optional().nullable(),
          elementType: z
          .lazy(() => zodSchemaSchema())
          .optional()
          .nullable(),
          enumDefault: z.string().optional().nullable(),
          enumSymbols: zodSchemaListString().optional().nullable(),
          fields: zodSchemaListField().optional().nullable(),
          fixedSize: z.number().int().optional().nullable(),
          fullName: z.string().optional().nullable(),
          name: z.string().optional().nullable(),
          namespace: z.string().optional().nullable(),
          types: zodSchemaListSchema().optional().nullable(),
          valueType: z
          .lazy(() => zodSchemaSchema())
          .optional()
          .nullable(),
          error: z.boolean().optional().nullable(),
          nullable: z.boolean().optional().nullable(),
          union: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaSpecificData() {
      return z
      .object({
          classLoader: z.unknown().optional().nullable(),
          conversions: zodSchemaMapStringConversionObject().optional().nullable(),
          conversionsByClass: zodSchemaMapClassObjectMapStringConversionObject()
          .optional()
          .nullable(),
          defaultValueCache: zodSchemaMapFieldObject().optional().nullable(),
          fastReaderBuilder: zodSchemaFastReaderBuilder().optional().nullable(),
          fastReaderEnabled: z.boolean().optional().nullable(),
          classCache: zodSchemaMapStringClass().optional().nullable(),
          schemaClassCache: z.unknown().optional().nullable(),
          schemaTypeCache: zodSchemaMapTypeSchema().optional().nullable(),
          stringableClasses: zodSchemaSetClass().optional().nullable(),
          useCustomCoderFlag: z.boolean().optional().nullable(),
          customCoders: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaConversionObject() {
      return z
      .object({
          convertedType: z.unknown().optional().nullable(),
          logicalTypeName: z.string().optional().nullable(),
          recommendedSchema: zodSchemaSchema().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMapStringConversionObject() {
      return z.record(zodSchemaConversionObject());
  }

  function zodSchemaMapClassObjectMapStringConversionObject() {
      return z.record(zodSchemaMapStringConversionObject());
  }

  function zodSchemaMapFieldObject() {
      return z.record(z.unknown());
  }

  function zodSchemaFastReaderBuilder() {
      return z
      .object({
          classPropEnabled: z.boolean().optional().nullable(),
          data: zodSchemaGenericData().optional().nullable(),
          keyClassEnabled: z.boolean().optional().nullable(),
          readerCache: zodSchemaMapSchemaMapSchemaRecordReader()
          .optional()
          .nullable()
      })
      .nonstrict();
  }

  function zodSchemaMapStringClass() {
      return z.record(z.unknown());
  }

  function zodSchemaMapTypeSchema() {
      return z.record(zodSchemaSchema());
  }

  function zodSchemaSetClass() {
      return z.array(z.unknown());
  }

  function zodSchemaJsonNode() {
      return z
      .object({
          nodeType: zodSchemaJsonNodeType().optional().nullable(),
          array: z.boolean().optional().nullable(),
          bigDecimal: z.boolean().optional().nullable(),
          bigInteger: z.boolean().optional().nullable(),
          binary: z.boolean().optional().nullable(),
          boolean: z.boolean().optional().nullable(),
          containerNode: z.boolean().optional().nullable(),
          double: z.boolean().optional().nullable(),
          empty: z.boolean().optional().nullable(),
          float: z.boolean().optional().nullable(),
          floatingPointNumber: z.boolean().optional().nullable(),
          int: z.boolean().optional().nullable(),
          integralNumber: z.boolean().optional().nullable(),
          long: z.boolean().optional().nullable(),
          missingNode: z.boolean().optional().nullable(),
          null: z.boolean().optional().nullable(),
          number: z.boolean().optional().nullable(),
          object: z.boolean().optional().nullable(),
          pojo: z.boolean().optional().nullable(),
          short: z.boolean().optional().nullable(),
          textual: z.boolean().optional().nullable(),
          valueNode: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaConcurrentMapStringJsonNode() {
      return z.record(zodSchemaJsonNode());
  }

  function zodSchemaSetString() {
      return z.array(z.string());
  }

  function zodSchemaMapStringObject() {
      return z.record(z.unknown());
  }

  function zodSchemaLogicalType() {
      return z
      .object({
          name: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaType() {
      return z.enum([
          'ARRAY',
          'BOOLEAN',
          'BYTES',
          'DOUBLE',
          'ENUM',
          'FIXED',
          'FLOAT',
          'INT',
          'LONG',
          'MAP',
          'NULL',
          'RECORD',
          'STRING',
          'UNION'
      ]);
  }

  function zodSchemaListString() {
      return z.array(z.string());
  }

  function zodSchemaField() {
      return z
      .object({
          props: zodSchemaConcurrentMapStringJsonNode().optional().nullable(),
          reserved: zodSchemaSetString().optional().nullable(),
          objectProps: zodSchemaMapStringObject().optional().nullable(),
          aliases: zodSchemaSetString().optional().nullable(),
          defaultValue: zodSchemaJsonNode().optional().nullable(),
          doc: z.string().optional().nullable(),
          name: z.string().optional().nullable(),
          order: zodSchemaOrder().optional().nullable(),
          position: z.number().int().optional().nullable(),
          schema: z
          .lazy(() => zodSchemaSchema())
          .optional()
          .nullable()
      })
      .nonstrict();
  }

  function zodSchemaListField() {
      return z.array(zodSchemaField());
  }

  function zodSchemaListSchema() {
      return z.array(z.lazy(() => zodSchemaSchema()));
  }

  function zodSchemaOrder() {
      return z.enum([ 'ASCENDING', 'DESCENDING', 'IGNORE' ]);
  }

  function zodSchemaJsonNodeType() {
      return z.enum([
          'ARRAY',
          'BINARY',
          'BOOLEAN',
          'MISSING',
          'NULL',
          'NUMBER',
          'OBJECT',
          'POJO',
          'STRING'
      ]);
  }

  function zodSchemaGenericData() {
      return z
      .object({
          classLoader: z.unknown().optional().nullable(),
          conversions: zodSchemaMapStringConversionObject().optional().nullable(),
          conversionsByClass: zodSchemaMapClassObjectMapStringConversionObject()
          .optional()
          .nullable(),
          defaultValueCache: zodSchemaMapFieldObject().optional().nullable(),
          fastReaderBuilder: z
          .lazy(() => zodSchemaFastReaderBuilder())
          .optional()
          .nullable(),
          fastReaderEnabled: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMapSchemaRecordReader() {
      return z
      .object({
          empty: z.boolean().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaMapSchemaMapSchemaRecordReader() {
      return z.record(zodSchemaMapSchemaRecordReader());
  }

  function zodSchemaMapStringString() {
      return z.record(z.string());
  }

  function zodSchemaNotification() {
      return z
      .object({
          action: zodSchemaAction().optional().nullable(),
          endpoint: zodSchemaEndpoint().optional().nullable(),
          eventId: z.string().optional().nullable(),
          tenant: z.string().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaJsonObject() {
      return z.array(z.unknown());
  }

  function zodSchemaNotificationHistory() {
      return z
      .object({
          created: zodSchemaDate().optional().nullable(),
          details: zodSchemaJsonObject().optional().nullable(),
          endpointId: zodSchemaUUID().optional().nullable(),
          eventId: z.string().optional().nullable(),
          id: z.number().int().optional().nullable(),
          invocationResult: z.boolean().optional().nullable(),
          invocationTime: z.number().int().optional().nullable()
      })
      .nonstrict();
  }

  function zodSchemaListNotificationHistory() {
      return z.array(zodSchemaNotificationHistory());
  }

  function zodSchemaListApplication() {
      return z.array(zodSchemaApplication());
  }
}

export namespace Operations {
  // GET /notifications/defaults
  export namespace NotificationServiceGetEndpointsForDefaults {
    export type Payload =
      | ValidatedResponse<'ListEndpoint', 200, Schemas.ListEndpoint>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/defaults';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Schemas.ListEndpoint, 'ListEndpoint', 200) ]
        })
        .build();
    };
  }
  // PUT /notifications/defaults/{endpointId}
  export namespace NotificationServiceAddEndpointToDefaults {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      endpointId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/defaults/{endpointId}'.replace(
            '{endpointId}',
            params.endpointId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // DELETE /notifications/defaults/{endpointId}
  export namespace NotificationServiceDeleteEndpointFromDefaults {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      endpointId: Schemas.UUID;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/defaults/{endpointId}'.replace(
            '{endpointId}',
            params.endpointId.toString()
        );
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes
  export namespace NotificationServiceGetEventTypes {
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    export interface Params {
      applicationId?: Schemas.UUID;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'ListEventType', 200, Schemas.ListEventType>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes';
        const query = {} as Record<string, any>;
        if (params.applicationId !== undefined) {
            query.applicationId = params.applicationId;
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
                new ValidateRule(Schemas.ListEventType, 'ListEventType', 200)
            ]
        })
        .build();
    };
  }
  // GET /notifications/eventTypes/{eventTypeId}
  export namespace NotificationServiceGetLinkedEndpoints {
    const EventTypeId = z.number().int();
    type EventTypeId = number;
    const Limit = z.number().int();
    type Limit = number;
    const Offset = z.number().int();
    type Offset = number;
    const PageNumber = z.number().int();
    type PageNumber = number;
    const SortBy = z.string();
    type SortBy = string;
    export interface Params {
      eventTypeId: EventTypeId;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<'ListEndpoint', 200, Schemas.ListEndpoint>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}'.replace(
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
            rules: [ new ValidateRule(Schemas.ListEndpoint, 'ListEndpoint', 200) ]
        })
        .build();
    };
  }
  // PUT /notifications/eventTypes/{eventTypeId}/{endpointId}
  export namespace NotificationServiceLinkEndpointToEventType {
    const EventTypeId = z.number().int();
    type EventTypeId = number;
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      endpointId: Schemas.UUID;
      eventTypeId: EventTypeId;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/{endpointId}'
        .replace('{endpointId}', params.endpointId.toString())
        .replace('{eventTypeId}', params.eventTypeId.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('PUT', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // DELETE /notifications/eventTypes/{eventTypeId}/{endpointId}
  export namespace NotificationServiceUnlinkEndpointFromEventType {
    const EventTypeId = z.number().int();
    type EventTypeId = number;
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      endpointId: Schemas.UUID;
      eventTypeId: EventTypeId;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/{endpointId}'
        .replace('{endpointId}', params.endpointId.toString())
        .replace('{eventTypeId}', params.eventTypeId.toString());
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // GET /notifications/updates
  export namespace NotificationServiceGetNotificationUpdates {
    const Response200 = z.array(Schemas.Notification);
    type Response200 = Array<Schemas.Notification>;
    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/updates';
        const query = {} as Record<string, any>;
        return actionBuilder('GET', path)
        .queryParams(query)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
  // DELETE /notifications/{id}
  export namespace NotificationServiceMarkRead {
    const Body = z.number().int();
    type Body = number;
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<'Response200', 200, Response200>
      | ValidatedResponse<'unknown', undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
        const path = '/api/notifications/v1.0/notifications/{id}';
        const query = {} as Record<string, any>;
        return actionBuilder('DELETE', path)
        .queryParams(query)
        .data(params.body)
        .config({
            rules: [ new ValidateRule(Response200, 'Response200', 200) ]
        })
        .build();
    };
  }
}
