/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { NotificationBadge } from '@patternfly/react-core/dist/dynamic/components/NotificationBadge';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import BellIcon from '@patternfly/react-icons/dist/dynamic/icons/bell-icon';
import { DrawerSingleton } from './DrawerSingleton';

interface DrawerBellProps {
  isNotificationDrawerExpanded: boolean;
  toggleDrawer: () => void;
}

const DrawerBell: React.ComponentType<DrawerBellProps> = ({
  isNotificationDrawerExpanded,
  toggleDrawer,
}) => {
  return (
    <ToolbarItem className="pf-v6-u-mx-0">
      <Tooltip
        aria="none"
        aria-live="polite"
        content={'Notifications'}
        flipBehavior={['bottom']}
        className="tooltip-inner-settings-cy"
      >
        <NotificationBadge
          className="chr-c-notification-badge"
          variant={
            DrawerSingleton.Instance.hasUnreadNotifications()
              ? 'unread'
              : 'read'
          }
          onClick={() => toggleDrawer()}
          aria-label="Notifications"
          isExpanded={isNotificationDrawerExpanded}
        >
          <BellIcon />
        </NotificationBadge>
      </Tooltip>
    </ToolbarItem>
  );
};

export default DrawerBell;
