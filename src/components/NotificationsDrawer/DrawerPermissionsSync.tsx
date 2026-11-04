import { useFlag } from '@unleash/proxy-client-react';
import React, { useContext, useEffect } from 'react';

import {
  useV1HasNotificationsPermissions,
  useV2HasNotificationsPermissions,
} from '../../hooks/useHasNotificationsPermissions';
import { KesselRbacAccessContext } from '../../app/rbac/KesselRbacAccessContext';
import { DrawerSingleton } from './DrawerSingleton';

const useSyncPermissions = (hasPermissions: boolean | undefined) => {
  useEffect(() => {
    if (hasPermissions !== undefined) {
      DrawerSingleton.Instance.setHasNotificationsPermissions(hasPermissions);
    }
  }, [hasPermissions]);
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
  // This component is also mounted as a federated module in other apps, where
  // KesselRbacAccessProvider is not available — fall back to the env-level flag there.
  const kesselRbacContext = useContext(KesselRbacAccessContext);
  const envFlagFallback = useFlag('platform.chrome.kessel');
  const isOrgV2 = kesselRbacContext ? kesselRbacContext.isOrgV2 : envFlagFallback;

  // Hold off until org v1/v2 detection has settled
  if (isOrgV2 === undefined) {
    return null;
  }

  return isOrgV2 ? <V2PermissionsSync /> : <V1PermissionsSync />;
};

export default DrawerPermissionsSync;
