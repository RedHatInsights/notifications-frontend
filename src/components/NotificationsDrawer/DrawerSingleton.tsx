import axios from 'axios';
import { Access } from '@redhat-cloud-services/rbac-client';

import { getDateDaysAgo } from '../UtcDate';

import {
  FilterConfigItem,
  NotificationData,
  NotificationDrawerState,
} from '../../types/Drawer';

interface Bundle {
  id: string;
  name: string;
  displayName: string;
  children: Bundle[];
}

const initialState: NotificationDrawerState = {
  notificationData: [],
  count: 0,
  filters: [],
  filterConfig: [],
  hasNotificationsPermissions: false,
};

export class DrawerSingleton {
  private static _instance: DrawerSingleton;
  private static _subs: { id: string; rerenderer: () => void }[];
  private static _state: NotificationDrawerState = initialState;
  static subscribe(rerenderer: () => void) {
    const id = crypto.randomUUID();
    DrawerSingleton._subs.push({ id, rerenderer });
    return id;
  }
  static unsubscribe(id: string) {
    DrawerSingleton._subs = DrawerSingleton._subs.filter(
      (item) => item.id !== id
    );
  }

  private constructor() {}
  public static get Instance() {
    if (!DrawerSingleton._instance) {
      DrawerSingleton._instance = new DrawerSingleton();
      DrawerSingleton._subs = [];
    }

    return DrawerSingleton._instance;
  }

  // initialize function calls the three functions below
  public initialize = async (mounted: boolean, permissions: Access[]) => {
    await this.fetchFilterConfig(mounted);
    await this.getNotifications();
    await this.setNotificationsPermissions(mounted, permissions);
  };

  public static getState() {
    return DrawerSingleton._state;
  }

  private setNotificationsPermissions = async (
    mounted: boolean,
    permissions
  ) => {
    if (mounted) {
      DrawerSingleton._state.hasNotificationsPermissions =
        permissions?.some((item) =>
          [
            'notifications:*:*',
            'notifications:notifications:read',
            'notifications:notifications:write',
          ].includes((typeof item === 'string' && item) || item?.permission)
        ) || false;
      DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
    }
  };

  private fetchFilterConfig = async (mounted: boolean) => {
    if (!mounted) {
      return;
    }
    try {
      const response = await axios.get<Bundle[]>(
        '/api/notifications/v1/notifications/facets/bundles'
      );
      DrawerSingleton._state.filterConfig = response.data.map(
        (bundle: Bundle) => ({
          title: bundle.displayName,
          value: bundle.name,
        })
      );

      DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
    } catch (error) {
      console.error('Failed to fetch filter configuration:', error);
    }
  };

  private getNotifications = async () => {
    try {
      const { data } = await axios.get<{ data: NotificationData[] }>(
        `/api/notifications/v1/notifications/drawer`,
        {
          params: {
            limit: 50,
            sort_by: 'read:asc',
            startDate: getDateDaysAgo(7),
          },
        }
      );
      DrawerSingleton._state.notificationData = data.data || [];
      DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
    } catch (error) {
      console.error('Unable to get Notifications ', error);
    }
  };

  public updateSelectedStatus = async (read: boolean) => {
    try {
      const selected = DrawerSingleton._state.notificationData.filter(
        (notification) => notification.selected
      );
      axios
        .put('/api/notifications/v1/notifications/drawer/read', {
          notification_ids: selected.map((notification) => notification.id),
          read_status: read,
        })
        .then(() => {
          selected.forEach((notification) =>
            this.updateNotificationRead(notification.id, read)
          );
        });
    } catch (e) {
      console.error('failed to update notification read status', e);
    }
  };

  // helpers
  public hasUnreadNotifications = () => {
    return DrawerSingleton._state.notificationData.some(
      (notification) => !notification.read
    );
  };

  public addNotification = (notification: NotificationData) => {
    DrawerSingleton._state.notificationData.push(notification);
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationRead = (id: string, read: boolean) => {
    DrawerSingleton.getState().notificationData =
      DrawerSingleton.getState().notificationData.map((notification) =>
        notification.id === id ? { ...notification, read } : notification
      );
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationsSelected = (selected: boolean) => {
    DrawerSingleton.getState().notificationData =
      DrawerSingleton.getState().notificationData.map((notification) => ({
        ...notification,
        selected,
      }));
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationSelected = (id: string, selected: boolean) => {
    DrawerSingleton.getState().notificationData =
      DrawerSingleton.getState().notificationData.map((notification) =>
        notification.id === id ? { ...notification, selected } : notification
      );
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public setFilters = (filters: string[]) => {
    DrawerSingleton.getState().filters = filters;
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public setHasNotificationsPermissions = (hasPermissions: boolean) => {
    DrawerSingleton.getState().hasNotificationsPermissions = hasPermissions;
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public setFilterConfig = (filterConfig: FilterConfigItem[]) => {
    DrawerSingleton.getState().filterConfig = filterConfig;
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
}
