/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from 'react';
import { NotificationBadge } from '@patternfly/react-core/dist/dynamic/components/NotificationBadge';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  notifications: {
    id: 'notificationsDrawer.bell.notifications',
    defaultMessage: 'Notifications',
  },
});

const DRAWER_SCOPE = 'notifications';
const DRAWER_MODULE = './DrawerPanel';

interface DrawerBellProps {
  isNotificationDrawerExpanded: boolean;
}

const DrawerBell: React.ComponentType<DrawerBellProps> = ({ isNotificationDrawerExpanded }) => {
  const intl = useIntl();
  const {
    drawerActions: { toggleDrawerContent },
  } = useChrome();
  const {
    state: { hasUnread, ready, notificationData },
  } = useNotificationDrawer();
  const [shouldNotify, setShouldNotify] = useState(false);
  const prevCountRef = useRef(0);
  const unreadCount = (notificationData ?? []).filter((n) => !n.read).length;

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setShouldNotify(true);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <ToolbarItem className="pf-v6-u-mx-0">
      <Tooltip
        aria="none"
        aria-live="polite"
        content={intl.formatMessage(messages.notifications)}
        flipBehavior={['bottom']}
        className="tooltip-inner-settings-cy"
      >
        <NotificationBadge
          className="chr-c-notification-badge"
          variant={hasUnread ? 'unread' : 'read'}
          count={unreadCount}
          onClick={() => {
            toggleDrawerContent({
              scope: DRAWER_SCOPE,
              module: DRAWER_MODULE,
            });
          }}
          isDisabled={!ready}
          aria-label={intl.formatMessage(messages.notifications)}
          isExpanded={isNotificationDrawerExpanded}
          shouldNotify={shouldNotify}
          onAnimationEnd={() => setShouldNotify(false)}
        ></NotificationBadge>
      </Tooltip>
    </ToolbarItem>
  );
};

export default DrawerBell;
