import { NotificationAppState } from '../types/NotificationAppState';
import { SavedNotificationScopeState } from '../types/SavedNotificationScopeTypes';

export const savedNotificationScopeSelector = (state: NotificationAppState): SavedNotificationScopeState => state.savedNotificationScope;

export const savedNotificationScopeEqualFn = (left: SavedNotificationScopeState, right: SavedNotificationScopeState): boolean => {
    return left?.integration === right?.integration && left?.status === right?.status;
};
