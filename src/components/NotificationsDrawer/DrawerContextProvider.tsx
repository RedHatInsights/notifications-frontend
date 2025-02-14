import React, { PropsWithChildren, createContext } from 'react';
import { DrawerSingleton } from './DrawerSingleton';
import { getSharedScope } from '@scalprum/core';
import DrawerPanel from './DrawerPanel';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';

const DrawerSingletonContext = createContext(DrawerSingleton.Instance);
const DrawerContextProvider = ({ children }: PropsWithChildren) => {
  const scope = getSharedScope();
  scope['@notif-module/drawer'] = {
    '1.0.0': {
      loaded: 1,
      get: () => ({
        DrawerPanel: DrawerPanel,
        useNotificationDrawer: useNotificationDrawer,
      }),
    },
  };

  return (
    <DrawerSingletonContext.Provider value={DrawerSingleton.Instance}>
      {children}
    </DrawerSingletonContext.Provider>
  );
};

export default DrawerContextProvider;
