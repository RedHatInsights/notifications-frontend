import { useEffect, useReducer } from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { DrawerSingleton } from '../components/NotificationsDrawer/DrawerSingleton';

const useNotificationDrawer = () => {
  const { addWsEventListener } = useChrome();
  const [state, rerender] = useReducer(
    () => ({ ...DrawerSingleton.getState() }),
    DrawerSingleton.getState()
  ); // rename to dispatch
  // rerenderer

  useEffect(() => {
    const subsId = DrawerSingleton.subscribe(rerender, addWsEventListener);
    return () => {
      DrawerSingleton.unsubscribe(subsId);
    };
  }, [addWsEventListener]);

  return {
    state,
    initialize: DrawerSingleton.Instance.initialize,
    addNotification: DrawerSingleton.Instance.addNotification,
    updateNotificationRead: DrawerSingleton.Instance.updateNotificationRead,
    updateSelectedStatus: DrawerSingleton.Instance.updateSelectedStatus,
    updateNotificationsSelected: DrawerSingleton.Instance.updateNotificationsSelected,
    updateNotificationSelected: DrawerSingleton.Instance.updateNotificationSelected,
    setFilters: DrawerSingleton.Instance.setFilters,
    setHasNotificationsPermissions: DrawerSingleton.Instance.setHasNotificationsPermissions,
    setFilterConfig: DrawerSingleton.Instance.setFilterConfig,
  };
};

export default useNotificationDrawer;
