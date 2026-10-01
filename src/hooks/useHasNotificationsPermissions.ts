import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useEffect, useState } from 'react';

import { useKesselRbacAccess } from '../app/rbac/KesselRbacAccessContext';
import {
  hasV1DrawerNotificationsAdminPermissions,
  hasV1DrawerNotificationsPermissions,
} from '../components/NotificationsDrawer/drawerNotificationsPermissions';

// `undefined` means the check has not resolved yet, which callers need to tell apart from a
// denial so they do not briefly render the UI they would show a user who lacks access
export interface NotificationsPermissions {
  hasPermissions: boolean | undefined;
  isAdmin: boolean | undefined;
}

const PENDING: NotificationsPermissions = { hasPermissions: undefined, isAdmin: undefined };
const DENIED: NotificationsPermissions = { hasPermissions: false, isAdmin: false };

export const useV1HasNotificationsPermissions = (): NotificationsPermissions => {
  const chrome = useChrome();
  const [permissions, setPermissions] = useState<NotificationsPermissions>(PENDING);

  useEffect(() => {
    chrome
      .getUserPermissions('notifications')
      // Both answers come out of one lookup rather than one call per question
      .then((granted) => {
        setPermissions({
          hasPermissions: hasV1DrawerNotificationsPermissions(granted),
          isAdmin: hasV1DrawerNotificationsAdminPermissions(granted),
        });
      })
      .catch(() => {
        setPermissions(DENIED);
      });
  }, [chrome]);

  return permissions;
};

export const useV2HasNotificationsPermissions = (): NotificationsPermissions => {
  const { permissions, isLoading, workspaceId } = useKesselRbacAccess();

  if (isLoading) {
    return PENDING;
  }

  if (!workspaceId) {
    return DENIED;
  }

  return {
    hasPermissions: permissions.canViewNotifications || permissions.canEditNotifications,
    // Kessel's edit relation is the v2 equivalent of the v1 write permission
    isAdmin: permissions.canEditNotifications,
  };
};
