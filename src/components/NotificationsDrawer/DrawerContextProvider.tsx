import React, { PropsWithChildren, createContext } from 'react';
import { DrawerSingleton } from './DrawerSingleton';

const DrawerSingletonContext = createContext(DrawerSingleton.Instance);
export const DrawerContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <DrawerSingletonContext.Provider value={DrawerSingleton.Instance}>
      {children}
    </DrawerSingletonContext.Provider>
  );
};
