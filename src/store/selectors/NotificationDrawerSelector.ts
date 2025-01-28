import { NotificationDrawerState } from '../types/NotificationDrawerTypes';

export const notificationDrawerSelector = (state: NotificationDrawerState) => ({
  notifications: state.notificationData,
  activeFilters: state.filters,
  filterConfig: state.filterConfig,
  selectedNotifications: state.notificationData.filter(
    ({ selected }) => selected
  ),
  hasNotificationsPermissions: state.hasNotificationsPermissions,
});
