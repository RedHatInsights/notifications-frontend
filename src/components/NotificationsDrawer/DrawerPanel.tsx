import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ChromeWsEventTypes,
  ChromeWsPayload,
} from '@redhat-cloud-services/types';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import BulkSelect from '@redhat-cloud-services/frontend-components/BulkSelect';
import { Access } from '@redhat-cloud-services/rbac-client';

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
import {
  addNotificationAction,
  setFiltersAction,
  updateNotificationReadAction,
  updateNotificationSelectedAction,
  updateNotificationsSelectedAction,
} from '../../store/actions/NotificationDrawerAction';
import { NotificationData } from '../../store/types/NotificationDrawerTypes';
import { notificationDrawerSelector as selector } from '../../store/selectors/NotificationDrawerSelector';
import { useDispatch, useSelector } from 'react-redux';
import { ActionDropdown, FilterDropdown } from './Dropdowns';

export type DrawerPanelProps = {
  panelRef: React.Ref<unknown>;
  isOrgAdmin: boolean;
  toggleDrawer: () => void;
  getUserPermissions: (
    applicationName?: string,
    disableCache?: boolean
  ) => Promise<Access[]>;
};

const DrawerPanelBase = ({
  isOrgAdmin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUserPermissions,
  toggleDrawer,
}: DrawerPanelProps) => {
  const { addWsEventListener } = useChrome();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const {
    notifications,
    activeFilters,
    filterConfig,
    selectedNotifications,
    hasNotificationsPermissions,
  } = useSelector(selector);
  const navigate = useNavigate();

  const updateSelectedNotification = useCallback(
    (id: string, selected: boolean) =>
      dispatch(updateNotificationSelectedAction(id, selected)),
    [dispatch]
  );
  const setActiveFilters = useCallback(
    (filters: string[]) => dispatch(setFiltersAction(filters)),
    [dispatch]
  );
  const updateNotificationRead = useCallback(
    (id: string, read: boolean) =>
      dispatch(updateNotificationReadAction(id, read)),
    [dispatch]
  );
  const updateAllNotificationsSelected = useCallback(
    (selected: boolean) =>
      dispatch(updateNotificationsSelectedAction(selected)),
    [dispatch]
  );

  const eventType: ChromeWsEventTypes =
    'com.redhat.console.notifications.drawer';

  const handleWsEvent = (event: ChromeWsPayload<NotificationData>) => {
    addNotificationAction(event.data as NotificationData);
  };

  useEffect(() => {
    const unregister = addWsEventListener(eventType, handleWsEvent);
    return () => {
      unregister();
    };
  }, [addWsEventListener]);

  const filteredNotifications = useMemo(() => {
    const notificationsByBundle = notifications.reduce((acc, notification) => {
      if (!acc[notification.bundle]) {
        acc[notification.bundle] = [];
      }
      acc[notification.bundle].push(notification);
      return acc;
    }, {});

    return (activeFilters || []).reduce((acc, chosenFilter) => {
      if (notificationsByBundle[chosenFilter]) {
        acc.push(...notificationsByBundle[chosenFilter]);
      }
      return acc;
    }, [] as NotificationData[]);
  }, [activeFilters, notifications]);

  const onNotificationsDrawerClose = () => {
    setActiveFilters([]);
    toggleDrawer();
  };

  const onUpdateSelectedStatus = (read: boolean) => {
    axios
      .put('/api/notifications/v1/notifications/drawer/read', {
        notification_ids: selectedNotifications.map(
          (notification) => notification.id
        ),
        read_status: read,
      })
      .then(() => {
        selectedNotifications.forEach((notification) =>
          updateNotificationRead(notification.id, read)
        );
        setIsDropdownOpen(false);
        updateAllNotificationsSelected(false);
      })
      .catch((e) => {
        console.error('failed to update notification read status', e);
      });
  };

  const selectAllNotifications = (selected: boolean) => {
    updateAllNotificationsSelected(selected);
  };

  const selectVisibleNotifications = () => {
    const visibleNotifications =
      activeFilters.length > 0 ? filteredNotifications : notifications;
    visibleNotifications.forEach((notification) =>
      updateSelectedNotification(notification.id, true)
    );
  };

  const onFilterSelect = (chosenFilter: string) => {
    activeFilters.includes(chosenFilter)
      ? setActiveFilters(
          activeFilters.filter((filter) => filter !== chosenFilter)
        )
      : setActiveFilters([...activeFilters, chosenFilter]);
  };

  const onNavigateTo = (link: string) => {
    navigate(link);
    onNotificationsDrawerClose();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const RenderNotifications = () => {
    if (notifications.length === 0) {
      return (
        <EmptyNotifications
          isOrgAdmin={isOrgAdmin}
          onLinkClick={onNotificationsDrawerClose}
        />
      );
    }

    const sortedNotifications = orderBy(
      activeFilters?.length > 0 ? filteredNotifications : notifications,
      ['read', 'created'],
      ['asc', 'asc']
    );

    return sortedNotifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onNavigateTo={onNavigateTo}
        updateNotificationSelected={updateSelectedNotification}
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
        {activeFilters.length > 0 && (
          <Badge isRead>{activeFilters.length}</Badge>
        )}
        <FilterDropdown
          filterConfig={filterConfig}
          isDisabled={notifications.length === 0}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
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
                activeFilters.length > 0
                  ? filteredNotifications.length
                  : notifications.length
              })`,
              key: 'select-visible',
              onClick: selectVisibleNotifications,
            },
            {
              title: `Select all (${notifications.length})`,
              key: 'select-all',
              onClick: () => selectAllNotifications(true),
            },
          ]}
          count={notifications.filter(({ selected }) => selected).length}
          checked={
            notifications.length > 0 &&
            notifications.every(({ selected }) => selected)
          }
        />
        <ActionDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={toggleDropdown}
          isDisabled={notifications.length === 0}
          onUpdateSelectedStatus={onUpdateSelectedStatus}
          onNavigateTo={onNavigateTo}
          isOrgAdmin={isOrgAdmin}
          hasNotificationsPermissions={hasNotificationsPermissions}
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
    <DrawerPanelBase
      isOrgAdmin={props.isOrgAdmin}
      panelRef={panelRef}
      getUserPermissions={props.getUserPermissions}
      toggleDrawer={props.toggleDrawer}
    />
  )
);

export default DrawerPanel;
