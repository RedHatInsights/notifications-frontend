import { NotificationData } from '../../../types/Drawer';

// subscribe() kicks off initialize(), which would otherwise hit the network
jest.mock('../../../api/helpers/notifications/bundle-facets-helper', () => ({
  getBundleFacets: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../../api/helpers/notifications/drawer-entries-helper', () => ({
  getDrawerEntries: jest.fn(() => Promise.resolve({ data: [] })),
}));

const makeNotification = (id: string, read = false): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  source: 'test',
  bundle: 'rhel',
  created: new Date().toISOString(),
});

// The singleton holds static state, so reload it for each test to start from a clean slate
const loadSingleton = () => {
  jest.resetModules();

  return jest.requireActual<typeof import('../DrawerSingleton')>('../DrawerSingleton')
    .DrawerSingleton;
};

describe('DrawerSingleton.addNotification', () => {
  it('adds a notification and flags the drawer as having unread entries', () => {
    const DrawerSingleton = loadSingleton();
    DrawerSingleton.Instance.addNotification(makeNotification('1'));

    expect(DrawerSingleton.getState().notificationData).toHaveLength(1);
    expect(DrawerSingleton.getState().hasUnread).toBe(true);
  });

  it('ignores a notification whose id is already in state', () => {
    const DrawerSingleton = loadSingleton();
    const notification = makeNotification('1');

    DrawerSingleton.Instance.addNotification(notification);
    DrawerSingleton.Instance.addNotification(notification);

    expect(DrawerSingleton.getState().notificationData).toHaveLength(1);
  });

  it('does not notify subscribers for a duplicate', () => {
    const DrawerSingleton = loadSingleton();
    const rerenderer = jest.fn();
    DrawerSingleton.subscribe(rerenderer);
    rerenderer.mockClear();

    DrawerSingleton.Instance.addNotification(makeNotification('1'));
    expect(rerenderer).toHaveBeenCalledTimes(1);

    DrawerSingleton.Instance.addNotification(makeNotification('1'));
    expect(rerenderer).toHaveBeenCalledTimes(1);
  });

  it('still adds distinct notifications', () => {
    const DrawerSingleton = loadSingleton();
    DrawerSingleton.Instance.addNotification(makeNotification('1'));
    DrawerSingleton.Instance.addNotification(makeNotification('2'));

    expect(DrawerSingleton.getState().notificationData.map((n) => n.id)).toEqual(['1', '2']);
  });
});

describe('DrawerSingleton live notification cap', () => {
  // Minute-spaced timestamps, oldest first: aged(0) is the oldest
  const aged = (id: string, index: number, read = false): NotificationData => ({
    ...makeNotification(id, read),
    created: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
  });

  const fillToCap = (DrawerSingleton: ReturnType<typeof loadSingleton>) => {
    for (let i = 0; i < 50; i++) {
      DrawerSingleton.Instance.addNotification(aged(`${i}`, i));
    }
  };

  it('keeps at most 50 notifications as live ones arrive', () => {
    const DrawerSingleton = loadSingleton();
    fillToCap(DrawerSingleton);
    expect(DrawerSingleton.getState().notificationData).toHaveLength(50);

    DrawerSingleton.Instance.addNotification(aged('live-1', 100));
    DrawerSingleton.Instance.addNotification(aged('live-2', 101));

    expect(DrawerSingleton.getState().notificationData).toHaveLength(50);
  });

  it('evicts the oldest notification and keeps the newest arrival', () => {
    const DrawerSingleton = loadSingleton();
    fillToCap(DrawerSingleton);

    DrawerSingleton.Instance.addNotification(aged('live', 100));

    const ids = DrawerSingleton.getState().notificationData.map((n) => n.id);
    expect(ids).toContain('live');
    expect(ids).not.toContain('0');
    expect(ids).toContain('1');
  });

  it('evicts by creation time, not arrival order', () => {
    const DrawerSingleton = loadSingleton();
    fillToCap(DrawerSingleton);

    // A late-arriving but older-than-everything notification is the one that drops out
    DrawerSingleton.Instance.addNotification(aged('stale', -100));

    const ids = DrawerSingleton.getState().notificationData.map((n) => n.id);
    expect(ids).not.toContain('stale');
    expect(ids).toContain('0');
  });

  it('caps the unread count that drives the bell badge', () => {
    const DrawerSingleton = loadSingleton();
    for (let i = 0; i < 60; i++) {
      DrawerSingleton.Instance.addNotification(aged(`${i}`, i));
    }

    const unread = DrawerSingleton.getState().notificationData.filter((n) => !n.read);
    expect(unread).toHaveLength(50);
  });
});
