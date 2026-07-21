import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
} from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { PopoverPosition } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Checkbox } from '@patternfly/react-core/dist/dynamic/components/Checkbox';
import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import {
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
} from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { NotificationData } from '../../types/Drawer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { updateNotificationReadStatus } from '../../api/helpers/notifications/update-read-status-helper';
import messages from '../../properties/DefinedMessages';

interface NotificationItemProps {
  notification: NotificationData;
  onNavigateTo: (link: string) => void;
  updateNotificationSelected: (id: string, selected: boolean) => void;
  updateNotificationRead: (id: string, read: boolean) => void;
  isOrgAdmin: boolean;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNavigateTo,
  updateNotificationSelected,
  updateNotificationRead,
  isOrgAdmin,
}) => {
  const intl = useIntl();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onCheckboxToggle = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateNotificationSelected(notification.id, !notification.selected);
  };

  const onNotificationClick = () => {
    const url = `/settings/notifications/user-preferences?${new URLSearchParams({
      bundle: notification.bundle,
      ...(notification.application && { app: notification.application }),
    }).toString()}`;
    window.location.href = url;
  };

  const onMarkAsRead = () => {
    updateNotificationReadStatus({
      notification_ids: [notification.id],
      read_status: !notification.read,
    })
      .then(() => {
        updateNotificationRead(notification.id, !notification.read);
        setIsDropdownOpen(false);
      })
      .catch((e) => {
        console.error('failed to update notification read status', e);
      });
  };

  const notificationDropdownItems = [
    <DropdownItem key="read" onClick={onMarkAsRead}>
      {notification.read
        ? intl.formatMessage(messages.markAsUnread)
        : intl.formatMessage(messages.markAsRead)}
    </DropdownItem>,
    <Divider key="divider" />,
    <DropdownItem
      key="view-event-log"
      onClick={() => {
        const url = `/settings/notifications/eventlog?${new URLSearchParams({
          service: notification.source,
          event: notification.title,
        }).toString()}`;
        window.location.href = url;
      }}
    >
      {intl.formatMessage(messages.viewInEventLog)}
    </DropdownItem>,
    <DropdownItem
      key="manage-my-notifications"
      onClick={() => {
        const url = `/settings/notifications/user-preferences?${new URLSearchParams({
          bundle: notification.bundle,
          ...(notification.application && { app: notification.application }),
        }).toString()}`;
        window.location.href = url;
      }}
    >
      {intl.formatMessage(messages.manageMyEventNotifications)}
    </DropdownItem>,
    !isOrgAdmin ? (
      <Tooltip
        key="manage-event-config-tooltip"
        content={intl.formatMessage(messages.adminAccessRequired)}
      >
        <span>
          <DropdownItem
            key="manage-event-config"
            onClick={() =>
              onNavigateTo(
                `/settings/notifications/configure-events?${new URLSearchParams({
                  bundle: notification.bundle,
                  tab: 'configuration',
                }).toString()}`
              )
            }
            isDisabled={true}
          >
            {intl.formatMessage(messages.manageEventConfiguration)}
          </DropdownItem>
        </span>
      </Tooltip>
    ) : (
      <DropdownItem
        key="manage-event-config"
        onClick={() =>
          onNavigateTo(
            `/settings/notifications/configure-events?${new URLSearchParams({
              bundle: notification.bundle,
              tab: 'configuration',
            }).toString()}`
          )
        }
      >
        {intl.formatMessage(messages.manageEventConfiguration)}
      </DropdownItem>
    ),
  ];
  return (
    <NotificationDrawerListItem
      aria-label={`Notification item ${notification.title}`}
      variant="info"
      isRead={notification.read}
      onClick={onNotificationClick}
      style={{ cursor: 'pointer' }}
    >
      <NotificationDrawerListItemHeader title={notification.title} srTitle="Info notification:">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            isChecked={notification.selected}
            onChange={onCheckboxToggle}
            id="selected-checkbox"
            name="selected-checkbox"
          />
        </div>
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              aria-label="Notification actions dropdown"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              id="notification-item-toggle"
              isExpanded={isDropdownOpen}
              variant="plain"
            >
              <EllipsisVIcon />
            </MenuToggle>
          )}
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          popperProps={{
            position: PopoverPosition.right,
          }}
          id="notification-item-dropdown"
        >
          <DropdownList>{notificationDropdownItems}</DropdownList>
        </Dropdown>
      </NotificationDrawerListItemHeader>
      <NotificationDrawerListItemBody timestamp={<DateFormat date={notification.created} />}>
        <Label variant="outline" isCompact className="pf-u-mb-md">
          {notification.source}
        </Label>
        <span className="pf-u-display-block">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{notification.description}</ReactMarkdown>
        </span>
      </NotificationDrawerListItemBody>
    </NotificationDrawerListItem>
  );
};

export default NotificationItem;
