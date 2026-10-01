import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import DrawerBell from '../DrawerBell';
import { NotificationData } from '../../../types/Drawer';

const mockToggleDrawerContent = fn();
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    drawerActions: {
      toggleDrawerContent: mockToggleDrawerContent,
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

const unreadNotifications = (howMany: number) =>
  Array.from({ length: howMany }, (_, index) => makeNotification(`${index}`, false));

// The window before the permission check resolves is modelled by `undefined`, but passing
// `undefined` to a defaulted parameter silently selects the default, so it travels as a sentinel
type AdminState = boolean | 'pending';

const renderBell = (
  notificationData: NotificationData[],
  ready = true,
  admin: AdminState = true
) => {
  (useNotificationDrawer as jest.Mock).mockReturnValue({
    state: {
      notificationData,
      hasUnread: notificationData.some((n) => !n.read),
      ready,
      count: 0,
      filters: [],
      filterConfig: [],
      hasNotificationsPermissions: false,
      isNotificationsAdmin: admin === 'pending' ? undefined : admin,
      initializing: false,
    },
  });

  return render(<DrawerBell isNotificationDrawerExpanded={false} />);
};

beforeEach(() => {
  mockToggleDrawerContent.mockClear();
});

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

    expect(screen.queryByText('0')).not.toBeInTheDocument();
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

  describe('when the user is not a notifications admin', () => {
    const DENIED = false;
    const bell = () => screen.getByRole('button', { name: /notifications/i });

    it('marks the bell disabled', () => {
      renderBell(unreadNotifications(3), true, DENIED);

      expect(bell()).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open the drawer when clicked', async () => {
      renderBell(unreadNotifications(3), true, DENIED);

      await userEvent.click(bell());

      expect(mockToggleDrawerContent).not.toHaveBeenCalled();
    });

    it('hides the unread count', () => {
      renderBell(unreadNotifications(3), true, DENIED);

      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('renders neither the unread styling nor the arrival pulse', () => {
      renderBell(unreadNotifications(3), true, DENIED);

      expect(bell()).not.toHaveClass('pf-m-unread');
      expect(bell()).not.toHaveClass('pf-m-notify');
    });

    it('explains why the bell is disabled on hover', async () => {
      renderBell(unreadNotifications(3), true, DENIED);

      await userEvent.hover(bell());

      expect(await screen.findByText('Only admins can view notifications')).toBeInTheDocument();
    });
  });

  describe('while the admin check is still pending', () => {
    const PENDING = 'pending' as const;
    const bell = () => screen.getByRole('button', { name: /notifications/i });

    it('disables the bell, so a non-admin never sees it enabled even briefly', () => {
      renderBell(unreadNotifications(3), true, PENDING);

      expect(bell()).toBeDisabled();
    });

    it('does not open the drawer when clicked', async () => {
      renderBell(unreadNotifications(3), true, PENDING);

      await userEvent.click(bell());

      expect(mockToggleDrawerContent).not.toHaveBeenCalled();
    });

    it('hides the unread count', () => {
      renderBell(unreadNotifications(3), true, PENDING);

      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('renders neither the unread styling nor the arrival pulse', () => {
      renderBell(unreadNotifications(3), true, PENDING);

      expect(bell()).not.toHaveClass('pf-m-unread');
      expect(bell()).not.toHaveClass('pf-m-notify');
    });

    it('does not claim the user lacks access, since the check has not come back', async () => {
      renderBell(unreadNotifications(3), true, PENDING);

      await userEvent.hover(bell());

      expect(screen.queryByText('Only admins can view notifications')).not.toBeInTheDocument();
    });
  });

  describe('when the user is a notifications admin', () => {
    // Positive control for the denied/pending styling assertions: without this, those could pass
    // simply because the classes are never applied to anyone
    it('does render the unread styling and arrival pulse', () => {
      renderBell(unreadNotifications(3), true, true);

      const bell = screen.getByRole('button', { name: /notifications/i });
      expect(bell).toHaveClass('pf-m-unread');
      expect(bell).toHaveClass('pf-m-notify');
    });

    it('opens the drawer when clicked', async () => {
      renderBell(unreadNotifications(3), true, true);

      await userEvent.click(screen.getByRole('button', { name: /notifications/i }));

      expect(mockToggleDrawerContent).toHaveBeenCalledWith({
        scope: 'notifications',
        module: './DrawerPanel',
      });
    });
  });
});
