import { getSharedScope } from '@scalprum/core';
import DrawerPanel from './DrawerPanel';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';
import { DrawerSingleton } from './DrawerSingleton';

function initNotificationScope() {
  const scope = getSharedScope();
  scope['@notif-module/drawer'] = {
    '1.0.0': {
      loaded: 1,
      get: () => ({
        DrawerPanel,
        useNotificationDrawer,
        initialize: DrawerSingleton.Instance.initialize,
        getState: DrawerSingleton.getState(),
      }),
    },
  };
}

export default initNotificationScope;
