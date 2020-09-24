export interface Notification {
    id: string;
    application: string;
    event: string;
    actions: Array<Action>;
    useDefault?: boolean;
}

export interface DefaultNotificationBehavior {
    actions: Array<Action>;
}

export interface ActionBase {
    type: ActionType;
}

export interface ActionIntegration extends ActionBase {
    type: ActionType.INTEGRATION;
    integrationName: string;
}

export interface ActionNotify extends ActionBase {
    type: ActionType.EMAIL | ActionType.DRAWER | ActionType.PLATFORM_ALERT;
    recipient: Array<string>;
}

export type Action = ActionIntegration | ActionNotify;

export enum ActionType {
    EMAIL = 'EMAIL',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION',
    PLATFORM_ALERT = 'PLATFORM_ALERT'
}
