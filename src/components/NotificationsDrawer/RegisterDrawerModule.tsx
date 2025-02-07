import React, { useEffect } from 'react';
import { getSharedScope } from '@scalprum/core';

import useNotificationsDrawer from '../../hooks/useNotificationsDrawer';
import { DrawerContextProvider } from './DrawerContextProvider';
import DrawerPanel from './DrawerPanel';

const RegisterDrawerModule = () => {
    const scope = getSharedScope();
    scope['@notif-module/drawer'] = {
      '1.0.0': {
        loaded: 1,
        get: () => ({
          DrawerPanel: DrawerPanel,
          DrawerContextProvider: DrawerContextProvider,
          useNotificationsDrawer: useNotificationsDrawer,
        }),
      },
    };
  return null;
};

export default RegisterDrawerModule;
