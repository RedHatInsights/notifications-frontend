import { Access, AccessApi } from '@redhat-cloud-services/rbac-client';
import axios from 'axios';
import { getDateDaysAgo } from '../UtcDate';

import { getBundleFacets } from '../../api/helpers/notifications/bundle-facets-helper';
import { getDrawerEntries } from '../../api/helpers/notifications/drawer-entries-helper';
import { updateNotificationReadStatus } from '../../api/helpers/notifications/update-read-status-helper';

import {
  FilterConfigItem,
  NotificationData,
  NotificationDrawerState,
  isNotificationData,
} from '../../types/Drawer';

const rbacApi = new AccessApi(undefined, '/api/rbac/v1', axios.create());

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
  hasUnread: false,
  ready: false,
  initializing: false,
};

export class DrawerSingleton {
  private static _instance: DrawerSingleton;
  private static _subs: { id: string; rerenderer: () => void }[];
  private static _state: NotificationDrawerState = initialState;

  static subscribe(rerenderer: () => void) {
    const id = crypto.randomUUID();
    // Run the init procedure if the state is not ready for subscriber
    if (!DrawerSingleton._state.initializing && !DrawerSingleton._state.ready) {
      DrawerSingleton._state.initializing = true;
      rbacApi
        .getPrincipalAccess('notifications', undefined, undefined, 1000)
        .then(({ data: { data } }) => {
          DrawerSingleton.Instance.initialize(true, data);
          DrawerSingleton._state.initializing = false;
          DrawerSingleton._state.ready = true;
          DrawerSingleton._subs.push({ id, rerenderer });
        });
    }
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
    // We can't use hooks here, so we need to use the public chrome API to subscribe to events
    // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
    window.insights.chrome.addWsEventListener(
      'com.redhat.console.notifications.drawer',
      (event) => {
        if (isNotificationData(event.data)) {
          this.addNotification(event.data);
        }
      }
    );
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
      const response = await getBundleFacets({});
      DrawerSingleton._state.filterConfig = response.map((bundle: Bundle) => ({
        title: bundle.displayName,
        value: bundle.name,
      }));

      DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
    } catch (error) {
      console.error('Failed to fetch filter configuration:', error);
    }
  };

  private getNotifications = async () => {
    try {
      const data = await getDrawerEntries({
        limit: 50,
        sort_by: 'read:asc',
        startDate: getDateDaysAgo(7),
      });
      DrawerSingleton._state.notificationData = data.data || [];
      DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();
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
      await updateNotificationReadStatus({
        notification_ids: selected.map((notification) => notification.id),
        read_status: read,
      }).then(() => {
        selected.forEach((notification) =>
          this.updateNotificationRead(notification.id, read)
        );
      });
    } catch (e) {
      console.error('failed to update notification read status', e);
    }
  };

  // helpers
  private hasUnreadNotifications = () => {
    return DrawerSingleton._state.notificationData.some(
      (notification) => !notification.read
    );
  };

  public addNotification = (notification: NotificationData) => {
    DrawerSingleton._state.notificationData.push(notification);
    DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationRead = (id: string, read: boolean) => {
    DrawerSingleton.getState().notificationData =
      DrawerSingleton.getState().notificationData.map((notification) =>
        notification.id === id ? { ...notification, read } : notification
      );
    DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();
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
