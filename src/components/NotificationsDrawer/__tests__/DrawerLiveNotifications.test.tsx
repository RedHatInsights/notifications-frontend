import { act, render, screen } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => React.createElement('div', null, children),
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

// Captures whatever DrawerSingleton registers so a test can play the part of chrome's socket
const mockWsListeners: Record<string, (event: { data: NotificationData }) => void> = {};

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => () => ({
  addWsEventListener: (type: string, callback: (event: { data: NotificationData }) => void) => {
    mockWsListeners[type] = callback;
    return () => delete mockWsListeners[type];
  },
  auth: {
    getUser: () => Promise.resolve({ identity: { user: { is_org_admin: false } } }),
  },
}));

const mockGetDrawerEntries = jest.fn();
jest.mock('../../../api/helpers/notifications/bundle-facets-helper', () => ({
  getBundleFacets: () => Promise.resolve([]),
}));
jest.mock('../../../api/helpers/notifications/drawer-entries-helper', () => ({
  getDrawerEntries: () => mockGetDrawerEntries(),
}));

import DrawerPanel from '../DrawerPanel';
import { DrawerSingleton } from '../DrawerSingleton';
import { NotificationData } from '../../../types/Drawer';

const WS_EVENT_TYPE = 'com.redhat.console.notifications.drawer';

const makeNotification = (id: string, minutesAgo: number, read = false): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  source: 'test',
  bundle: 'rhel',
  created: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
});

const renderedTitles = () =>
  screen
    .getAllByLabelText(/^Notification item /)
    .map((item) => item.getAttribute('aria-label')?.replace('Notification item ', ''));

// Play the part of chrome delivering a drawer event over the socket
const emitWsEvent = (data: NotificationData) =>
  act(() => {
    mockWsListeners[WS_EVENT_TYPE]({ data });
  });

const renderDrawer = async (seeded: NotificationData[]) => {
  mockGetDrawerEntries.mockResolvedValue({ data: seeded });
  render(
    <MemoryRouter>
      <DrawerPanel panelRef={React.createRef()} toggleDrawer={jest.fn()} />
    </MemoryRouter>
  );
  // The panel renders a spinner until DrawerSingleton finishes its initial fetch
  await screen.findAllByLabelText(/^Notification item /);
};

describe('drawer live notifications over the websocket', () => {
  beforeEach(() => {
    // DrawerSingleton keeps its state in statics that outlive a single render
    Object.assign(DrawerSingleton.getState(), {
      notificationData: [],
      count: 0,
      filters: [],
      filterConfig: [],
      hasNotificationsPermissions: false,
      hasUnread: false,
      ready: false,
      initializing: false,
    });
    Object.keys(mockWsListeners).forEach((key) => delete mockWsListeners[key]);
    mockGetDrawerEntries.mockReset();
  });

  it('registers exactly one listener for the drawer event', async () => {
    await renderDrawer([makeNotification('1', 60)]);

    expect(Object.keys(mockWsListeners)).toEqual([WS_EVENT_TYPE]);
  });

  it('renders a notification that arrives while the drawer is open at the top', async () => {
    await renderDrawer([makeNotification('1', 60), makeNotification('2', 120)]);
    expect(renderedTitles()).toEqual(['Notification 1', 'Notification 2']);

    emitWsEvent(makeNotification('live', 0));

    expect(renderedTitles()).toEqual(['Notification live', 'Notification 1', 'Notification 2']);
  });

  it('keeps the newest live notification on top as more arrive', async () => {
    await renderDrawer([makeNotification('1', 60)]);

    emitWsEvent(makeNotification('live-one', 10));
    emitWsEvent(makeNotification('live-two', 1));

    expect(renderedTitles()).toEqual([
      'Notification live-two',
      'Notification live-one',
      'Notification 1',
    ]);
  });

  it('renders a redelivered notification once', async () => {
    await renderDrawer([makeNotification('1', 60)]);
    const live = makeNotification('live', 0);

    emitWsEvent(live);
    emitWsEvent(live);

    expect(renderedTitles()).toEqual(['Notification live', 'Notification 1']);
  });

  it('renders a live notification that matches an active filter', async () => {
    await renderDrawer([makeNotification('1', 60)]);
    // The filtered list is memoized on the notificationData reference, so an in-place push
    // would leave it stale and the live notification would never appear
    act(() => {
      DrawerSingleton.Instance.setFilters(['rhel']);
    });
    expect(renderedTitles()).toEqual(['Notification 1']);

    emitWsEvent(makeNotification('live', 0));

    expect(renderedTitles()).toEqual(['Notification live', 'Notification 1']);
  });

  it('flags unread when a live notification arrives', async () => {
    await renderDrawer([makeNotification('1', 60, true)]);
    expect(DrawerSingleton.getState().hasUnread).toBe(false);

    emitWsEvent(makeNotification('live', 0));

    expect(DrawerSingleton.getState().hasUnread).toBe(true);
  });
});
