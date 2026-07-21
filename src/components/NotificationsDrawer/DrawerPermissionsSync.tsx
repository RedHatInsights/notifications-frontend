import { useEffect } from 'react';

import { useV2HasNotificationsPermissions } from '../../hooks/useHasNotificationsPermissions';
import { DrawerSingleton } from './DrawerSingleton';

const DrawerPermissionsSync = () => {
  const hasPermissions = useV2HasNotificationsPermissions();

  useEffect(() => {
    if (hasPermissions !== undefined) {
      DrawerSingleton.Instance.setHasNotificationsPermissions(hasPermissions);
    }
  }, [hasPermissions]);

  return null;
};

export default DrawerPermissionsSync;
