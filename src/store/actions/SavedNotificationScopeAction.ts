import { ActionType, createAction } from 'typesafe-actions';
import { IntegrationRef } from '../../types/Notification';

export enum SavedNotificationScopeKeys {
    SET_INTEGRATION = 'SET_INTEGRATION',
    START = 'START',
    FINISH = 'FINISH',
    UNSET = 'UNSET'
}

export const SavedNotificationScopeActions = {
    setIntegration: createAction(SavedNotificationScopeKeys.SET_INTEGRATION)<IntegrationRef>(),
    start: createAction(SavedNotificationScopeKeys.START)(),
    finish: createAction(SavedNotificationScopeKeys.FINISH)<boolean>(),
    unset: createAction(SavedNotificationScopeKeys.UNSET)()
};

export type SavedNotificationScopeAction = ActionType<typeof SavedNotificationScopeActions>;
