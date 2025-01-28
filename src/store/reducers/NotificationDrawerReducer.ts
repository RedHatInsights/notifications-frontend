import {
  ADD_NOTIFICATION,
  SET_FILTERS,
  SET_FILTER_CONFIG,
  SET_HAS_NOTIFICATIONS_PERMISSIONS,
  SET_NOTIFICATIONS,
  TOGGLE_DRAWER,
  UPDATE_NOTIFICATIONS_SELECTED,
  UPDATE_NOTIFICATIONS_STATUS,
  UPDATE_NOTIFICATION_READ,
  UPDATE_NOTIFICATION_SELECTED,
} from '../actions/NotificationDrawerAction';

import { NotificationDrawerState } from '../types/NotificationDrawerTypes';

const initialState: NotificationDrawerState = {
  isDrawerOpen: false,
  notificationData: [],
  count: 0,
  filters: [],
  filterConfig: [],
  hasNotificationsPermissions: false,
};

export const NotificationDrawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen,
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notificationData],
      };
    case UPDATE_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notificationData.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, read: action.payload.read }
            : notification
        ),
      };
    case UPDATE_NOTIFICATIONS_STATUS:
      return {
        ...state,
        notifications: state.notificationData.map((notification) => ({
          ...notification,
          read: action.payload,
        })),
      };
    case UPDATE_NOTIFICATION_SELECTED:
      return {
        ...state,
        notifications: state.notificationData.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, selected: action.payload.selected }
            : notification
        ),
      };
    case UPDATE_NOTIFICATIONS_SELECTED:
      return {
        ...state,
        notifications: state.notificationData.map((notification) => ({
          ...notification,
          selected: action.payload,
        })),
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };
    case SET_HAS_NOTIFICATIONS_PERMISSIONS:
      return {
        ...state,
        hasNotificationsPermissions: action.payload,
      };
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notificationData: action.payload,
        count: action.payload.length,
      };
    case SET_FILTER_CONFIG:
      return {
        ...state,
        filterConfig: action.payload,
      };
    default:
      return state;
  }
};

export { initialState as drawerInitialState };
