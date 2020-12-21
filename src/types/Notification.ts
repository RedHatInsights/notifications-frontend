import { Schemas } from '../generated/OpenapiNotifications';
import { UserIntegration } from './Integration';

export interface Notification {
    id: number;
    applicationDisplayName: string;
    eventTypeDisplayName: string;
    actions: Array<Action>;
    useDefault?: boolean;
}

export type IntegrationRef = Pick<UserIntegration, 'id' | 'name' | 'type' | 'isEnabled'>

export interface DefaultNotificationBehavior {
    actions: Array<Action>;
}

export interface ActionBase {
    type: NotificationType;
    integrationId: string;
}

export interface ActionIntegration extends ActionBase {
    type: NotificationType.INTEGRATION;
    integration: IntegrationRef;
}

export interface ActionNotify extends ActionBase {
    type: NotificationType.EMAIL_SUBSCRIPTION | NotificationType.DRAWER | NotificationType.PLATFORM_ALERT;
    recipient: Array<string>;
}

export type Action = ActionIntegration | ActionNotify;

export enum NotificationType {
    EMAIL_SUBSCRIPTION = 'EMAIL_SUBSCRIPTION',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION',
    PLATFORM_ALERT = 'PLATFORM_ALERT'
}

export type ServerNotificationRequest = Schemas.EventType;
export type ServerNotificationResponse = Schemas.EventType;
