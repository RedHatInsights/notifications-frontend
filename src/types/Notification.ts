import * as Generated from '../generated/Openapi';
import { Integration } from './Integration';

export interface Notification {
    id: string;
    application: string;
    event: string;
    actions: Array<Action>;
    useDefault?: boolean;
}

export type IntegrationRef = Pick<Integration, 'id' | 'name' | 'type'>

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
    type: NotificationType.EMAIL | NotificationType.DRAWER | NotificationType.PLATFORM_ALERT;
    recipient: Array<string>;
}

export type Action = ActionIntegration | ActionNotify;

export enum NotificationType {
    EMAIL = 'EMAIL',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION',
    PLATFORM_ALERT = 'PLATFORM_ALERT'
}

export type ServerNotificationRequest = Generated.EventType;
export type ServerNotificationResponse = Generated.EventType;
