import * as React from 'react';

import DrawerBell from './DrawerBell';
import DrawerPermissionsSync from './DrawerPermissionsSync';
import { NotificationsDrawerProvider } from './NotificationsDrawerProvider';

interface DrawerBellProps {
  isNotificationDrawerExpanded: boolean;
}

const DrawerBellEntry: React.ComponentType<DrawerBellProps> = (props) => (
  <NotificationsDrawerProvider>
    <DrawerPermissionsSync />
    <DrawerBell {...props} />
  </NotificationsDrawerProvider>
);

export default DrawerBellEntry;
