import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useEffect, useState } from 'react';

import { useKesselRbacAccess } from '../app/rbac/KesselRbacAccessContext';
import { hasV1DrawerNotificationsPermissions } from '../components/NotificationsDrawer/drawerNotificationsPermissions';

export const useV1HasNotificationsPermissions = (): boolean | undefined => {
  const chrome = useChrome();
  const [hasPermissions, setHasPermissions] = useState<boolean | undefined>();

  useEffect(() => {
    chrome
      .getUserPermissions('notifications')
      .then((permissions) => {
        setHasPermissions(hasV1DrawerNotificationsPermissions(permissions));
      })
      .catch(() => {
        setHasPermissions(false);
      });
  }, [chrome]);

  return hasPermissions;
};

export const useV2HasNotificationsPermissions = (): boolean | undefined => {
  const { permissions, isLoading, workspaceId } = useKesselRbacAccess();
  console.log('DEBUG permissions', permissions);

  if (isLoading) {
    return undefined;
  }

  if (!workspaceId) {
    return false;
  }

  return permissions.canViewNotifications || permissions.canEditNotifications;
};
