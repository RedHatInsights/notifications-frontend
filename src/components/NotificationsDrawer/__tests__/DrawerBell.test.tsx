import { render, screen } from '@testing-library/react';
import { fn } from 'jest-mock';
import * as React from 'react';

import DrawerBell from '../DrawerBell';
import { NotificationData } from '../../../types/Drawer';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    drawerActions: {
      toggleDrawerContent: fn(),
    },
  });
});

jest.mock('../../../hooks/useNotificationDrawer');
import useNotificationDrawer from '../../../hooks/useNotificationDrawer';

const makeNotification = (id: string, read: boolean): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  source: 'test',
  bundle: 'rhel',
  created: new Date().toISOString(),
});

const renderBell = (notificationData: NotificationData[], ready = true) => {
  (useNotificationDrawer as jest.Mock).mockReturnValue({
    state: {
      notificationData,
      hasUnread: notificationData.some((n) => !n.read),
      ready,
      count: 0,
      filters: [],
      filterConfig: [],
      hasNotificationsPermissions: false,
      initializing: false,
    },
  });

  return render(<DrawerBell isNotificationDrawerExpanded={false} />);
};

describe('src/components/NotificationsDrawer/DrawerBell', () => {
  it('shows the unread count when there are unread notifications', () => {
    renderBell([
      makeNotification('1', false),
      makeNotification('2', false),
      makeNotification('3', false),
      makeNotification('4', true),
    ]);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show a count when all notifications are read', () => {
    renderBell([makeNotification('1', true), makeNotification('2', true)]);

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('renders the bell button when there are no notifications', () => {
    renderBell([]);

    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
  });

  it('disables the button when not ready', () => {
    renderBell([], false);

    expect(screen.getByRole('button', { name: /notifications/i })).toBeDisabled();
  });

  it('enables the button when ready', () => {
    renderBell([makeNotification('1', false)]);

    expect(screen.getByRole('button', { name: /notifications/i })).toBeEnabled();
  });
});
