import { render, screen } from '@testing-library/react';
import { fn } from 'jest-mock';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => React.createElement('div', null, children),
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

import DrawerPanel from '../DrawerPanel';
import { NotificationData } from '../../../types/Drawer';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    addWsEventListener: () => fn(),
    auth: {
      getUser: () =>
        Promise.resolve({
          identity: { user: { is_org_admin: false } },
        }),
    },
  });
});

jest.mock('../../../hooks/useNotificationDrawer');
import useNotificationDrawer from '../../../hooks/useNotificationDrawer';

const makeNotification = (id: string, read: boolean, selected = false): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  selected,
  source: 'test',
  bundle: 'rhel',
  created: new Date().toISOString(),
});

const renderDrawerPanel = (notificationData: NotificationData[]) => {
  (useNotificationDrawer as jest.Mock).mockReturnValue({
    state: {
      notificationData,
      hasUnread: notificationData.some((n) => !n.read),
      ready: true,
      count: notificationData.length,
      filters: [],
      filterConfig: [],
      hasNotificationsPermissions: false,
      initializing: false,
    },
    addNotification: fn(),
    updateNotificationRead: fn(),
    updateSelectedStatus: fn(),
    updateNotificationsSelected: fn(),
    updateNotificationSelected: fn(),
    setFilters: fn(),
  });

  return render(
    <MemoryRouter>
      <DrawerPanel panelRef={React.createRef()} toggleDrawer={fn()} />
    </MemoryRouter>
  );
};

describe('DrawerPanel bulk select checkbox', () => {
  it('shows unchecked state when no notifications are selected', () => {
    renderDrawerPanel([makeNotification('1', false, false), makeNotification('2', false, false)]);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBePartiallyChecked();
  });

  it('shows checked state when all notifications are selected', () => {
    renderDrawerPanel([makeNotification('1', false, true), makeNotification('2', false, true)]);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toBeChecked();
  });

  it('shows mixed/indeterminate state when some notifications are selected', () => {
    renderDrawerPanel([makeNotification('1', false, true), makeNotification('2', false, false)]);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toBePartiallyChecked();
  });

  it('shows mixed/indeterminate state when only one of many is selected', () => {
    renderDrawerPanel([
      makeNotification('1', false, true),
      makeNotification('2', false, false),
      makeNotification('3', false, false),
    ]);

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toBePartiallyChecked();
  });
});
