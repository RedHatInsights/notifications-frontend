import { Schemas } from '../generated/OpenapiNotifications';
import { UserIntegration } from './Integration';

export type UUID = Schemas.UUID;

export interface Notification {
    id: UUID;
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
    integrationId: UUID;
}

export interface ActionIntegration extends ActionBase {
    type: NotificationType.INTEGRATION;
    integration: IntegrationRef;
}

export interface ActionNotify extends ActionBase {
    type: NotificationType.EMAIL_SUBSCRIPTION | NotificationType.DRAWER;
    recipient: Array<string>;
}

export type Action = ActionIntegration | ActionNotify;

export enum NotificationType {
    EMAIL_SUBSCRIPTION = 'EMAIL_SUBSCRIPTION',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION'
}

export type Facet = Schemas.Facet;

export type ServerNotificationRequest = Schemas.EventType;
export type ServerNotificationResponse = Schemas.EventType;
