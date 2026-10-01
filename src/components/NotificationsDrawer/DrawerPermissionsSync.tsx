import { useFlag } from '@unleash/proxy-client-react';
import React, { useEffect } from 'react';

import {
  NotificationsPermissions,
  useV1HasNotificationsPermissions,
  useV2HasNotificationsPermissions,
} from '../../hooks/useHasNotificationsPermissions';
import { DrawerSingleton } from './DrawerSingleton';

const useSyncPermissions = ({ hasPermissions, isAdmin }: NotificationsPermissions) => {
  useEffect(() => {
    if (hasPermissions !== undefined) {
      DrawerSingleton.Instance.setHasNotificationsPermissions(hasPermissions);
    }
  }, [hasPermissions]);

  // Unlike hasPermissions, the pending `undefined` is synced through: the bell needs it to tell
  // an unresolved check apart from a denial
  useEffect(() => {
    DrawerSingleton.Instance.setIsNotificationsAdmin(isAdmin);
  }, [isAdmin]);
};

const V1PermissionsSync = () => {
  useSyncPermissions(useV1HasNotificationsPermissions());
  return null;
};

const V2PermissionsSync = () => {
  useSyncPermissions(useV2HasNotificationsPermissions());
  return null;
};

const DrawerPermissionsSync = () => {
  const isKesselEnabled = useFlag('platform.chrome.kessel');
  return isKesselEnabled ? <V2PermissionsSync /> : <V1PermissionsSync />;
};

export default DrawerPermissionsSync;
