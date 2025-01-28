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
  setHasNotificationsPermissionsAction,
  setNotificationsAction,
  updateNotificationReadAction,
  updateNotificationSelectedAction,
  updateNotificationsSelectedAction,
} from '../../store/actions/NotificationDrawerAction';
import {
  NotificationData,
  NotificationDrawerState,
} from '../../store/types/NotificationDrawerTypes';
import { getSevenDaysAgo } from '../UtcDate';
import { useDispatch, useSelector } from 'react-redux';

interface Bundle {
  id: string;
  name: string;
  displayName: string;
  children: Bundle[];
}

interface FilterConfigItem {
  title: string;
  value: string;
}

export type DrawerPanelProps = {
  panelRef: React.Ref<unknown>;
  isOrgAdmin: boolean;
  toggleDrawer: () => void;
  getUserPermissions: (
    applicationName?: string,
    disableCache?: boolean
  ) => Promise<Access[]>;
};

const selector = (state: NotificationDrawerState) => ({
  notifications: state.notificationData,
  activeFilters: state.filters,
  selectedNotifications: state.notificationData.filter(
    ({ selected }) => selected
  ),
  hasNotificationsPermissions: state.hasNotificationsPermissions,
});

const DrawerPanelBase = ({
  isOrgAdmin,
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
    selectedNotifications,
    hasNotificationsPermissions,
  } = useSelector(selector);
  const navigate = useNavigate();

  const populateNotifications = useCallback(
    (notifications: NotificationData[]) =>
      dispatch(setNotificationsAction(notifications)),
    [dispatch]
  );
  const addNotification = useCallback(
    (notification: NotificationData) =>
      dispatch(addNotificationAction(notification)),
    [dispatch]
  );
  const updateSelectedNotification = useCallback(
    (id: string, selected: boolean) =>
      dispatch(updateNotificationSelectedAction(id, selected)),
    [dispatch]
  );
  const setActiveFilters = useCallback(
    (filters: string[]) => dispatch(setFiltersAction(filters)),
    [dispatch]
  );
  const setHasNotificationsPermissions = useCallback(
    (permissions: boolean) =>
      dispatch(setHasNotificationsPermissionsAction(permissions)),
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

  const [filterConfig, setFilterConfig] = useState<FilterConfigItem[]>([]);
  const eventType: ChromeWsEventTypes =
    'com.redhat.console.notifications.drawer';

  const handleWsEvent = (event: ChromeWsPayload<NotificationData>) => {
    addNotification(event.data as unknown as NotificationData);
  };

  const getNotifications = async () => {
    try {
      const { data } = await axios.get<{ data: NotificationData[] }>(
        `/api/notifications/v1/notifications/drawer`,
        {
          params: {
            limit: 50,
            sort_by: 'read:asc',
            startDate: getSevenDaysAgo(),
          },
        }
      );
      populateNotifications(data?.data || []);
    } catch (error) {
      console.error('Unable to get Notifications ', error);
    }
  };

  const fetchPermissions = async (mounted: boolean) => {
    const permissions = await getUserPermissions?.('notifications');
    if (mounted) {
      setHasNotificationsPermissions(
        permissions?.some((item) =>
          [
            'notifications:*:*',
            'notifications:notifications:read',
            'notifications:notifications:write',
          ].includes((typeof item === 'string' && item) || item?.permission)
        )
      );
    }
  };

  const fetchFilterConfig = async (mounted: boolean) => {
    try {
      const response = await axios.get<Bundle[]>(
        '/api/notifications/v1/notifications/facets/bundles'
      );
      if (mounted) {
        setFilterConfig(
          response.data.map((bundle: Bundle) => ({
            title: bundle.displayName,
            value: bundle.name,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch filter configuration:', error);
    }
  };

  const init = useCallback(() => {
    getNotifications();
    fetchPermissions(true);
    fetchFilterConfig(true);
  }, [fetchPermissions, fetchFilterConfig, getNotifications]);

  useEffect(() => {
    let mounted = true;
    const unregister = addWsEventListener(eventType, handleWsEvent);
    init();
    return () => {
      mounted = false;
      unregister();
    };
  }, []);

  const filteredNotifications = useMemo(
    () =>
      (activeFilters || []).reduce(
        (acc: NotificationData[], chosenFilter: string) => [
          ...acc,
          ...notifications.filter(({ bundle }) => bundle === chosenFilter),
        ],
        []
      ),
    [activeFilters]
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
