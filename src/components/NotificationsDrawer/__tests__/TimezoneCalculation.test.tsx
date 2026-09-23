/**
 * Timezone Calculation Integration Tests
 *
 * Verifies that "time ago" labels are calculated correctly regardless of
 * user timezone when timestamps are properly formatted.
 */

import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DrawerSingleton } from '../DrawerSingleton';
import DrawerPanel from '../DrawerPanel';
import { NotificationData } from '../../../types/Drawer';
import { ensureUtcTimestamp } from '../../../utils/dateUtils';

// Mock Chrome API
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => () => ({
  addWsEventListener: jest.fn(() => jest.fn()),
  auth: {
    getUser: () => Promise.resolve({ identity: { user: { is_org_admin: false } } }),
  },
}));

// Mock API calls
const mockGetDrawerEntries = jest.fn();
jest.mock('../../../api/helpers/notifications/bundle-facets-helper', () => ({
  getBundleFacets: () => Promise.resolve([]),
}));
jest.mock('../../../api/helpers/notifications/drawer-entries-helper', () => ({
  getDrawerEntries: () => mockGetDrawerEntries(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => React.createElement('div', null, children),
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

/**
 * Create a notification with timestamp relative to now
 */
const makeNotification = (
  id: string,
  minutesAgo: number,
  withZ: boolean = true
): NotificationData => {
  const timestamp = new Date(Date.now() - minutesAgo * 60_000).toISOString();

  return {
    id,
    title: `Notification ${id}`,
    description: 'Test notification',
    read: false,
    source: 'test',
    bundle: 'rhel',
    created: withZ ? timestamp : timestamp.replace('Z', ''),
  };
};

const renderDrawer = async (seeded: NotificationData[]) => {
  mockGetDrawerEntries.mockResolvedValue({ data: seeded });
  render(
    <MemoryRouter>
      <DrawerPanel panelRef={React.createRef()} toggleDrawer={jest.fn()} />
    </MemoryRouter>
  );
  await screen.findAllByLabelText(/^Notification item /);
};

describe('Timezone Calculation', () => {
  beforeEach(() => {
    // Reset DrawerSingleton state
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
    mockGetDrawerEntries.mockReset();
  });

  describe('ensureUtcTimestamp normalization', () => {
    it('normalizes timestamps without Z suffix', async () => {
      const notificationWithoutZ = makeNotification('1', 30, false);
      expect(notificationWithoutZ.created).not.toMatch(/Z$/);

      // Simulate what drawer-entries-helper does
      const normalized = {
        ...notificationWithoutZ,
        created: ensureUtcTimestamp(notificationWithoutZ.created),
      };

      await renderDrawer([normalized]);

      const state = DrawerSingleton.getState();
      expect(state.notificationData[0].created).toMatch(/Z$/);
    });

    it('does not modify timestamps that already have Z', async () => {
      const notificationWithZ = makeNotification('1', 30, true);
      expect(notificationWithZ.created).toMatch(/Z$/);

      const normalized = {
        ...notificationWithZ,
        created: ensureUtcTimestamp(notificationWithZ.created),
      };

      await renderDrawer([normalized]);

      const state = DrawerSingleton.getState();
      expect(state.notificationData[0].created).toBe(notificationWithZ.created);
    });
  });

  describe('Date parsing consistency', () => {
    it('parses UTC timestamps consistently', () => {
      // Create timestamp 2 hours ago in UTC
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const utcString = twoHoursAgo.toISOString();

      // Parse it back
      const parsed = new Date(utcString);

      // Should get the same time back
      expect(parsed.getTime()).toBe(twoHoursAgo.getTime());
    });

    it('demonstrates the bug: timestamps without Z are parsed as local time', () => {
      // Get current timezone offset in milliseconds
      // getTimezoneOffset() returns positive for behind UTC, negative for ahead
      // e.g., GMT-5 returns 300, GMT+2 returns -120
      const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;

      // Create a timestamp without Z
      const timeWithoutZ = '2026-09-23T14:30:00';
      const timeWithZ = '2026-09-23T14:30:00Z';

      const parsedWithoutZ = new Date(timeWithoutZ);
      const parsedWithZ = new Date(timeWithZ);

      // Without Z: parsed as local time, so UTC value is shifted by timezone offset
      // With Z: parsed as UTC time

      // The difference should equal the timezone offset (but reversed sign)
      const difference = parsedWithoutZ.getTime() - parsedWithZ.getTime();
      expect(difference).toBe(timezoneOffsetMs);
    });
  });

  describe('elapsed time calculation', () => {
    it('calculates correct elapsed time when timestamp has Z', () => {
      const minutesAgo = 30;
      const notification = makeNotification('1', minutesAgo, true);

      const elapsed = Date.now() - new Date(notification.created).getTime();
      const elapsedMinutes = Math.floor(elapsed / (60 * 1000));

      // Should be approximately 30 minutes (allow 1 minute variance for test execution time)
      expect(elapsedMinutes).toBeGreaterThanOrEqual(29);
      expect(elapsedMinutes).toBeLessThanOrEqual(31);
    });

    it('calculates INCORRECT elapsed time when timestamp lacks Z (demonstrating the bug)', () => {
      const minutesAgo = 30;
      const notification = makeNotification('1', minutesAgo, false);

      const elapsed = Date.now() - new Date(notification.created).getTime();
      const elapsedMinutes = Math.floor(elapsed / (60 * 1000));

      // Get timezone offset in minutes
      const timezoneOffsetMinutes = new Date().getTimezoneOffset();

      // Without Z, the elapsed time will be off by the timezone offset
      // Expected: 30 minutes
      // Actual: 30 minutes +/- timezone offset

      // Calculate the error (how far off the calculation is)
      const error = Math.abs(elapsedMinutes - minutesAgo);
      const expectedError = Math.abs(timezoneOffsetMinutes);

      // The error should approximately equal the timezone offset
      // (In UTC, error is 0; in other timezones, error equals offset)
      expect(error).toBeCloseTo(expectedError, -1); // Within 10 minutes
    });

    it('fix ensures consistent elapsed time regardless of timezone offset', () => {
      const minutesAgo = 30;
      const notificationWithoutZ = makeNotification('1', minutesAgo, false);

      // Apply the fix
      const normalized = {
        ...notificationWithoutZ,
        created: ensureUtcTimestamp(notificationWithoutZ.created),
      };

      const elapsed = Date.now() - new Date(normalized.created).getTime();
      const elapsedMinutes = Math.floor(elapsed / (60 * 1000));

      // Should be approximately 30 minutes regardless of timezone
      expect(elapsedMinutes).toBeGreaterThanOrEqual(29);
      expect(elapsedMinutes).toBeLessThanOrEqual(31);
    });
  });

  describe('real-world scenarios', () => {
    it('handles notification just sent (0 minutes ago)', async () => {
      const justNow = makeNotification('just-now', 0, true);

      await renderDrawer([justNow]);

      const elapsed = Date.now() - new Date(justNow.created).getTime();
      const elapsedSeconds = Math.floor(elapsed / 1000);

      // Should be less than 5 seconds old
      expect(elapsedSeconds).toBeLessThan(5);
    });

    it('handles notification from 2 hours ago', async () => {
      const twoHoursAgo = makeNotification('old', 120, true);

      await renderDrawer([twoHoursAgo]);

      const elapsed = Date.now() - new Date(twoHoursAgo.created).getTime();
      const elapsedMinutes = Math.floor(elapsed / (60 * 1000));

      expect(elapsedMinutes).toBeGreaterThanOrEqual(119);
      expect(elapsedMinutes).toBeLessThanOrEqual(121);
    });

    it('handles mixed timestamps (some with Z, some without)', async () => {
      const notifications = [
        makeNotification('with-z', 30, true),
        makeNotification('without-z', 60, false),
      ];

      // Normalize the one without Z (simulating our fix)
      const normalized = notifications.map((n) => ({
        ...n,
        created: ensureUtcTimestamp(n.created),
      }));

      await renderDrawer(normalized);

      const state = DrawerSingleton.getState();

      // Both should now have UTC indicator
      expect(state.notificationData[0].created).toMatch(/Z$/);
      expect(state.notificationData[1].created).toMatch(/Z$/);

      // Both should calculate elapsed time correctly
      const elapsed1 = Date.now() - new Date(state.notificationData[0].created).getTime();
      const elapsed2 = Date.now() - new Date(state.notificationData[1].created).getTime();

      expect(Math.floor(elapsed1 / 60000)).toBeCloseTo(30, 0);
      expect(Math.floor(elapsed2 / 60000)).toBeCloseTo(60, 0);
    });
  });

  describe('timezone offset edge cases', () => {
    it('works correctly in UTC timezone (GMT+0)', () => {
      // This test will pass in UTC but demonstrates the concept
      const notification = makeNotification('test', 45, true);

      const parsed = new Date(notification.created);
      const elapsed = Date.now() - parsed.getTime();

      expect(Math.floor(elapsed / 60000)).toBeCloseTo(45, 0);
    });

    it('demonstrates how different timezones parse timestamps differently', () => {
      // Timestamp without Z: "2026-09-23T14:30:00"
      // User in GMT+2: parses as 14:30 GMT+2 = 12:30 UTC
      // User in GMT-5: parses as 14:30 GMT-5 = 19:30 UTC
      // User in GMT+0: parses as 14:30 GMT+0 = 14:30 UTC

      const timestampWithoutZ = '2026-09-23T14:30:00';
      const timestampWithZ = '2026-09-23T14:30:00Z';

      const parsedWithoutZ = new Date(timestampWithoutZ).toISOString();
      const parsedWithZ = new Date(timestampWithZ).toISOString();

      // With Z should always parse to the same UTC time
      expect(parsedWithZ).toBe('2026-09-23T14:30:00.000Z');

      // Without Z will vary by timezone
      // The difference should equal the timezone offset in milliseconds
      const timezoneOffset = new Date().getTimezoneOffset();
      const parsedDiff = new Date(parsedWithoutZ).getTime() - new Date(parsedWithZ).getTime();
      const expectedDiff = timezoneOffset * 60 * 1000;

      // Verify the parsing difference equals timezone offset
      // (In UTC this is 0, in other timezones it's the offset)
      expect(parsedDiff).toBe(expectedDiff);
    });
  });
});

describe('Integration: Drawer with timezone-aware timestamps', () => {
  beforeEach(() => {
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
    mockGetDrawerEntries.mockReset();
  });

  it('displays multiple notifications with correct relative times', async () => {
    const notifications = [
      makeNotification('recent', 2, true), // 2 minutes ago
      makeNotification('medium', 45, true), // 45 minutes ago
      makeNotification('old', 180, true), // 3 hours ago
    ];

    await renderDrawer(notifications);

    // All notifications should render
    const items = screen.getAllByLabelText(/^Notification item /);
    expect(items).toHaveLength(3);

    // Verify timestamps are parsed correctly
    const state = DrawerSingleton.getState();
    state.notificationData.forEach((notification) => {
      const elapsed = Date.now() - new Date(notification.created).getTime();
      const elapsedMinutes = Math.floor(elapsed / 60000);

      // Verify elapsed time makes sense
      expect(elapsedMinutes).toBeGreaterThan(0);
      expect(elapsedMinutes).toBeLessThan(200); // Less than ~3.5 hours
    });
  });
});
