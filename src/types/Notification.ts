import { Schemas } from '../generated/OpenapiNotifications';
import { UserIntegration } from './Integration';
import { BaseNotificationRecipient } from './Recipient';

export type UUID = Schemas.UUID;

export interface EventType {
  id: UUID;
  applicationDisplayName: string;
  eventTypeDisplayName: string;
}

export interface Notification extends EventType {
  actions?: Array<Action>;
  useDefault?: boolean;
}

export interface NotificationBehaviorGroup extends EventType {
  readonly behaviors: ReadonlyArray<BehaviorGroup>;
}

export type IntegrationRef = Pick<
  UserIntegration,
  'id' | 'name' | 'type' | 'isEnabled'
>;

export interface DefaultNotificationBehavior {
  actions: Array<Action>;
}

export interface ActionBase {
  type: NotificationType;
}

export interface ActionIntegration extends ActionBase {
  type: NotificationType.INTEGRATION;
  integration: IntegrationRef;
}

export interface ActionNotify extends ActionBase {
  type: NotificationType.EMAIL_SUBSCRIPTION | NotificationType.DRAWER;
  recipient: ReadonlyArray<BaseNotificationRecipient>;
}

export type Action = ActionIntegration | ActionNotify;

export const isActionNotify = (action: Action): action is ActionNotify =>
  action.type === NotificationType.EMAIL_SUBSCRIPTION ||
  action.type === NotificationType.DRAWER;

export const isActionIntegration = (
  action: Action
): action is ActionIntegration => action.type === NotificationType.INTEGRATION;

export enum NotificationType {
  EMAIL_SUBSCRIPTION = 'EMAIL_SUBSCRIPTION',
  DRAWER = 'DRAWER',
  INTEGRATION = 'INTEGRATION',
}

export type Facet = Schemas.Facet;

export type LocalTime = Schemas.LocalTime;

export type ServerNotificationRequest = Schemas.EventType;
export type ServerNotificationResponse = Schemas.EventType;

export type BehaviorGroup = {
  readonly id: UUID;
  readonly actions: ReadonlyArray<Action>;
  readonly events: ReadonlyArray<EventType>;
  readonly bundleId: UUID;
  readonly displayName: string;
  readonly bundleName?: string;
  readonly isDefault: boolean;
};

export type NewBehaviorGroup = Partial<Pick<BehaviorGroup, 'id'>> &
  Omit<BehaviorGroup, 'id'>;

export type BehaviorGroupRequest = Omit<
  BehaviorGroup | NewBehaviorGroup,
  'isDefault'
>;

export type EmailSystemProperties = {
  type: NotificationType.EMAIL_SUBSCRIPTION;
  props: {
    onlyAdmins: boolean;
    ignorePreferences: false;
    groupId: undefined | UUID;
  };
};
export type DrawerSystemProperties = {
  type: NotificationType.DRAWER;
  props: {
    onlyAdmins: boolean;
    groupId: undefined | UUID;
    ignorePreferences: false;
  };
};

export type SystemProperties = EmailSystemProperties | DrawerSystemProperties;

export function isEmailSystemProperties(
  properties: SystemProperties
): properties is EmailSystemProperties {
  return properties.type === NotificationType.EMAIL_SUBSCRIPTION;
}

export function isDrawerSystemProperties(
  properties: SystemProperties
): properties is DrawerSystemProperties {
  return properties.type === NotificationType.DRAWER;
}

const getIntegrationIds = (
  actions: ReadonlyArray<Action | undefined>
): Array<UUID | undefined> => {
  return actions
    .map((action) => {
      if (action === undefined) {
        return [undefined];
      }

      if (action.type === NotificationType.INTEGRATION) {
        return [action.integration.id];
      } else {
        return action.recipient.map((r) => r.integrationId);
      }
    })
    .flat();
};

export const areActionsEqual = (
  actions1: ReadonlyArray<Action | undefined>,
  actions2: ReadonlyArray<Action | undefined>
): boolean => {
  if (actions1.length !== actions2.length) {
    return false;
  }

  const integrations1 = getIntegrationIds(actions1);
  const integrations2 = getIntegrationIds(actions2);

  if (integrations1.length !== integrations2.length) {
    return false;
  }

  // Order matters here, no sorting.
  return integrations1.every((val, index) => val === integrations2[index]);
};
