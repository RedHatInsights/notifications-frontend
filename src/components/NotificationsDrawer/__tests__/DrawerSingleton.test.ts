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
