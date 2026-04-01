import * as React from 'react';
import { useContext } from 'react';

import { Server, ServerStatus } from '../types/Server';

export interface AppContext {
  rbac: {
    canWriteIntegrationsEndpoints: boolean;
    canReadIntegrationsEndpoints: boolean;
    canWriteNotifications: boolean;
    canReadNotifications: boolean;
    canReadEvents: boolean;
  };
  isOrgAdmin: boolean;
  server: Server;
  /**
   * True when the default workspace fetch or Kessel bulk check failed (outage / transport),
   * not a permission deny. `rbac` may be all false in that case; use this to distinguish from real denies.
   */
  kesselRbacAccessError?: boolean;
}

export const AppContext = React.createContext<AppContext>({
  rbac: {
    canReadIntegrationsEndpoints: false,
    canReadNotifications: false,
    canWriteIntegrationsEndpoints: false,
    canWriteNotifications: false,
    canReadEvents: false,
  },
  isOrgAdmin: false,
  server: {
    status: ServerStatus.RUNNING,
  },
});

export const useAppContext = () => useContext(AppContext);
