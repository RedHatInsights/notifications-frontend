import { getType } from 'typesafe-actions';

import { NotificationAppAction } from '../actions/NotificationAppAction';
import { SavedNotificationScopeActions } from '../actions/SavedNotificationScopeAction';
import { SavedNotificationScopeState, Status } from '../types/SavedNotificationScopeTypes';

export const INITIAL_STATE: SavedNotificationScopeState = null;

export const SavedNotificationScopeReducer = (
    state: SavedNotificationScopeState = INITIAL_STATE,
    action: NotificationAppAction): SavedNotificationScopeState => {
    switch (action.type) {
        case getType(SavedNotificationScopeActions.setIntegration):
            return {
                integration: action.payload,
                status: Status.DONE
            };
        case getType(SavedNotificationScopeActions.start):
            if (!state) {
                return state;
            }

            return {
                ...state,
                status: Status.LOADING
            };
        case getType(SavedNotificationScopeActions.finish):
            if (!state) {
                return state;
            }

            return {
                integration: { ...state.integration, isEnabled: action.payload },
                status: Status.DONE
            };
        case getType(SavedNotificationScopeActions.unset):
            return null;
        default:
            return state;
    }
};
