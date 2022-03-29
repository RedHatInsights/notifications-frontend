import { Schemas } from '../generated/OpenapiNotifications';
import { UserIntegration } from './Integration';
import { BaseNotificationRecipient } from './Recipient';

export type UUID = Schemas.UUID;

export interface NotificationBase {
    id: UUID;
    applicationDisplayName: string;
    eventTypeDisplayName: string;
}

export interface Notification extends NotificationBase {
    actions?: Array<Action>;
    useDefault?: boolean;
}

export interface NotificationBehaviorGroup extends NotificationBase {
    readonly behaviors: ReadonlyArray<BehaviorGroup>;
}

export type IntegrationRef = Pick<UserIntegration, 'id' | 'name' | 'type' | 'isEnabled'>

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
    action.type === NotificationType.EMAIL_SUBSCRIPTION || action.type === NotificationType.DRAWER;

export const isActionIntegration = (action: Action): action is ActionIntegration =>
    action.type === NotificationType.INTEGRATION;

export enum NotificationType {
    EMAIL_SUBSCRIPTION = 'EMAIL_SUBSCRIPTION',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION'
}

export type Facet = Schemas.Facet;

export type ServerNotificationRequest = Schemas.EventType;
export type ServerNotificationResponse = Schemas.EventType;

export type BehaviorGroup = {
    readonly id: UUID;
    readonly actions: ReadonlyArray<Action>;
    readonly bundleId: UUID,
    readonly displayName: string;
    readonly bundleName: string;
    readonly isDefault: boolean;
}

export type NewBehaviorGroup = Partial<Pick<BehaviorGroup, 'id'>> & Omit<BehaviorGroup, 'id'>;

export type BehaviorGroupRequest = Omit<BehaviorGroup | NewBehaviorGroup, 'isDefault'>;

export type EmailSystemProperties = {
    type: NotificationType.EMAIL_SUBSCRIPTION;
    props: {
        onlyAdmins: boolean;
        ignorePreferences: false;
        groupId: undefined | UUID;
    }
}
export type SystemProperties = EmailSystemProperties;
