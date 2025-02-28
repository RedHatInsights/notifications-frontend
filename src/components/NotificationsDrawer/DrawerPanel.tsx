import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChromeWsEventTypes,
  ChromeWsPayload,
} from '@redhat-cloud-services/types';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import BulkSelect from '@redhat-cloud-services/frontend-components/BulkSelect';

import {
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
} from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';

import orderBy from 'lodash/orderBy';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { EmptyNotifications } from './EmptyNotifications';
import { NotificationData } from '../../types/Drawer';
import useNotificationDrawer from '../../hooks/useNotificationDrawer';
import { ActionDropdown, FilterDropdown } from './Dropdowns';

export type DrawerPanelProps = {
  panelRef: React.Ref<unknown>;
  toggleDrawer: () => void;
};

const DrawerPanelBase = ({ toggleDrawer }: DrawerPanelProps) => {
  const { addWsEventListener, auth } = useChrome();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const {
    state,
    addNotification,
    updateNotificationRead,
    updateSelectedStatus,
    updateNotificationsSelected,
    updateNotificationSelected,
    setFilters,
  } = useNotificationDrawer();
  const navigate = useNavigate();

  const eventType: ChromeWsEventTypes =
    'com.redhat.console.notifications.drawer';

  const handleWsEvent = useCallback(
    (event: ChromeWsPayload<NotificationData>) => {
      addNotification(event.data as NotificationData);
    },
    [addNotification]
  );

  useEffect(() => {
    const unregister = addWsEventListener(eventType, handleWsEvent);
    return () => {
      unregister();
    };
  }, [addWsEventListener, handleWsEvent]);

  useEffect(() => {
    auth.getUser().then((user) => {
      if (user) {
        setIsOrgAdmin(!!user.identity.user?.is_org_admin);
      }
    });
  }, [auth]);

  const filteredNotifications = useMemo(() => {
    const notificationsByBundle = state.notificationData.reduce(
      (acc, notification) => {
        if (!acc[notification.bundle]) {
          acc[notification.bundle] = [];
        }
        acc[notification.bundle].push(notification);
        return acc;
      },
      {}
    );

    return (state.filters || []).reduce((acc, chosenFilter) => {
      if (notificationsByBundle[chosenFilter]) {
        acc.push(...notificationsByBundle[chosenFilter]);
      }
      return acc;
    }, [] as NotificationData[]);
  }, [state.filters, state.notificationData]);

  const onNotificationsDrawerClose = () => {
    setFilters([]);
    toggleDrawer();
  };

  const onUpdateSelectedStatus = (read: boolean) => {
    updateSelectedStatus(read);
    setIsDropdownOpen(false);
  };

  const selectAllNotifications = (selected: boolean) => {
    updateNotificationsSelected(selected);
  };

  const selectVisibleNotifications = () => {
    const visibleNotifications =
      state.filters.length > 0 ? filteredNotifications : state.notificationData;
    visibleNotifications.forEach((notification) =>
      updateNotificationSelected(notification.id, true)
    );
  };

  const onFilterSelect = (chosenFilter: string) => {
    state.filters.includes(chosenFilter)
      ? setFilters(state.filters.filter((filter) => filter !== chosenFilter))
      : setFilters([...state.filters, chosenFilter]);
  };

  const onNavigateTo = (link: string) => {
    navigate(link);
    onNotificationsDrawerClose();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const RenderNotifications = () => {
    if (state.notificationData.length === 0) {
      return (
        <EmptyNotifications
          isOrgAdmin={isOrgAdmin}
          onLinkClick={onNotificationsDrawerClose}
        />
      );
    }

    const sortedNotifications = orderBy(
      state.filters?.length > 0
        ? filteredNotifications
        : state.notificationData,
      ['read', 'created'],
      ['asc', 'asc']
    );

    return sortedNotifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onNavigateTo={onNavigateTo}
        updateNotificationSelected={updateNotificationSelected}
        updateNotificationRead={updateNotificationRead}
      />
    ));
  };

  return (
    <>
      <NotificationDrawerHeader
        onClose={onNotificationsDrawerClose}
        title="Notifications"
        className="pf-u-align-items-center"
      >
        {state.filters.length > 0 && (
          <Badge isRead>{state.filters.length}</Badge>
        )}
        <FilterDropdown
          filterConfig={state.filterConfig}
          isDisabled={state.notificationData.length === 0}
          activeFilters={state.filters}
          setActiveFilters={setFilters}
          onFilterSelect={onFilterSelect}
          isFilterDropdownOpen={isFilterDropdownOpen}
          setIsFilterDropdownOpen={setIsFilterDropdownOpen}
        />
        <BulkSelect
          id="notifications-bulk-select"
          items={[
            {
              title: 'Select none (0)',
              key: 'select-none',
              onClick: () => selectAllNotifications(false),
            },
            {
              title: `Select visible (${
                state.filters.length > 0
                  ? filteredNotifications.length
                  : state.notificationData.length
              })`,
              key: 'select-visible',
              onClick: selectVisibleNotifications,
            },
            {
              title: `Select all (${state.notificationData.length})`,
              key: 'select-all',
              onClick: () => selectAllNotifications(true),
            },
          ]}
          count={
            state.notificationData.filter(({ selected }) => selected).length
          }
          checked={
            state.notificationData.length > 0 &&
            state.notificationData.every(({ selected }) => selected)
          }
        />
        <ActionDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={toggleDropdown}
          isDisabled={state.notificationData.length === 0}
          onUpdateSelectedStatus={onUpdateSelectedStatus}
          onNavigateTo={onNavigateTo}
          isOrgAdmin={isOrgAdmin}
          hasNotificationsPermissions={state.hasNotificationsPermissions}
        />
      </NotificationDrawerHeader>
      <NotificationDrawerBody>
        <NotificationDrawerList>
          <RenderNotifications />
        </NotificationDrawerList>
      </NotificationDrawerBody>
    </>
  );
};

const DrawerPanel = React.forwardRef(
  (props: DrawerPanelProps, panelRef: React.Ref<unknown>) => (
    <DrawerPanelBase panelRef={panelRef} toggleDrawer={props.toggleDrawer} />
  )
);
DrawerPanel.displayName = 'DrawerPanel';

export default DrawerPanel;
