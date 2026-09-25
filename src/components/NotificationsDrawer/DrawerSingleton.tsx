import { ChromeAPI } from '@redhat-cloud-services/types';
import { getDateDaysAgo } from '../UtcDate';

import { getBundleFacets } from '../../api/helpers/notifications/bundle-facets-helper';
import { getDrawerEntries } from '../../api/helpers/notifications/drawer-entries-helper';
import { updateNotificationReadStatus } from '../../api/helpers/notifications/update-read-status-helper';
import { ensureUtcTimestamp } from '../../utils/dateUtils';

import {
  FilterConfigItem,
  NotificationData,
  NotificationDrawerState,
  isNotificationData,
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
  bundleIdToNameMap: new Map(),
  hasNotificationsPermissions: false,
  hasUnread: false,
  ready: false,
  initializing: false,
};

export class DrawerSingleton {
  private static _instance: DrawerSingleton;
  private static _subs: { id: string; rerenderer: () => void }[] = [];
  private static _state: NotificationDrawerState = initialState;
  private static _unregisterWsListener?: () => void;

  static subscribe(rerenderer: () => void, addWsEventListener?: ChromeAPI['addWsEventListener']) {
    const id = crypto.randomUUID();
    DrawerSingleton._subs.push({ id, rerenderer });
    // Run the init procedure if the state is not ready for subscriber
    if (!DrawerSingleton._state.initializing && !DrawerSingleton._state.ready) {
      DrawerSingleton._state.initializing = true;
      DrawerSingleton.Instance.initialize(true, addWsEventListener)
        .then(() => {
          DrawerSingleton._state.ready = true;
        })
        .catch((error) => {
          console.error('Failed to initialize notification drawer:', error);
        })
        .finally(() => {
          DrawerSingleton._state.initializing = false;
          DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
        });
    }
    return id;
  }
  static unsubscribe(id: string) {
    DrawerSingleton._subs = DrawerSingleton._subs.filter((item) => item.id !== id);
  }

  private constructor() {}
  public static get Instance() {
    if (!DrawerSingleton._instance) {
      DrawerSingleton._instance = new DrawerSingleton();
    }

    return DrawerSingleton._instance;
  }

  public initialize = async (
    mounted: boolean,
    addWsEventListener?: ChromeAPI['addWsEventListener']
  ) => {
    await this.fetchFilterConfig(mounted);
    await this.getNotifications();
    if (addWsEventListener) {
      // initialize is public, so guard against stacking listeners if it is called again
      DrawerSingleton._unregisterWsListener?.();
      DrawerSingleton._unregisterWsListener = addWsEventListener(
        'com.redhat.console.notifications.drawer',
        (event) => {
          if (isNotificationData(event.data)) {
            // Normalize timestamp: backend sends LocalDateTime without 'Z' suffix
            const normalizedNotification = {
              ...event.data,
              created: ensureUtcTimestamp(event.data.created),
            };
            this.addNotification(normalizedNotification);
          }
        }
      );
    } else {
      console.warn('WebSocket event listener not available - live notifications disabled');
    }
  };

  public static getState() {
    return DrawerSingleton._state;
  }

  private fetchFilterConfig = async (mounted: boolean) => {
    if (!mounted) {
      return;
    }
    try {
      const response = await getBundleFacets({});

      // Build mapping from bundle ID (UUID) to bundle name for client-side filtering
      const bundleIdToNameMap = new Map<string, string>();

      // Filter out lightwell bundle and build filter config with UUIDs
      DrawerSingleton._state.filterConfig = response
        .filter((bundle: Bundle) => bundle.name !== 'lightwell')
        .map((bundle: Bundle) => {
          if (bundle.id) {
            bundleIdToNameMap.set(bundle.id, bundle.name);
          }
          return {
            title: bundle.displayName,
            value: bundle.id || bundle.name, // Use ID (UUID) for API filtering
          };
        });

      DrawerSingleton._state.bundleIdToNameMap = bundleIdToNameMap;

      DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
    } catch (error) {
      console.error('Failed to fetch filter configuration:', error);
    }
  };

  private getNotifications = async (bundleIds?: string[]) => {
    try {
      const params: {
        limit: number;
        sort_by: string;
        startDate: string;
        bundleIds?: Set<string>;
      } = {
        limit: 50,
        sort_by: 'read:asc',
        startDate: getDateDaysAgo(7),
      };

      // Add bundle filter if provided
      // API client expects Set<string>, not string[]
      if (bundleIds && bundleIds.length > 0) {
        params.bundleIds = new Set(bundleIds);
      }

      const data = await getDrawerEntries(params);
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
        const selectedIds = new Set(selected.map((n) => n.id));
        DrawerSingleton._state.notificationData = DrawerSingleton._state.notificationData.map(
          (notification) =>
            selectedIds.has(notification.id)
              ? { ...notification, read, selected: false }
              : notification
        );
        DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();

        DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
      });
    } catch (e) {
      console.error('failed to update notification read status', e);
    }
  };

  // helpers
  private hasUnreadNotifications = () => {
    const hasUnread = DrawerSingleton._state.notificationData.some(
      (notification) => !notification.read
    );
    return hasUnread;
  };

  public addNotification = (notification: NotificationData) => {
    const isDuplicate = DrawerSingleton._state.notificationData.some(
      (item) => item.id === notification.id
    );
    if (isDuplicate) {
      return;
    }

    // Reassign rather than push: consumers memoize on the array reference, so an in-place
    // mutation leaves derived lists such as filteredNotifications stale
    DrawerSingleton._state.notificationData = [
      ...DrawerSingleton._state.notificationData,
      notification,
    ];
    DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationRead = (id: string, read: boolean) => {
    DrawerSingleton.getState().notificationData = DrawerSingleton.getState().notificationData.map(
      (notification) => (notification.id === id ? { ...notification, read } : notification)
    );
    DrawerSingleton._state.hasUnread = this.hasUnreadNotifications();

    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationsSelected = (selected: boolean) => {
    DrawerSingleton.getState().notificationData = DrawerSingleton.getState().notificationData.map(
      (notification) => ({
        ...notification,
        selected,
      })
    );
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public updateNotificationSelected = (id: string, selected: boolean) => {
    DrawerSingleton.getState().notificationData = DrawerSingleton.getState().notificationData.map(
      (notification) => (notification.id === id ? { ...notification, selected } : notification)
    );
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());
  };
  public setFilters = async (filters: string[]) => {
    DrawerSingleton.getState().filters = filters;

    // Trigger immediate re-render to update UI (checkboxes, etc.)
    DrawerSingleton._subs.forEach((sub) => sub.rerenderer());

    // Re-fetch notifications from backend with the new filter
    // Pass filters as bundleIds parameter
    await this.getNotifications(filters.length > 0 ? filters : undefined);
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
