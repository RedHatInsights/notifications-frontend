export interface Notification {
    id: string;
    application: string;
    event: string;
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
    type: ActionType.EMAIL | ActionType.DRAWER;
    recipient: Array<string>;
}

export type Action = ActionIntegration | ActionNotify;

export enum ActionType {
    EMAIL = 'EMAIL',
    DRAWER = 'DRAWER',
    INTEGRATION = 'INTEGRATION'
}
