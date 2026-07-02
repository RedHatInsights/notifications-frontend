import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import * as React from 'react';

import { KesselRbacAccessProvider } from '../../app/rbac/KesselRbacAccessProvider';

export const NotificationsDrawerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
    <KesselRbacAccessProvider>{children}</KesselRbacAccessProvider>
  </AccessCheck.Provider>
);
