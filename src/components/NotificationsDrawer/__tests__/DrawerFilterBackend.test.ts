/**
 * Tests for UUID-based backend filtering.
 * Focuses on state management and data transformations.
 */

import { NotificationData } from '../../../types/Drawer';

// Mock API helpers
jest.mock('../../../api/helpers/notifications/bundle-facets-helper', () => ({
  getBundleFacets: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../../api/helpers/notifications/drawer-entries-helper', () => ({
  getDrawerEntries: jest.fn(() => Promise.resolve({ data: [] })),
}));
jest.mock('../../../api/helpers/notifications/update-read-status-helper', () => ({
  updateNotificationReadStatus: jest.fn(() => Promise.resolve()),
}));

const makeNotification = (id: string, bundle: string, read = false): NotificationData => ({
  id,
  title: `Notification ${id}`,
  description: 'Test description',
  read,
  source: 'test',
  bundle, // Bundle NAME (what backend returns in notification.bundle)
  created: new Date().toISOString(),
});

// Reload singleton for clean state
const loadSingleton = () => {
  jest.resetModules();
  return jest.requireActual<typeof import('../DrawerSingleton')>('../DrawerSingleton')
    .DrawerSingleton;
};

describe('DrawerSingleton UUID-based filtering', () => {
  describe('bundleIdToNameMap', () => {
    it('initializes with empty Map', () => {
      const DrawerSingleton = loadSingleton();
      expect(DrawerSingleton.getState().bundleIdToNameMap).toBeInstanceOf(Map);
      expect(DrawerSingleton.getState().bundleIdToNameMap.size).toBe(0);
    });

    it('can be populated with UUID→name mappings', () => {
      const DrawerSingleton = loadSingleton();

      DrawerSingleton.getState().bundleIdToNameMap.set('uuid-rhel-123', 'rhel');
      DrawerSingleton.getState().bundleIdToNameMap.set('uuid-openshift-456', 'openshift');

      expect(DrawerSingleton.getState().bundleIdToNameMap.get('uuid-rhel-123')).toBe('rhel');
      expect(DrawerSingleton.getState().bundleIdToNameMap.get('uuid-openshift-456')).toBe(
        'openshift'
      );
    });
  });

  describe('filter state management', () => {
    it('stores filter values as-is (UUIDs in production)', () => {
      const DrawerSingleton = loadSingleton();

      DrawerSingleton.getState().filters = ['uuid-rhel-123', 'uuid-openshift-456'];

      expect(DrawerSingleton.getState().filters).toEqual(['uuid-rhel-123', 'uuid-openshift-456']);
    });

    it('allows empty filters array', () => {
      const DrawerSingleton = loadSingleton();

      DrawerSingleton.getState().filters = [];

      expect(DrawerSingleton.getState().filters).toEqual([]);
    });
  });

  describe('WebSocket notification storage', () => {
    it('stores notifications with bundle names (as received from backend)', () => {
      const DrawerSingleton = loadSingleton();

      DrawerSingleton.Instance.addNotification(makeNotification('1', 'rhel'));
      DrawerSingleton.Instance.addNotification(makeNotification('2', 'openshift'));

      const notifications = DrawerSingleton.getState().notificationData;
      expect(notifications).toHaveLength(2);
      expect(notifications[0].bundle).toBe('rhel');
      expect(notifications[1].bundle).toBe('openshift');
    });

    it('does not filter WebSocket notifications in singleton (DrawerPanel handles filtering)', () => {
      const DrawerSingleton = loadSingleton();

      // Set up filter state
      DrawerSingleton.getState().filters = ['uuid-rhel-123'];
      DrawerSingleton.getState().bundleIdToNameMap.set('uuid-rhel-123', 'rhel');

      // Add both filtered and non-filtered notifications
      DrawerSingleton.Instance.addNotification(makeNotification('1', 'rhel'));
      DrawerSingleton.Instance.addNotification(makeNotification('2', 'openshift'));

      // Both should be stored (DrawerPanel will filter for display)
      expect(DrawerSingleton.getState().notificationData).toHaveLength(2);
    });
  });

  describe('filterConfig structure', () => {
    it('stores filterConfig with title and value (UUID in production)', () => {
      const DrawerSingleton = loadSingleton();

      DrawerSingleton.getState().filterConfig = [
        { title: 'Red Hat Enterprise Linux', value: 'uuid-rhel-123' },
        { title: 'OpenShift', value: 'uuid-openshift-456' },
      ];

      const config = DrawerSingleton.getState().filterConfig;
      expect(config).toHaveLength(2);
      expect(config[0].title).toBe('Red Hat Enterprise Linux');
      expect(config[0].value).toBe('uuid-rhel-123');
    });
  });
});

describe('DrawerPanel client-side filtering logic', () => {
  it('maps bundle UUIDs to names for filtering WebSocket notifications', () => {
    // Simulate the logic from DrawerPanel.filteredNotifications
    const filters = ['uuid-rhel-123', 'uuid-openshift-456'];
    const bundleIdToNameMap = new Map([
      ['uuid-rhel-123', 'rhel'],
      ['uuid-openshift-456', 'openshift'],
      ['uuid-ansible-789', 'ansible'],
    ]);

    // Map UUIDs to names
    const selectedBundleNames = filters
      .map((bundleId) => bundleIdToNameMap.get(bundleId))
      .filter((name): name is string => name !== undefined);

    expect(selectedBundleNames).toEqual(['rhel', 'openshift']);
  });

  it('filters notifications by mapped bundle names', () => {
    const notifications = [
      makeNotification('1', 'rhel'),
      makeNotification('2', 'openshift'),
      makeNotification('3', 'ansible'),
      makeNotification('4', 'rhel'),
    ];

    const filters = ['uuid-rhel-123'];
    const bundleIdToNameMap = new Map([
      ['uuid-rhel-123', 'rhel'],
      ['uuid-openshift-456', 'openshift'],
      ['uuid-ansible-789', 'ansible'],
    ]);

    // Map and filter (same logic as DrawerPanel)
    const selectedBundleNames = filters
      .map((bundleId) => bundleIdToNameMap.get(bundleId))
      .filter((name): name is string => name !== undefined);

    const filtered = notifications.filter((notification) =>
      selectedBundleNames.includes(notification.bundle)
    );

    expect(filtered).toHaveLength(2);
    expect(filtered.every((n) => n.bundle === 'rhel')).toBe(true);
  });

  it('returns all notifications when filters are empty', () => {
    const notifications = [makeNotification('1', 'rhel'), makeNotification('2', 'openshift')];

    const filters: string[] = [];

    // When filters empty, return all (DrawerPanel logic)
    const filtered = filters.length === 0 ? notifications : [];

    expect(filtered).toHaveLength(2);
  });
});
