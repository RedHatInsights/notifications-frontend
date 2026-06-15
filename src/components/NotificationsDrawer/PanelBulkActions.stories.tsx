/**
 * Panel-Level Bulk Actions Stories
 *
 * Tests the ActionDropdown bulk action menu items ("Mark selected (N) as
 * read/unread") at the DrawerPanel level, integrated with notification
 * selection state.
 *
 * Covers:
 *   - Bulk actions disabled when no notifications are selected
 *   - Dynamic count display in bulk action labels
 *   - Divider between bulk action items and navigation items
 *   - Bulk mark-as-read with API mock + state verification
 *   - Bulk mark-as-unread with API mock + state verification
 *
 * Related: RHCLOUD-48124
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { HttpResponse, http } from 'msw';
import DrawerPanel from './DrawerPanel';
import { DrawerSingleton } from './DrawerSingleton';
import { FilterConfigItem, NotificationData } from '../../types/Drawer';

const seedState = (
  notificationData: NotificationData[],
  filterConfig: FilterConfigItem[],
  filters: string[] = [],
  ready = true
) => {
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

const makeNotifications = (
  overrides: Record<string, Partial<NotificationData>> = {}
): NotificationData[] => {
  const defaults: NotificationData[] = [
    {
      id: '1',
      title: 'Security advisory RHSA-2026:001',
      description: 'Critical security update available for RHEL 9.',
      read: false,
      source: 'advisor',
      bundle: 'rhel',
      created: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: '2',
      title: 'OpenShift cluster upgrade ready',
      description: 'Cluster prod-east can be upgraded to 4.16.',
      read: false,
      source: 'openshift',
      bundle: 'openshift',
      created: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '3',
      title: 'Compliance policy violation',
      description: '2 systems non-compliant with CIS benchmark.',
      read: false,
      source: 'compliance',
      bundle: 'rhel',
      created: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '4',
      title: 'Ansible job completed',
      description: 'Job "Patch Servers" finished successfully.',
      read: true,
      source: 'automation',
      bundle: 'ansible',
      created: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: '5',
      title: 'Webhook delivery failed',
      description: 'Webhook to hooks.example.com failed after retries.',
      read: true,
      source: 'integrations',
      bundle: 'console',
      created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  return defaults.map((n) => ({ ...n, ...(overrides[n.id] || {}) }));
};

const mockFilterConfig: FilterConfigItem[] = [
  { title: 'Red Hat Enterprise Linux', value: 'rhel' },
  { title: 'OpenShift', value: 'openshift' },
  { title: 'Ansible Automation Platform', value: 'ansible' },
  { title: 'Console', value: 'console' },
];

const mswHandlers = [
  http.put('/api/notifications/v1.0/notifications/drawer/read', () => HttpResponse.json(1)),
  http.put('/api/notifications/v1/notifications/drawer/read', () => HttpResponse.json(1)),
];

const meta: Meta<typeof DrawerPanel> = {
  title: 'Components/DrawerPanel/BulkActions',
  component: DrawerPanel,
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: mswHandlers },
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
type Story = StoryObj<typeof meta>;

/**
 * Verifies bulk action menu items are disabled when no notifications are
 * selected. Both "Mark selected (0) as read" and "Mark selected (0) as
 * unread" should be non-interactive.
 */
export const BulkActionsNoSelection: Story = {
  loaders: [async () => seedState(makeNotifications(), mockFilterConfig)],
  args: { toggleDrawer: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Bulk action menu items ("Mark selected (0) as read/unread") are disabled ' +
          'when no notifications are selected. Navigation items remain enabled.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Open actions dropdown
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));

    // Verify bulk action items are disabled with count 0
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (0) as read')).toBeInTheDocument();
    });

    const markReadBtn = canvas.getByText('Mark selected (0) as read').closest('button');
    const markUnreadBtn = canvas.getByText('Mark selected (0) as unread').closest('button');
    expect(markReadBtn).toBeDisabled();
    expect(markUnreadBtn).toBeDisabled();

    // Navigation items remain enabled
    expect(canvas.getByText('View event log').closest('button')).toBeEnabled();
  },
};

/**
 * Verifies bulk action labels show the correct dynamic count when
 * notifications are selected, and the items become enabled.
 * Also verifies a divider separates bulk actions from navigation items.
 */
export const BulkActionsWithSelection: Story = {
  loaders: [
    async () =>
      seedState(
        makeNotifications({
          '1': { selected: true },
          '2': { selected: true },
          '3': { selected: true },
        }),
        mockFilterConfig
      ),
  ],
  args: { toggleDrawer: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'With 3 notifications selected, bulk action labels display "Mark selected (3) as ' +
          'read/unread" and are enabled. A divider separates bulk actions from navigation items.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Open actions dropdown
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));

    // Verify bulk action items show dynamic count and are enabled
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (3) as read')).toBeInTheDocument();
    });

    const markReadBtn = canvas.getByText('Mark selected (3) as read').closest('button');
    const markUnreadBtn = canvas.getByText('Mark selected (3) as unread').closest('button');
    expect(markReadBtn).toBeEnabled();
    expect(markUnreadBtn).toBeEnabled();

    // Verify divider between bulk actions and navigation items
    const separators = canvas.getAllByRole('separator');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  },
};

/**
 * Selects 3 unread notifications and clicks "Mark selected (3) as read".
 * Verifies all 3 transition to read state and selection is cleared.
 */
export const BulkMarkAsRead: Story = {
  loaders: [
    async () =>
      seedState(
        makeNotifications({
          '1': { selected: true },
          '2': { selected: true },
          '3': { selected: true },
        }),
        mockFilterConfig
      ),
  ],
  args: { toggleDrawer: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Selects 3 unread notifications and clicks "Mark selected (3) as read". ' +
          'All 3 transition to read state (pf-m-read class) and selection is cleared.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Verify initial state: 3 unread items (without pf-m-read class)
    const itemsBefore = canvas.getAllByLabelText(/^Notification item/);
    const unreadBefore = itemsBefore.filter((item) => !item.classList.contains('pf-m-read'));
    expect(unreadBefore.length).toBe(3);

    // Open actions dropdown and click "Mark selected (3) as read"
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (3) as read')).toBeInTheDocument();
    });
    await userEvent.click(canvas.getByText('Mark selected (3) as read'));

    // Verify: all 5 items are now read (3 marked + 2 already read)
    await waitFor(() => {
      const allItems = canvas.getAllByLabelText(/^Notification item/);
      allItems.forEach((item) => {
        expect(item).toHaveClass('pf-m-read');
      });
    });

    // Verify: selection cleared — re-open dropdown, count should be 0
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (0) as read')).toBeInTheDocument();
    });
  },
};

/**
 * Selects 2 read notifications and clicks "Mark selected (2) as unread".
 * Verifies both transition to unread state and selection is cleared.
 */
export const BulkMarkAsUnread: Story = {
  loaders: [
    async () =>
      seedState(
        makeNotifications({
          '4': { selected: true },
          '5': { selected: true },
        }),
        mockFilterConfig
      ),
  ],
  args: { toggleDrawer: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Selects 2 read notifications and clicks "Mark selected (2) as unread". ' +
          'Both transition to unread state (no pf-m-read class) and selection is cleared.',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText('Notifications')).toBeInTheDocument();
    });

    // Verify initial state: 2 read items (with pf-m-read class)
    const itemsBefore = canvas.getAllByLabelText(/^Notification item/);
    const readBefore = itemsBefore.filter((item) => item.classList.contains('pf-m-read'));
    expect(readBefore.length).toBe(2);

    // Open actions dropdown and click "Mark selected (2) as unread"
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (2) as unread')).toBeInTheDocument();
    });
    await userEvent.click(canvas.getByText('Mark selected (2) as unread'));

    // Verify: all 5 items are now unread (2 marked + 3 already unread)
    await waitFor(() => {
      const allItems = canvas.getAllByLabelText(/^Notification item/);
      allItems.forEach((item) => {
        expect(item).not.toHaveClass('pf-m-read');
      });
    });

    // Verify: selection cleared — re-open dropdown, count should be 0
    await userEvent.click(canvas.getByLabelText('Notifications actions dropdown'));
    await waitFor(() => {
      expect(canvas.getByText('Mark selected (0) as unread')).toBeInTheDocument();
    });
  },
};
