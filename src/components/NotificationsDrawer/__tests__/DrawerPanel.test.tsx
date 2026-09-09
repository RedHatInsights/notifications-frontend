import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => React.createElement('div', null, children),
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

import DrawerPanel from '../DrawerPanel';
import { NotificationData } from '../../../types/Drawer';

const mockGetUser = jest.fn(() =>
  Promise.resolve({
    identity: { user: { is_org_admin: false } },
  })
);

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    addWsEventListener: () => fn(),
    auth: {
      getUser: mockGetUser,
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

const setDrawerData = (notificationData: NotificationData[]) => {
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
};

const drawerPanelTree = () => (
  <MemoryRouter>
    <DrawerPanel panelRef={React.createRef()} toggleDrawer={fn()} />
  </MemoryRouter>
);

const renderDrawerPanel = (notificationData: NotificationData[]) => {
  setDrawerData(notificationData);

  return render(drawerPanelTree());
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

describe('DrawerPanel live notification ordering', () => {
  const makeAged = (id: string, minutesAgo: number): NotificationData => ({
    ...makeNotification(id, false),
    created: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
  });

  const renderedTitles = () =>
    screen
      .getAllByLabelText(/^Notification item /)
      .map((item) => item.getAttribute('aria-label')?.replace('Notification item ', ''));

  it('puts a notification that arrives while the drawer is open at the top of the list', () => {
    const existing = [makeAged('1', 60), makeAged('2', 120), makeAged('3', 180)];
    const { rerender } = renderDrawerPanel(existing);

    expect(renderedTitles()).toEqual(['Notification 1', 'Notification 2', 'Notification 3']);

    // A live WS event appends to notificationData via DrawerSingleton.addNotification
    setDrawerData([...existing, makeAged('live', 0)]);
    rerender(drawerPanelTree());

    expect(renderedTitles()).toEqual([
      'Notification live',
      'Notification 1',
      'Notification 2',
      'Notification 3',
    ]);
  });

  it('keeps the order of already listed notifications stable as live ones arrive', () => {
    // Read notification sorts below the unread ones in the snapshot taken on open
    const existing = [makeNotification('read', true), makeAged('unread', 60)];
    const { rerender } = renderDrawerPanel(existing);

    expect(renderedTitles()).toEqual(['Notification unread', 'Notification read']);

    setDrawerData([...existing, makeAged('live', 0)]);
    rerender(drawerPanelTree());

    expect(renderedTitles()).toEqual([
      'Notification live',
      'Notification unread',
      'Notification read',
    ]);
  });

  it('orders multiple live notifications newest first', () => {
    const existing = [makeAged('1', 60)];
    const { rerender } = renderDrawerPanel(existing);

    setDrawerData([...existing, makeAged('older-live', 10), makeAged('newer-live', 1)]);
    rerender(drawerPanelTree());

    expect(renderedTitles()).toEqual([
      'Notification newer-live',
      'Notification older-live',
      'Notification 1',
    ]);
  });
});

describe('NotificationItem menu actions', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('clicking Manage event configuration navigates with bundle and tab=configuration (org admin)', async () => {
    // Set up admin user before rendering
    mockGetUser.mockResolvedValue({
      identity: { user: { is_org_admin: true } },
    });

    const notification = makeNotification('1', false);
    renderDrawerPanel([notification]);

    // Wait for component to mount and user to be fetched
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the notification item and click its kebab menu
    const notificationItem = screen.getByLabelText(`Notification item ${notification.title}`);
    const itemToggle = within(notificationItem).getByLabelText('Notification actions dropdown');
    await userEvent.click(itemToggle);

    // Wait for menu to appear and click the item
    const menuItem = await screen.findByRole('menuitem', { name: 'Manage event configuration' });
    await userEvent.click(menuItem);

    const url = mockNavigate.mock.calls[0][0] as string;
    expect(url).toContain('/settings/notifications/configure-events');
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('bundle')).toBe(notification.bundle);
    expect(params.get('tab')).toBe('configuration');
  });

  it('Manage my event notifications uses navigate with bundle and app', async () => {
    const notification = { ...makeNotification('1', false), application: 'advisor' };
    renderDrawerPanel([notification]);

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the notification item and click its kebab menu
    const notificationItem = screen.getByLabelText(`Notification item ${notification.title}`);
    const itemToggle = within(notificationItem).getByLabelText('Notification actions dropdown');
    await userEvent.click(itemToggle);

    // Click the menu item
    const menuItem = await screen.findByRole('menuitem', { name: 'Manage my event notifications' });
    await userEvent.click(menuItem);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    const url = mockNavigate.mock.calls[0][0];
    expect(url).toContain('/settings/notifications/user-preferences');
    expect(url).toContain('bundle=rhel');
    expect(url).toContain('app=advisor');
  });
});
