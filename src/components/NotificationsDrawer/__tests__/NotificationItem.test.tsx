import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import NotificationItem from '../NotificationItem';
import { NotificationData } from '../../../types/Drawer';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => React.createElement('div', null, children),
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

jest.mock('../../../api/helpers/notifications/update-read-status-helper', () => ({
  updateNotificationReadStatus: jest.fn(() => Promise.resolve()),
}));

const makeNotification = (id: string, read: boolean, selected = false): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  selected,
  source: 'test-source',
  bundle: 'rhel',
  created: new Date().toISOString(),
});

const renderNotificationItem = (
  notification: NotificationData,
  updateNotificationSelected = jest.fn(),
  updateNotificationRead = jest.fn(),
  onNavigateTo = jest.fn()
) => {
  return render(
    <NotificationItem
      notification={notification}
      onNavigateTo={onNavigateTo}
      updateNotificationSelected={updateNotificationSelected}
      updateNotificationRead={updateNotificationRead}
    />
  );
};

describe('NotificationItem variant based on read status', () => {
  it('renders with info variant when notification is unread', () => {
    const notification = makeNotification('1', false);
    renderNotificationItem(notification);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('pf-m-info');
  });

  it('renders without info variant when notification is read', () => {
    const notification = makeNotification('1', true);
    renderNotificationItem(notification);

    const listItem = screen.getByRole('listitem');
    expect(listItem).not.toHaveClass('pf-m-info');
  });

  it('applies isRead attribute when notification is read', () => {
    const notification = makeNotification('1', true);
    renderNotificationItem(notification);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('pf-m-read');
  });

  it('does not apply isRead attribute when notification is unread', () => {
    const notification = makeNotification('1', false);
    renderNotificationItem(notification);

    const listItem = screen.getByRole('listitem');
    expect(listItem).not.toHaveClass('pf-m-read');
  });
});

describe('NotificationItem read/unread toggle', () => {
  it('shows "Mark as read" option when notification is unread', async () => {
    const notification = makeNotification('1', false);
    renderNotificationItem(notification);

    await userEvent.click(screen.getByRole('button', { name: 'Notification actions dropdown' }));
    expect(screen.getByText('Mark as read')).toBeInTheDocument();
  });

  it('shows "Mark as unread" option when notification is read', async () => {
    const notification = makeNotification('1', true);
    renderNotificationItem(notification);

    await userEvent.click(screen.getByRole('button', { name: 'Notification actions dropdown' }));
    expect(screen.getByText('Mark as unread')).toBeInTheDocument();
  });
});

describe('NotificationItem interactions', () => {
  it('calls updateNotificationSelected when checkbox is toggled', async () => {
    const notification = makeNotification('1', false, false);
    const updateNotificationSelected = jest.fn();
    renderNotificationItem(notification, updateNotificationSelected);

    const checkbox = screen.getByRole('checkbox', { name: '' });
    await userEvent.click(checkbox);

    expect(updateNotificationSelected).toHaveBeenCalledWith('1', true);
  });

  it('calls onNavigateTo when "Manage this event" is clicked', async () => {
    const notification = makeNotification('1', false);
    const onNavigateTo = jest.fn();
    renderNotificationItem(notification, jest.fn(), jest.fn(), onNavigateTo);

    await userEvent.click(screen.getByRole('button', { name: 'Notification actions dropdown' }));
    await userEvent.click(screen.getByText('Manage this event'));

    expect(onNavigateTo).toHaveBeenCalledWith(
      expect.stringContaining('/settings/notifications/configure-events')
    );
  });
});
