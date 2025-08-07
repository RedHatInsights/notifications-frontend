/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { NotificationBadge } from '@patternfly/react-core/dist/dynamic/components/NotificationBadge';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';

interface DrawerBellProps {
  isNotificationDrawerExpanded: boolean;
}

const DrawerBell: React.ComponentType<DrawerBellProps> = ({
  isNotificationDrawerExpanded,
}) => {
  const {
    drawerActions: { toggleDrawerContent },
  } = useChrome();
  const {
    state: { hasUnread, ready },
  } = useNotificationDrawer();
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
          variant={hasUnread ? 'unread' : 'read'}
          onClick={() => {
            toggleDrawerContent({
              scope: 'notifications',
              module: './DrawerPanel',
            });
          }}
          isDisabled={!ready}
          aria-label="Notifications"
          isExpanded={isNotificationDrawerExpanded}
        ></NotificationBadge>
      </Tooltip>
    </ToolbarItem>
  );
};

export default DrawerBell;
