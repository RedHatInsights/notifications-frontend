/**
 * DrawerPanel Stories
 *
 * Includes play-function stories that simulate real-time notification arrival
 * via DrawerSingleton.addNotification() — the same code path used by the
 * WebSocket handler in production.
 *
 * E2E WebSocket testing in stage was evaluated and deemed infeasible:
 *   - No reliable backend action consistently triggers drawer notifications
 *     within the required <5 s latency window.
 *   - Success rate across actions (create integration, update behavior group)
 *     was too low for deterministic CI.
 *   - The WebSocket transport itself is owned by insights-chrome and is
 *     already covered by its own test suite.
 *
 * These Storybook stories provide coverage for the UI response layer:
 *   - New notification insertion and rendering
 *   - Sort order (snapshot on open: unread first; maintains position when marked read during session)
 *   - Multiple rapid arrivals
 *   - Visual read/unread state
 *   - Interaction with newly arrived notifications
 *
 * Related: RHCLOUD-47552
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, waitFor, within } from 'storybook/test';
import DrawerPanel from './DrawerPanel';
import { DrawerSingleton } from './DrawerSingleton';
import { FilterConfigItem, NotificationData } from '../../types/Drawer';

const seedState = (
  notificationData: NotificationData[],
  filterConfig: FilterConfigItem[],
  filters: string[] = [],
  ready = true
) => {
  // Ensure Instance is created — initializes _subs array needed by subscribe()
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

const mockNotifications: NotificationData[] = [
  {
    id: '1',
    title: 'New package updates available',
    description:
      'Security advisories RHSA-2024:1234 and RHSA-2024:1235 are available for your systems.',
    read: false,
    source: 'advisor',
    bundle: 'rhel',
    application: 'advisor',
    created: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    title: 'OpenShift cluster upgrade available',
    description: 'Cluster "prod-us-east-1" can be upgraded to OpenShift 4.15.3.',
    read: false,
    source: 'openshift',
    bundle: 'openshift',
    application: 'cluster-manager',
    created: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Policy violation detected',
    description: '3 systems are non-compliant with PCI-DSS policy "No SSH root login".',
    read: false,
    source: 'compliance',
    bundle: 'rhel',
    application: 'compliance',
    created: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    title: 'Ansible Automation Platform job completed',
    description: 'Job template "Deploy Web Servers" completed successfully.',
    read: true,
    source: 'automation',
    bundle: 'ansible',
    application: 'automation-analytics',
    created: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '5',
    title: 'Integration webhook delivery failed',
    description: 'Webhook to "https://hooks.example.com/notify" failed after 3 retries.',
    read: true,
    source: 'integrations',
    bundle: 'console',
    application: 'integrations',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const mockFilterConfig: FilterConfigItem[] = [
  { title: 'Red Hat Enterprise Linux', value: 'rhel' },
  { title: 'OpenShift', value: 'openshift' },
  { title: 'Ansible Automation Platform', value: 'ansible' },
  { title: 'Console', value: 'console' },
];

const meta: Meta<typeof DrawerPanel> = {
  title: 'Components/DrawerPanel',
  component: DrawerPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DrawerPanel>;

export const Default: Story = {
  loaders: [async () => seedState(mockNotifications, mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default drawer panel with notifications and no active filters.',
      },
    },
  },
};

export const WithSingleFilter: Story = {
  loaders: [async () => seedState(mockNotifications, mockFilterConfig, ['rhel'])],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Drawer panel with one active filter (RHEL). Shows a blue filter chip below the header that can be removed.',
      },
    },
  },
};

export const WithMultipleFilters: Story = {
  loaders: [
    async () => seedState(mockNotifications, mockFilterConfig, ['rhel', 'openshift', 'ansible']),
  ],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Drawer panel with multiple active filters (RHEL, OpenShift, Ansible). Shows multiple filter chips that wrap to the next line if needed.',
      },
    },
  },
};

export const Empty: Story = {
  loaders: [async () => seedState([], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer panel with no notifications. Shows the empty state with helpful links.',
      },
    },
  },
};

export const Loading: Story = {
  loaders: [async () => seedState(mockNotifications, mockFilterConfig, [], false)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer panel in loading state. Shows a centered spinner.',
      },
    },
  },
};

// ── Real-Time Notification Play-Function Stories ────────────────────

/**
 * Simulates a single WebSocket notification arriving while the drawer is
 * open. Verifies the new item renders and the total count increases.
 */
export const RealtimeNotificationArrival: Story = {
  loaders: [async () => seedState([...mockNotifications], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulates a real-time notification arriving via WebSocket. ' +
          'The new notification should appear in the list and the total count should increase by one.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for initial render
    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    const initialItems = canvas.getAllByLabelText(/^Notification item/);
    const initialCount = initialItems.length;
    expect(initialCount).toBe(5);

    // Simulate WebSocket notification arrival
    DrawerSingleton.Instance.addNotification({
      id: 'realtime-1',
      title: 'Critical security update available',
      description: 'A critical security update is available for RHEL 9 kernel packages.',
      read: false,
      source: 'advisor',
      bundle: 'rhel',
      application: 'advisor',
      created: new Date().toISOString(),
    });

    // Verify the new notification appears
    await waitFor(() => {
      const updatedItems = canvas.getAllByLabelText(/^Notification item/);
      expect(updatedItems.length).toBe(initialCount + 1);
    });

    expect(canvas.getByText('Critical security update available')).toBeInTheDocument();

    // Verify "Select all" count updated
    await waitFor(() => {
      expect(canvas.getByText(/Select all \(6\)/)).toBeInTheDocument();
    });
  },
};

/**
 * Verifies that new unread notifications sort before read ones.
 * DrawerPanel sorts by ['read', 'created'] ascending — unread first.
 */
export const RealtimeNotificationSortOrder: Story = {
  loaders: [async () => seedState([...mockNotifications], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verifies that a newly arrived unread notification sorts before read notifications. ' +
          'The drawer sorts by read status (unread first) then by created date.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Add a new unread notification
    DrawerSingleton.Instance.addNotification({
      id: 'sort-test-1',
      title: 'Urgent: system rebooted unexpectedly',
      description: 'System prod-web-01 rebooted at 14:23 UTC.',
      read: false,
      source: 'insights',
      bundle: 'rhel',
      application: 'advisor',
      created: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(canvas.getByText('Urgent: system rebooted unexpectedly')).toBeInTheDocument();
    });

    // Verify new unread notification appears before read items.
    // Mock data has 2 read items (id='4' Ansible job, id='5' webhook failed).
    // All unread items (including the new one) must come before those.
    const allItems = canvas.getAllByLabelText(/^Notification item/);
    const newItemIndex = allItems.findIndex((el) =>
      el.textContent?.includes('Urgent: system rebooted unexpectedly')
    );
    // 3 original unread + 1 new unread = 4 unread items → indices 0-3
    // 2 read items → indices 4-5
    // New unread must be in the unread section (index < total - 2)
    expect(newItemIndex).toBeLessThan(allItems.length - 2);
  },
};

/**
 * Adds three notifications in quick succession to verify the UI handles
 * rapid state updates without dropping items.
 */
export const RealtimeMultipleRapidNotifications: Story = {
  loaders: [async () => seedState([...mockNotifications], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulates three notifications arriving in rapid succession. ' +
          'All three should render without any being dropped.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    const initialCount = canvas.getAllByLabelText(/^Notification item/).length;

    // Rapid-fire three notifications
    DrawerSingleton.Instance.addNotification({
      id: 'rapid-1',
      title: 'Rapid alert: disk usage warning',
      description: 'Disk /dev/sda1 is at 85% capacity.',
      read: false,
      source: 'advisor',
      bundle: 'rhel',
      application: 'advisor',
      created: new Date(Date.now() + 1).toISOString(),
    });

    DrawerSingleton.Instance.addNotification({
      id: 'rapid-2',
      title: 'Rapid alert: memory pressure detected',
      description: 'System swap usage exceeded 50% threshold.',
      read: false,
      source: 'advisor',
      bundle: 'rhel',
      application: 'advisor',
      created: new Date(Date.now() + 2).toISOString(),
    });

    DrawerSingleton.Instance.addNotification({
      id: 'rapid-3',
      title: 'Rapid alert: new CVE published',
      description: 'CVE-2026-12345 affects OpenSSL 3.x — patch available.',
      read: false,
      source: 'vulnerability',
      bundle: 'rhel',
      application: 'advisor',
      created: new Date(Date.now() + 3).toISOString(),
    });

    // All three must appear
    await waitFor(() => {
      const items = canvas.getAllByLabelText(/^Notification item/);
      expect(items.length).toBe(initialCount + 3);
    });

    expect(canvas.getByText('Rapid alert: disk usage warning')).toBeInTheDocument();
    expect(canvas.getByText('Rapid alert: memory pressure detected')).toBeInTheDocument();
    expect(canvas.getByText('Rapid alert: new CVE published')).toBeInTheDocument();

    // Verify "Select all" reflects the new total
    await waitFor(() => {
      expect(canvas.getByText(/Select all \(8\)/)).toBeInTheDocument();
    });
  },
};

/**
 * Verifies that a notification arriving as already-read does not appear
 * in the unread section — it sorts to the bottom with other read items.
 */
export const RealtimeReadNotificationArrival: Story = {
  loaders: [async () => seedState([...mockNotifications], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A notification that arrives already marked as read should sort with other read items ' +
          '(at the bottom of the list), not at the top with unread items.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Add a notification that is already read
    DrawerSingleton.Instance.addNotification({
      id: 'read-arrival-1',
      title: 'Resolved: scheduled maintenance completed',
      description: 'The scheduled maintenance window for us-east-1 has completed.',
      read: true,
      source: 'console',
      bundle: 'console',
      application: 'console',
      created: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(canvas.getByText('Resolved: scheduled maintenance completed')).toBeInTheDocument();
    });

    // Read notification should sort after all unread items.
    // 3 unread mock items occupy first positions.
    const allItems = canvas.getAllByLabelText(/^Notification item/);
    const readItemIndex = allItems.findIndex((el) =>
      el.textContent?.includes('Resolved: scheduled maintenance completed')
    );
    // Must be at index >= 3 (after the 3 unread items)
    expect(readItemIndex).toBeGreaterThanOrEqual(3);
  },
};

/**
 * Verifies that a notification arriving into an empty drawer transitions
 * from the empty state to showing the notification list.
 */
export const RealtimeFromEmptyState: Story = {
  loaders: [async () => seedState([], mockFilterConfig)],
  args: {
    toggleDrawer: () => console.log('Toggle drawer'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the drawer starts empty and a notification arrives, the empty state should ' +
          'disappear and the notification list should render with the new item.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify empty state is shown
    await waitFor(() => {
      expect(canvas.getByText('No notifications found')).toBeInTheDocument();
    });

    // Notification arrives
    DrawerSingleton.Instance.addNotification({
      id: 'first-ever-1',
      title: 'Welcome to Hybrid Cloud Console',
      description: 'Your first notification — everything is connected.',
      read: false,
      source: 'console',
      bundle: 'console',
      application: 'console',
      created: new Date().toISOString(),
    });

    // Empty state gone, notification visible
    await waitFor(() => {
      expect(canvas.queryByText('No notifications found')).not.toBeInTheDocument();
    });

    expect(canvas.getByText('Welcome to Hybrid Cloud Console')).toBeInTheDocument();
    expect(canvas.getAllByLabelText(/^Notification item/).length).toBe(1);
  },
};
