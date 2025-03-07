import { getSharedScope } from '@scalprum/core';
import DrawerPanel from './DrawerPanel';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';
import { DrawerSingleton } from './DrawerSingleton';

/**
 * @deprecated The subscribe method checks if the state was initialized and if not, it will run the init method.
 */
function initNotificationScope() {
  const scope = getSharedScope();
  console.error(
    'This module is deprecated and will be removed in the future! Notification state is initialized if a subscription request is detected.'
  );
  scope['@notif-module/drawer'] = {
    '1.0.0': {
      loaded: 1,
      get: () => ({
        DrawerPanel,
        useNotificationDrawer,
        initialize: DrawerSingleton.Instance.initialize,
        getState: DrawerSingleton.getState,
      }),
    },
  };
}

export default initNotificationScope;
