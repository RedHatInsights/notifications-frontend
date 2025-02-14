import { useEffect, useReducer } from 'react';

import { DrawerSingleton } from '../components/NotificationsDrawer/DrawerSingleton';

const useNotificationDrawer = () => {
  const [state, rerender] = useReducer(
    () => ({ ...DrawerSingleton.getState() }),
    DrawerSingleton.getState()
  ); // rename to dispatch
  // rerenderer

  useEffect(() => {
    const subsId = DrawerSingleton.subscribe(rerender);
    return () => {
      DrawerSingleton.unsubscribe(subsId);
    };
  }, []);

  return {
    state,
    initialize: DrawerSingleton.Instance.initialize,
    addNotification: DrawerSingleton.Instance.addNotification,
    hasUnreadNotifications: DrawerSingleton.Instance.hasUnreadNotifications,
    updateNotificationRead: DrawerSingleton.Instance.updateNotificationRead,
    updateSelectedStatus: DrawerSingleton.Instance.updateSelectedStatus,
    updateNotificationsSelected:
      DrawerSingleton.Instance.updateNotificationsSelected,
    updateNotificationSelected:
      DrawerSingleton.Instance.updateNotificationSelected,
    setFilters: DrawerSingleton.Instance.setFilters,
    setHasNotificationsPermissions:
      DrawerSingleton.Instance.setHasNotificationsPermissions,
    setFilterConfig: DrawerSingleton.Instance.setFilterConfig,
  };
};

export default useNotificationDrawer;
