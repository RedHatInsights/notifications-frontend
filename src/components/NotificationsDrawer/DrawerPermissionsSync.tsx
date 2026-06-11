import { useFlag } from '@unleash/proxy-client-react';
import React, { useEffect } from 'react';

import {
  useV1HasNotificationsPermissions,
  useV2HasNotificationsPermissions,
} from '../../hooks/useHasNotificationsPermissions';
import { DrawerSingleton } from './DrawerSingleton';

type UsePermissionsHook = () => boolean | undefined;

const PermissionsSyncBranch = ({ usePermissions }: { usePermissions: UsePermissionsHook }) => {
  const hasPermissions = usePermissions();

  useEffect(() => {
    if (hasPermissions !== undefined) {
      DrawerSingleton.Instance.setHasNotificationsPermissions(hasPermissions);
    }
  }, [hasPermissions]);

  return null;
};

const DrawerPermissionsSync = () => {
  const isV2Org = useFlag('platform.rbac.workspaces');

  return (
    <PermissionsSyncBranch
      usePermissions={isV2Org ? useV2HasNotificationsPermissions : useV1HasNotificationsPermissions}
    />
  );
};

export default DrawerPermissionsSync;
