import React, { useState } from 'react';
import {
  NotificationDrawerList,
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
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { NotificationData } from '../../types/Drawer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { updateNotificationReadStatus } from '../../api/helpers/notifications/update-read-status-helper';

interface NotificationItemProps {
  notification: NotificationData;
  onNavigateTo: (link: string) => void;
  updateNotificationSelected: (id: string, selected: boolean) => void;
  updateNotificationRead: (id: string, read: boolean) => void;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNavigateTo,
  updateNotificationSelected,
  updateNotificationRead,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onCheckboxToggle = () =>
    updateNotificationSelected(notification.id, !notification.selected);

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
    <DropdownItem key="read" onClick={onMarkAsRead}>{`Mark as ${
      !notification.read ? 'read' : 'unread'
    }`}</DropdownItem>,
    <DropdownItem
      key="manage-event"
      onClick={() =>
        onNavigateTo(
          `/settings/notifications/configure-events?bundle=${notification.bundle}&tab=configuration`
        )
      }
    >
      Manage this event
    </DropdownItem>,
  ];
  return (
    <>
      <NotificationDrawerList>
        <NotificationDrawerListItem
          aria-label={`Notification item ${notification.title}`}
          variant="info"
          isRead={notification.read}
        >
          <NotificationDrawerListItemHeader
            title={notification.title}
            srTitle="Info notification:"
          >
            <Checkbox
              isChecked={notification.selected}
              onChange={onCheckboxToggle}
              id="selected-checkbox"
              name="selected-checkbox"
            />
            <Dropdown
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  aria-label="Notification actions dropdown"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
          <NotificationDrawerListItemBody
            timestamp={<DateFormat date={notification.created} />}
          >
            <Label variant="outline" isCompact className="pf-u-mb-md">
              {notification.source}
            </Label>
            <span className="pf-u-display-block">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {notification.description}
              </ReactMarkdown>
            </span>
          </NotificationDrawerListItemBody>
        </NotificationDrawerListItem>
      </NotificationDrawerList>
    </>
  );
};

export default NotificationItem;
