import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Access } from '@redhat-cloud-services/rbac-client';

import { getDateDaysAgo } from './components/UtcDate';

import {
  setFilterConfigAction,
  setHasNotificationsPermissionsAction,
  setNotificationsAction,
} from './store/actions/NotificationDrawerAction';
import { NotificationData } from './store/types/NotificationDrawerTypes';

interface Bundle {
  id: string;
  name: string;
  displayName: string;
  children: Bundle[];
}

/* Singleton to fetch and populate notifications data from chrome */
export class DrawerSingleton {
  private static _instance: DrawerSingleton;
  private constructor() {
    // To stop direct instantiation, thanks Google
  }

  public static get Instance() {
    if (!DrawerSingleton._instance) {
      DrawerSingleton._instance = new DrawerSingleton();
    }

    return DrawerSingleton._instance;
  }

  // initialize function calls the three functions below
  private initialize = async (mounted: boolean, permissions) => {
    this.fetchFilterConfig(mounted);
    this.getNotifications();
    this.readNotificationsPermissions(mounted, permissions);
  };

  public readNotificationsPermissions = async (
    mounted: boolean,
    permissions
  ) => {
    if (mounted) {
      const dispatch = useDispatch();
      dispatch(
        setHasNotificationsPermissionsAction(
          permissions?.some((item) =>
            [
              'notifications:*:*',
              'notifications:notifications:read',
              'notifications:notifications:write',
            ].includes((typeof item === 'string' && item) || item?.permission)
          )
        )
      );
    }
  };

  public fetchFilterConfig = async (mounted: boolean) => {
    if (!mounted) {
      return;
    }
    try {
      const response = await axios.get<Bundle[]>(
        '/api/notifications/v1/notifications/facets/bundles'
      );
      const dispatch = useDispatch();
      dispatch(
        setFilterConfigAction(
          response.data.map((bundle: Bundle) => ({
            title: bundle.displayName,
            value: bundle.name,
          }))
        )
      );
    } catch (error) {
      console.error('Failed to fetch filter configuration:', error);
    }
  };

  public getNotifications = async () => {
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
      const dispatch = useDispatch();
      dispatch(setNotificationsAction(data?.data || []));
    } catch (error) {
      console.error('Unable to get Notifications ', error);
    }
  };

  // need to not export this directly...
  public static DrawerSingletonInitializer = class {
    public static initialize(mounted: boolean, permissions: Access[]) {
      DrawerSingleton.Instance.initialize(mounted, permissions);
    }
  };
}
