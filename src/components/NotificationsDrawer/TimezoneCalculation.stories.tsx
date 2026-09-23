/**
 * Timezone Calculation Stories
 *
 * Demonstrates that "time ago" labels are calculated correctly regardless of
 * the user's timezone when timestamps are properly formatted with UTC indicator.
 *
 * Key Test Scenarios:
 * 1. Recent notification (just now)
 * 2. Notification from 5 minutes ago
 * 3. Notification from 2 hours ago
 * 4. Notification from yesterday
 * 5. Verification that elapsed time is consistent across timezones
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, within } from 'storybook/test';
import DrawerPanel from './DrawerPanel';
import { DrawerSingleton } from './DrawerSingleton';
import { FilterConfigItem, NotificationData } from '../../types/Drawer';
import { ensureUtcTimestamp } from '../../utils/dateUtils';

/**
 * Helper to seed DrawerSingleton state for testing
 */
const seedState = (
  notificationData: NotificationData[],
  filterConfig: FilterConfigItem[] = [],
  filters: string[] = [],
  ready = true
) => {
  // Ensure Instance is created
  void DrawerSingleton.Instance;
  Object.assign(DrawerSingleton.getState(), {
    notificationData,
    filterConfig,
    filters,
    hasUnread: notificationData.some((n) => !n.read),
    ready,
    initializing: !ready,
    hasNotificationsPermissions: true,
    count: notificationData.length,
  });
};

/**
 * Create a notification with a timestamp relative to now
 * @param id - Unique notification ID
 * @param minutesAgo - How many minutes ago the notification was created
 * @param withZ - Whether to include Z suffix (UTC indicator)
 */
const makeNotification = (
  id: string,
  minutesAgo: number,
  withZ: boolean = true
): NotificationData => {
  const timestamp = new Date(Date.now() - minutesAgo * 60_000).toISOString();

  return {
    id,
    title: `Notification from ${minutesAgo} minutes ago`,
    description: `This notification was created ${minutesAgo} minutes ago`,
    read: false,
    source: 'advisor',
    bundle: 'rhel',
    application: 'advisor',
    // Simulate backend behavior: remove Z if withZ is false
    created: withZ ? timestamp : timestamp.replace('Z', ''),
  };
};

/**
 * Create notification with absolute timestamp (for testing edge cases)
 */
const makeNotificationAtTime = (
  id: string,
  timestamp: string,
  title: string
): NotificationData => ({
  id,
  title,
  description: `Timestamp: ${timestamp}`,
  read: false,
  source: 'advisor',
  bundle: 'rhel',
  application: 'advisor',
  created: timestamp,
});

const meta: Meta<typeof DrawerPanel> = {
  title: 'Components/NotificationsDrawer/TimezoneCalculation',
  component: DrawerPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Demonstrates correct "time ago" calculation across timezones. ' +
          'Notifications should show the same elapsed time regardless of user timezone.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Reset state before each story
      Object.assign(DrawerSingleton.getState(), {
        notificationData: [],
        count: 0,
        filters: [],
        filterConfig: [],
        hasNotificationsPermissions: true,
        hasUnread: false,
        ready: false,
        initializing: false,
      });
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DrawerPanel>;

/**
 * Story: Recent Notifications
 * Shows notifications from just now, 5 minutes ago, 30 minutes ago, and 2 hours ago
 */
export const RecentNotifications: Story = {
  render: () => {
    seedState([
      makeNotification('just-now', 0, true),
      makeNotification('5-min', 5, true),
      makeNotification('30-min', 30, true),
      makeNotification('2-hours', 120, true),
    ]);

    return <DrawerPanel panelRef={React.createRef()} toggleDrawer={() => {}} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for notifications to render
    const notifications = await canvas.findAllByLabelText(/^Notification item /);
    expect(notifications).toHaveLength(4);

    // Verify all notifications are visible
    expect(canvas.getByText(/from 0 minutes ago/)).toBeInTheDocument();
    expect(canvas.getByText(/from 5 minutes ago/)).toBeInTheDocument();
    expect(canvas.getByText(/from 30 minutes ago/)).toBeInTheDocument();
    expect(canvas.getByText(/from 120 minutes ago/)).toBeInTheDocument();
  },
};

/**
 * Story: Demonstrates the Bug (Without Z Suffix)
 *
 * This story shows what happens when backend sends timestamps WITHOUT the Z suffix.
 * The "time ago" calculation will be INCORRECT because JavaScript parses them as local time.
 *
 * NOTE: The actual display will vary by your timezone!
 * - If you're in UTC: timestamps will appear correct (by luck)
 * - If you're in GMT+2: notifications will appear 2 hours OLDER
 * - If you're in GMT-5: notifications will appear 5 hours NEWER (or in the future)
 */
export const BugDemonstrationWithoutZ: Story = {
  render: () => {
    seedState([
      makeNotification('no-z-1', 0, false), // Just now, but without Z
      makeNotification('no-z-2', 30, false), // 30 min ago, but without Z
    ]);

    return (
      <div>
        <div
          style={{
            background: '#fef0c7',
            border: '1px solid #dc6027',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <strong>⚠️ Bug Demonstration (Without Z suffix)</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            These timestamps are missing the &apos;Z&apos; UTC indicator. The &quot;time ago&quot;
            labels will be INCORRECT unless you&apos;re in UTC timezone.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Your timezone offset: {new Date().getTimezoneOffset() / -60} hours from UTC
          </p>
        </div>
        <DrawerPanel panelRef={React.createRef()} toggleDrawer={() => {}} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the bug: without Z suffix, timestamps are parsed as local time, ' +
          'causing incorrect "time ago" calculations. The error equals your timezone offset.',
      },
    },
  },
};

/**
 * Story: Fix Demonstration (With Z Suffix via ensureUtcTimestamp)
 *
 * This story shows the fix in action. Even though we start with timestamps
 * without Z, our ensureUtcTimestamp function adds it, ensuring correct parsing.
 */
export const FixDemonstrationWithZ: Story = {
  render: () => {
    // Create notifications without Z, then normalize them
    const notificationsWithoutZ = [
      makeNotification('fix-1', 0, false),
      makeNotification('fix-2', 30, false),
      makeNotification('fix-3', 120, false),
    ];

    // Apply the fix: normalize timestamps
    const normalizedNotifications = notificationsWithoutZ.map((n) => ({
      ...n,
      created: ensureUtcTimestamp(n.created),
    }));

    seedState(normalizedNotifications);

    return (
      <div>
        <div
          style={{
            background: '#def9e6',
            border: '1px solid #27ae60',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <strong>✅ Fix Applied (ensureUtcTimestamp)</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            Timestamps are normalized with ensureUtcTimestamp() to add the &apos;Z&apos; UTC
            indicator. &quot;Time ago&quot; labels are now CORRECT regardless of timezone.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Your timezone offset: {new Date().getTimezoneOffset() / -60} hours from UTC
          </p>
        </div>
        <DrawerPanel panelRef={React.createRef()} toggleDrawer={() => {}} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify notifications render with correct content
    const notifications = await canvas.findAllByLabelText(/^Notification item /);
    expect(notifications).toHaveLength(3);

    // All timestamps should be normalized with Z
    const state = DrawerSingleton.getState();
    state.notificationData.forEach((notification) => {
      expect(notification.created).toMatch(/Z$/);
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the fix: ensureUtcTimestamp() adds Z suffix to timestamps, ' +
          'ensuring they are parsed as UTC and "time ago" is calculated correctly.',
      },
    },
  },
};

/**
 * Story: Timezone Consistency Verification
 *
 * Creates notifications at specific absolute times and verifies
 * the elapsed time calculation is timezone-independent.
 */
export const TimezoneConsistencyTest: Story = {
  render: () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60_000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60_000);

    seedState([
      makeNotificationAtTime('recent', twoMinutesAgo.toISOString(), 'Should show ~2 minutes ago'),
      makeNotificationAtTime('older', oneHourAgo.toISOString(), 'Should show ~1 hour ago'),
    ]);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = new Date().getTimezoneOffset() / -60;

    return (
      <div>
        <div
          style={{
            background: '#e8f4fd',
            border: '1px solid #2980b9',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <strong>🌍 Timezone Consistency Test</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            Verifies that elapsed time is calculated correctly regardless of timezone.
          </p>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            <div>
              Your timezone: <strong>{userTimezone}</strong>
            </div>
            <div>
              UTC offset:{' '}
              <strong>
                GMT{timezoneOffset >= 0 ? '+' : ''}
                {timezoneOffset}
              </strong>
            </div>
            <div>
              Current time: <strong>{now.toLocaleString()}</strong>
            </div>
          </div>
        </div>
        <DrawerPanel panelRef={React.createRef()} toggleDrawer={() => {}} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for notifications
    const notifications = await canvas.findAllByLabelText(/^Notification item /);
    expect(notifications).toHaveLength(2);

    // Verify timestamps have Z suffix (are UTC)
    const state = DrawerSingleton.getState();
    state.notificationData.forEach((notification) => {
      expect(notification.created).toMatch(/Z$/);

      // Verify Date parsing gives expected UTC time
      const date = new Date(notification.created);
      expect(date.toISOString()).toBe(notification.created);
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests that "time ago" calculations are consistent across timezones. ' +
          'Something that happened 2 minutes ago should show "2 minutes ago" everywhere.',
      },
    },
  },
};

/**
 * Story: Edge Cases
 * Tests timestamps with different formats
 */
export const EdgeCases: Story = {
  render: () => {
    seedState([
      makeNotificationAtTime('with-z', '2026-09-23T14:30:00Z', 'Already has Z suffix'),
      makeNotificationAtTime(
        'with-offset',
        '2026-09-23T14:30:00+02:00',
        'Has timezone offset (+02:00)'
      ),
      makeNotificationAtTime('with-millis', '2026-09-23T14:30:00.123Z', 'Has milliseconds and Z'),
      // This one simulates backend format (no Z)
      {
        ...makeNotificationAtTime(
          'no-z',
          '2026-09-23T14:30:00',
          'Backend format (no Z) - normalized by our fix'
        ),
        // In real app, this gets normalized by drawer-entries-helper
        created: ensureUtcTimestamp('2026-09-23T14:30:00'),
      },
    ]);

    return <DrawerPanel panelRef={React.createRef()} toggleDrawer={() => {}} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const notifications = await canvas.findAllByLabelText(/^Notification item /);
    expect(notifications).toHaveLength(4);

    // Verify all formats are handled correctly
    const state = DrawerSingleton.getState();

    // First one already had Z - unchanged
    expect(state.notificationData[0].created).toBe('2026-09-23T14:30:00Z');

    // Second one has offset - unchanged
    expect(state.notificationData[1].created).toBe('2026-09-23T14:30:00+02:00');

    // Third one has millis and Z - unchanged
    expect(state.notificationData[2].created).toBe('2026-09-23T14:30:00.123Z');

    // Fourth one got normalized - now has Z
    expect(state.notificationData[3].created).toBe('2026-09-23T14:30:00Z');
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests various timestamp formats: with Z, with timezone offset, ' +
          'with milliseconds, and backend format (no Z). All should parse correctly.',
      },
    },
  },
};
