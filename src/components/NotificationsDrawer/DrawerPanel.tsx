import React, { useEffect, useMemo, useState } from 'react';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  ChromeWsEventTypes,
  ChromeWsPayload,
} from '@redhat-cloud-services/types';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
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
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import {
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
} from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import {
  NotificationData,
  NotificationsPayload,
  addNotificationAtom,
  notificationDrawerDataAtom,
  notificationDrawerFilterAtom,
  notificationDrawerSelectedAtom,
  updateNotificationReadAtom,
  updateNotificationSelectedAtom,
  updateNotificationsSelectedAtom,
} from '../../state/atoms/notificationDrawerAtom';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import FilterIcon from '@patternfly/react-icons/dist/dynamic/icons/filter-icon';
import BellSlashIcon from '@patternfly/react-icons/dist/dynamic/icons/bell-slash-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import orderBy from 'lodash/orderBy';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import BulkSelect from '@redhat-cloud-services/frontend-components/BulkSelect';
import axios from 'axios';
import { Access } from '@redhat-cloud-services/rbac-client';
import {
  Stack,
  StackItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { getSevenDaysAgo } from '../UtcDate';
import { useFlag } from '@unleash/proxy-client-react';

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
  innerRef: React.Ref<unknown>;
  isOrgAdmin: boolean;
  expanded: boolean;
  getUserPermissions: (
    applicationName?: string,
    disableCache?: boolean
  ) => Promise<Access[]>;
};

const EmptyNotifications = ({
  isOrgAdmin,
  onLinkClick,
}: {
  onLinkClick: () => void;
  isOrgAdmin?: boolean;
}) => (
  <EmptyState>
    <EmptyStateIcon icon={BellSlashIcon} />
    <Title headingLevel="h4" size="lg">
      No notifications found
    </Title>
    <EmptyStateBody>
      {isOrgAdmin ? (
        <Stack>
          <StackItem>
            <Text>There are currently no notifications for you.</Text>
          </StackItem>
          <StackItem>
            <Text>
              Try&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                checking your notification preferences
              </Link>
              &nbsp;and managing the&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/configure-events"
              >
                notification configuration
              </Link>
              &nbsp;for your organization.
            </Text>
          </StackItem>
        </Stack>
      ) : (
        <>
          <Stack>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Text>There are currently no notifications for you.</Text>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                Check your Notification Preferences
              </Link>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/notificationslog"
              >
                View the Event log to see all fired events
              </Link>
            </StackItem>
            <StackItem className="pf-v5-u-pl-lg pf-v5-u-pb-sm">
              <Text>Contact your organization administrator</Text>
            </StackItem>
          </Stack>
        </>
      )}
    </EmptyStateBody>
  </EmptyState>
);

const DrawerPanelBase = ({
  innerRef,
  isOrgAdmin,
  getUserPermissions,
}: DrawerPanelProps) => {
  const { addWsEventListener } = useChrome();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useAtom(
    notificationDrawerFilterAtom
  );
  const navigate = useNavigate();
  const populateNotifications = useSetAtom(notificationDrawerDataAtom);
  const isEnabled = useFlag('platform.chrome.notifications-drawer');
  console.log(isEnabled);
  const addNotification = useSetAtom(addNotificationAtom);
  const notifications = useAtomValue(notificationDrawerDataAtom);
  const selectedNotifications = useAtomValue(notificationDrawerSelectedAtom);
  const updateSelectedNotification = useSetAtom(updateNotificationSelectedAtom);
  const [hasNotificationsPermissions, setHasNotificationsPermissions] =
    useState(false);
  const updateNotificationRead = useSetAtom(updateNotificationReadAtom);
  const updateAllNotificationsSelected = useSetAtom(
    updateNotificationsSelectedAtom
  );
  const [filterConfig, setFilterConfig] = useState<FilterConfigItem[]>([]);
  const eventType: ChromeWsEventTypes =
    'com.redhat.console.notifications.drawer';
  const handleWsEvent = (event: ChromeWsPayload<NotificationsPayload>) => {
    console.log('AHHHH AN EVENT');
    console.log(event);
    addNotification(event.data as unknown as NotificationData);
  };

  useEffect(() => {
    let mounted = true;
    const unregister = addWsEventListener(eventType, handleWsEvent);
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
    const fetchPermissions = async () => {
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
    const fetchFilterConfig = async () => {
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
    getNotifications();
    fetchPermissions();
    fetchFilterConfig();
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
      onClick={() => {
        onUpdateSelectedStatus(true);
      }}
      isDisabled={notifications.length === 0}
    >
      Mark selected as read
    </DropdownItem>,
    <DropdownItem
      key="unread selected"
      onClick={() => {
        onUpdateSelectedStatus(false);
      }}
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
    <NotificationDrawer ref={innerRef}>
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
    </NotificationDrawer>
  );
};

const DrawerPanel = React.forwardRef((props: DrawerPanelProps, ref) => (
  <DrawerPanelBase
    innerRef={ref}
    isOrgAdmin={props.isOrgAdmin}
    getUserPermissions={props.getUserPermissions}
    expanded={props.expanded}
  />
));

export default DrawerPanel;
