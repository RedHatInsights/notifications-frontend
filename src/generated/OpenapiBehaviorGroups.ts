/* eslint-disable */
import { ValidatedResponse } from "openapi2typescript";
import { ValidateRule } from "openapi2typescript";
import {
  actionBuilder,
  ActionValidatableConfig,
} from "openapi2typescript/react-fetching-library";
import { Action } from "react-fetching-library";
import * as z from "zod";
import { Schemas as SchemasNotifications } from "./OpenapiNotifications";

type UUID = SchemasNotifications.UUID;
type Endpoint = SchemasNotifications.Endpoint;

// Behavior group API is currently hidden, manually copied the diff when un-hiding it on the backend.
export namespace Schemas {
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

  function zodSchemaBehaviorGroup() {
    return z
      .object({
        actions: z.array(zodSchemaBehaviorGroupAction()).optional().nullable(),
        bundle_id: zodSchemaUUID(),
        created: z.string().optional().nullable(),
        display_name: z.string(),
        id: zodSchemaUUID().optional().nullable(),
        updated: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaBehaviorGroupAction() {
    return z
      .object({
        created: z.string().optional().nullable(),
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

  function zodSchemaUUID() {
    return z.string();
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
          ])
          .optional()
          .nullable(),
        type: zodSchemaEndpointType(),
        updated: z.string().optional().nullable(),
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
        url: z.string(),
      })
      .nonstrict();
  }

  function zodSchemaHttpType() {
    return z.enum(["GET", "POST", "PUT"]);
  }

  function zodSchemaBasicAuthentication() {
    return z
      .object({
        password: z.string().optional().nullable(),
        username: z.string().optional().nullable(),
      })
      .nonstrict();
  }

  function zodSchemaEmailSubscriptionProperties() {
    return z.unknown();
  }

  function zodSchemaEndpointType() {
    return z.enum(["webhook", "email_subscription", "default"]);
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
      | ValidatedResponse<"BehaviorGroup", 200, Schemas.BehaviorGroup>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/behaviorGroups";
      const query = {} as Record<string, any>;
      return actionBuilder("POST", path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [
            new ValidateRule(Schemas.BehaviorGroup, "BehaviorGroup", 200),
          ],
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
      behaviorGroupId: SchemasNotifications.UUID;
      body: Body;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/behaviorGroups/{behaviorGroupId}/actions".replace(
        "{behaviorGroupId}",
        params.behaviorGroupId.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("PUT", path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
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
      id: SchemasNotifications.UUID;
      body: Schemas.BehaviorGroup;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/behaviorGroups/{id}".replace(
        "{id}",
        params.id.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("PUT", path)
        .queryParams(query)
        .data(params.body)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
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
      id: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/behaviorGroups/{id}".replace(
        "{id}",
        params.id.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("DELETE", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
        })
        .build();
    };
  }
  // GET /notifications/bg/eventTypes/affectedByRemovalOfEndpoint/{endpointId}
  // Retrieve the event types affected by the removal of an integration.
  export namespace NotificationServiceGetEventTypesAffectedByRemovalOfEndpoint {
    const Response200 = z.array(SchemasNotifications.EventType);
    type Response200 = Array<SchemasNotifications.EventType>;
    export interface Params {
      endpointId: SchemasNotifications.UUID;
    }
    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/bg/eventTypes/affectedByRemovalOfEndpoint/{endpointId}".replace(
        "{endpointId}",
        params.endpointId.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("GET", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
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
      bundleId: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/bundles/{bundleId}/behaviorGroups".replace(
        "{bundleId}",
        params.bundleId.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("GET", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
        })
        .build();
    };
  }

  // GET /notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}
  // Retrieve the event types affected by the removal of a behavior group.
  export namespace NotificationServiceGetEventTypesAffectedByRemovalOfBehaviorGroup {
    const Response200 = z.array(SchemasNotifications.EventType);
    type Response200 = Array<SchemasNotifications.EventType>;
    export interface Params {
      behaviorGroupId: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/eventTypes/affectedByRemovalOfBehaviorGroup/{behaviorGroupId}".replace(
        "{behaviorGroupId}",
        params.behaviorGroupId.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("GET", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
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
      eventTypeId: SchemasNotifications.UUID;
      limit?: Limit;
      offset?: Offset;
      pageNumber?: PageNumber;
      sortBy?: SortBy;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups".replace(
        "{eventTypeId}",
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

      return actionBuilder("GET", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
        })
        .build();
    };
  }

  // PUT /notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}
  // Link a behavior group to an event type.
  export namespace NotificationServiceLinkBehaviorGroupToEventType {
    const Response200 = z.string();
    type Response200 = string;
    export interface Params {
      behaviorGroupId: SchemasNotifications.UUID;
      eventTypeId: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}"
        .replace("{behaviorGroupId}", params.behaviorGroupId.toString())
        .replace("{eventTypeId}", params.eventTypeId.toString());
      const query = {} as Record<string, any>;
      return actionBuilder("PUT", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
        })
        .build();
    };
  }
  // DELETE /notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}
  // Unlink a behavior group from an event type.
  export namespace NotificationServiceUnlinkBehaviorGroupFromEventType {
    export interface Params {
      behaviorGroupId: SchemasNotifications.UUID;
      eventTypeId: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"__Empty", 204, SchemasNotifications.__Empty>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/behaviorGroups/{behaviorGroupId}"
        .replace("{behaviorGroupId}", params.behaviorGroupId.toString())
        .replace("{eventTypeId}", params.eventTypeId.toString());
      const query = {} as Record<string, any>;
      return actionBuilder("DELETE", path)
        .queryParams(query)
        .config({
          rules: [
            new ValidateRule(SchemasNotifications.__Empty, "__Empty", 204),
          ],
        })
        .build();
    };
  }
  // DELETE /notifications/eventTypes/{eventTypeId}/mute
  // Mute an event type, removing all its link with behavior groups.
  export namespace NotificationServiceMuteEventType {
    const Response200 = z.boolean();
    type Response200 = boolean;
    export interface Params {
      eventTypeId: SchemasNotifications.UUID;
    }

    export type Payload =
      | ValidatedResponse<"unknown", 200, Response200>
      | ValidatedResponse<"unknown", undefined, unknown>;
    export type ActionCreator = Action<Payload, ActionValidatableConfig>;
    export const actionCreator = (params: Params): ActionCreator => {
      const path = "/api/notifications/v1.0/notifications/eventTypes/{eventTypeId}/mute".replace(
        "{eventTypeId}",
        params.eventTypeId.toString()
      );
      const query = {} as Record<string, any>;
      return actionBuilder("DELETE", path)
        .queryParams(query)
        .config({
          rules: [new ValidateRule(Response200, "unknown", 200)],
        })
        .build();
    };
  }
}
