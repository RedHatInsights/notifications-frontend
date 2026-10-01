/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from 'react';
import { NotificationBadge } from '@patternfly/react-core/dist/dynamic/components/NotificationBadge';
import { ToolbarItem } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';

interface DrawerBellProps {
  isNotificationDrawerExpanded: boolean;
}

const DrawerBell: React.ComponentType<DrawerBellProps> = ({ isNotificationDrawerExpanded }) => {
  const {
    drawerActions: { toggleDrawerContent },
  } = useChrome();
  const {
    state: { hasUnread, ready, notificationData, isNotificationsAdmin },
  } = useNotificationDrawer();

  // Three states, not two. The permission check is async, so there is always at least one
  // render before it resolves, and the unresolved window has to be gated rather than guessed:
  // optimistically allowing it flashed an enabled bell with a live unread count at non-admins,
  // while pessimistically denying it would tell admins they have no access on every page load.
  // So pending is non-interactive like a denial, but unexplained like a load
  const isAdmin = isNotificationsAdmin === true;
  const isDenied = isNotificationsAdmin === false;

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
        content={isDenied ? 'Only admins can view notifications' : 'Notifications'}
        flipBehavior={['bottom']}
        className="tooltip-inner-settings-cy"
      >
        <NotificationBadge
          className="chr-c-notification-badge"
          // Everything that could reveal notification activity is keyed off a confirmed admin,
          // so neither a denied user nor an unresolved one ever sees a count, unread styling or
          // an arrival pulse
          variant={isAdmin && hasUnread ? 'unread' : 'read'}
          count={isAdmin ? unreadCount : undefined}
          onClick={() => {
            toggleDrawerContent({
              scope: 'notifications',
              module: './DrawerPanel',
            });
          }}
          // `isAriaDisabled` rather than `isDisabled` for the denial: a truly disabled button
          // swallows mouse events in every browser, so the Tooltip explaining why it is
          // disabled would never appear. PatternFly still blocks onClick in this state
          isAriaDisabled={isDenied}
          // Pending is folded in here, so the bell opens only once the check has come back in
          // the user's favour. A plain disable is right for it: there is nothing to explain yet
          isDisabled={!isDenied && !(isAdmin && ready)}
          aria-label="Notifications"
          isExpanded={isNotificationDrawerExpanded}
          shouldNotify={isAdmin && shouldNotify}
          onAnimationEnd={() => setShouldNotify(false)}
        ></NotificationBadge>
      </Tooltip>
    </ToolbarItem>
  );
};

export default DrawerBell;
