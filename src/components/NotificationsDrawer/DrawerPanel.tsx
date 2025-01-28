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
  Flex,
  FlexItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
} from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import {
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import {
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
} from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';

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

  const filteredNotifications = useMemo(
    () =>
      (activeFilters || []).reduce(
        (acc: NotificationData[], chosenFilter: string) => [
          ...acc,
          ...notifications.filter(({ bundle }) => bundle === chosenFilter),
        ],
        []
      ),
    [activeFilters, notifications]
  );

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

  const dropdownItems = [
    <DropdownItem key="actions" description="Actions" />,
    <DropdownItem
      key="read selected"
      onClick={() => onUpdateSelectedStatus(true)}
      isDisabled={notifications.length === 0}
    >
      Mark selected as read
    </DropdownItem>,
    <DropdownItem
      key="unread selected"
      onClick={() => onUpdateSelectedStatus(false)}
      isDisabled={notifications.length === 0}
    >
      Mark selected as unread
    </DropdownItem>,
    <Divider key="divider" />,
    <DropdownItem key="quick links" description="Quick links" />,
    <DropdownItem
      key="notifications log"
      onClick={() => onNavigateTo('/settings/notifications/notificationslog')}
    >
      <Flex>
        <FlexItem>View notifications log</FlexItem>
      </Flex>
    </DropdownItem>,
    (isOrgAdmin || hasNotificationsPermissions) && (
      <DropdownItem
        key="notification settings"
        onClick={() => onNavigateTo('/settings/notifications/configure-events')}
      >
        <Flex>
          <FlexItem>Configure notification settings</FlexItem>
        </Flex>
      </DropdownItem>
    ),
    <DropdownItem
      key="notification preferences"
      onClick={() => onNavigateTo('/settings/notifications/user-preferences')}
    >
      <Flex>
        <FlexItem>Manage my notification preferences</FlexItem>
      </Flex>
    </DropdownItem>,
  ];

  const filterDropdownItems = () => {
    return [
      <DropdownGroup key="filter-label" label="Show notifications for...">
        <DropdownList>
          {filterConfig.map((source) => (
            <DropdownItem
              key={source.value}
              onClick={() => onFilterSelect(source.value)}
              isDisabled={notifications.length === 0}
              isSelected={activeFilters.includes(source.value)}
              hasCheckbox
            >
              {source.title}
            </DropdownItem>
          ))}
          <Divider />
          <DropdownItem
            key="reset-filters"
            isDisabled={activeFilters.length === 0}
            onClick={() => setActiveFilters([])}
          >
            Reset filters
          </DropdownItem>
        </DropdownList>
      </DropdownGroup>,
    ];
  };

  const renderNotifications = () => {
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
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              id="notifications-filter-toggle"
              variant="plain"
              aria-label="Notifications filter"
            >
              <FilterIcon />
            </MenuToggle>
          )}
          isOpen={isFilterDropdownOpen}
          onOpenChange={setIsFilterDropdownOpen}
          popperProps={{
            position: PopoverPosition.right,
          }}
          id="notifications-filter-dropdown"
        >
          {filterDropdownItems()}
        </Dropdown>
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
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="plain"
              id="notifications-actions-toggle"
              aria-label="Notifications actions dropdown"
              isFullWidth
            >
              <EllipsisVIcon />
            </MenuToggle>
          )}
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          popperProps={{
            position: PopoverPosition.right,
          }}
          id="notifications-actions-dropdown"
        >
          <DropdownList>{dropdownItems}</DropdownList>
        </Dropdown>
      </NotificationDrawerHeader>
      <NotificationDrawerBody>
        <NotificationDrawerList>{renderNotifications()}</NotificationDrawerList>
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
