import { NotificationData } from '../types/NotificationDrawerTypes';

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const UPDATE_NOTIFICATIONS_STATUS = 'UPDATE_NOTIFICATIONS_STATUS';
export const UPDATE_NOTIFICATION_READ = 'UPDATE_NOTIFICATION_READ';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const UPDATE_NOTIFICATION_SELECTED = 'UPDATE_NOTIFICATION_SELECTED';
export const UPDATE_NOTIFICATIONS_SELECTED = 'UPDATE_NOTIFICATIONS_SELECTED';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_HAS_NOTIFICATIONS_PERMISSIONS =
  'SET_HAS_NOTIFICATIONS_PERMISSIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';

export const toggleDrawerAction = () => ({
  type: TOGGLE_DRAWER,
});

export const updateNotificationsStatusAction = (read: boolean) => ({
  type: UPDATE_NOTIFICATIONS_STATUS,
  payload: read,
});

export const updateNotificationReadAction = (id: string, read: boolean) => ({
  type: UPDATE_NOTIFICATION_READ,
  payload: { id, read },
});

export const addNotificationAction = (notification: NotificationData) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const updateNotificationSelectedAction = (
  id: string,
  selected: boolean
) => ({
  type: UPDATE_NOTIFICATION_SELECTED,
  payload: { id, selected },
});

export const updateNotificationsSelectedAction = (selected: boolean) => ({
  type: UPDATE_NOTIFICATIONS_SELECTED,
  payload: selected,
});

export const setFiltersAction = (filters: string[]) => ({
  type: SET_FILTERS,
  payload: filters,
});

export const setHasNotificationsPermissionsAction = (
  hasPermissions: boolean
) => ({
  type: SET_HAS_NOTIFICATIONS_PERMISSIONS,
  payload: hasPermissions,
});

export const setNotificationsAction = (notifications: NotificationData[]) => ({
  type: SET_NOTIFICATIONS,
  payload: notifications,
});
