import * as React from 'react';

import { Server } from '../types/Server';
import { AppContext } from './AppContext';
import { AppSkeleton } from './AppSkeleton';
import { useKesselRbacAccess } from './rbac/KesselRbacAccessContext';

/**
 * Maps Kessel workspace checks (rbac-config v2_perm relations) into {@link AppContext.rbac}.
 * Renders a skeleton while Kessel is loading. Must render under {@link KesselRbacAccessProvider}.
 */
export const AppKesselContextBridge: React.FunctionComponent<
  React.PropsWithChildren<{
    server: Server;
    isOrgAdmin: boolean;
  }>
> = ({ server, isOrgAdmin, children }) => {
  const kessel = useKesselRbacAccess();

  if (kessel.isLoading) {
    return <AppSkeleton />;
  }

  const kesselRbacAccessError = !!(kessel.workspaceError || kessel.kesselError);

  return (
    <AppContext.Provider
      value={{
        rbac: {
          canReadNotifications: kessel.canReadNotifications,
          canWriteNotifications: kessel.canWriteNotifications,
          canReadIntegrationsEndpoints: kessel.canReadIntegrationsEndpoints,
          canWriteIntegrationsEndpoints: kessel.canWriteIntegrationsEndpoints,
          canReadEvents: kessel.canReadEvents,
        },
        server,
        isOrgAdmin: !!isOrgAdmin,
        kesselRbacAccessError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
