import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Page } from '@patternfly/react-core/dist/dynamic/components/Page';
import { HttpResponse, delay, http } from 'msw';
import DrawerPanel from './DrawerPanel';
import { DrawerSingleton } from './DrawerSingleton';
import { NotificationData } from '../../types/Drawer';

const notificationDrawerData: NotificationData[] = [
  {
    id: '1',
    title: 'Notification 1',
    read: false,
    created: new Date().toISOString(),
    description: 'This is a test notification',
    source: 'rhel',
    bundle: 'openshift',
  },
  {
    id: '2',
    title: 'Notification 2',
    read: false,
    created: new Date().toISOString(),
    description: 'This is a test notification',
    source: 'rhel',
    bundle: 'console',
  },
  {
    id: '3',
    title: 'Notification 3',
    read: false,
    created: new Date().toISOString(),
    description: 'This is a test notification',
    source: 'rhel',
    bundle: 'console',
  },
];

const notificationPerms = [
  {
    resourceDefinitions: [],
    permission: 'notifications:*:*',
  },
  {
    resourceDefinitions: [],
    permission: 'notifications:notifications:read',
  },
];

const bundleFacets = [
  {
    name: 'console',
    displayName: 'Console',
  },
  {
    name: 'openshift',
    displayName: 'OpenShift',
  },
];

// Test wrapper component
const DrawerPanelWrapper = ({ isExpanded = true }: { isExpanded?: boolean }) => {
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(isExpanded);

  const toggleDrawer = () => setExpanded(!expanded);

  return (
    <Page
      isNotificationDrawerExpanded={expanded}
      notificationDrawer={<DrawerPanel panelRef={drawerPanelRef} toggleDrawer={toggleDrawer} />}
    >
      <div style={{ padding: '20px' }}>
        <button id="drawer-toggle" onClick={toggleDrawer}>
          Toggle drawer
        </button>
      </div>
    </Page>
  );
};

const seedState = (
  notifications: NotificationData[],
  hasNotificationsPermissions = true,
  ready = true
) => {
  const { initialize } = DrawerSingleton.Instance;

  // Initialize with permissions
  initialize(hasNotificationsPermissions, notificationPerms);

  // Seed notification data
  Object.assign(DrawerSingleton.getState(), {
    notificationData: notifications,
    hasUnread: notifications.some((n) => !n.read),
    ready,
    initializing: !ready,
    hasNotificationsPermissions,
    filterConfig: bundleFacets.map((b) => ({ label: b.displayName, value: b.name })),
    filters: [],
  });
};

const meta: Meta<typeof DrawerPanel> = {
  title: 'Components/DrawerPanel',
  component: DrawerPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**DrawerPanel** displays the notifications drawer panel with filtering, bulk actions, and notification management.

## Features
- Display notifications with read/unread states
- Filter notifications by bundle
- Bulk select and mark as read/unread
- Individual notification actions
        `,
      },
    },
    msw: {
      handlers: [
        http.get('/api/rbac/v1/access/', () => {
          return HttpResponse.json({ data: notificationPerms });
        }),
        http.get('/api/notifications/v1/notifications/drawer', () => {
          return HttpResponse.json({ data: [] });
        }),
        http.get('/api/notifications/v1/notifications/facets/bundles', () => {
          return HttpResponse.json(bundleFacets);
        }),
        http.put('/api/notifications/v1/notifications/drawer/read', async () => {
          await delay(100);
          return new HttpResponse(null, { status: 200 });
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DrawerPanelWrapper>;

/**
 * Default empty drawer state
 */
export const Default: Story = {
  loaders: [async () => seedState([])],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify empty state is visible
    await expect(canvas.getByText('No notifications found')).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty drawer with no notifications showing the empty state.',
      },
    },
  },
};

/**
 * Drawer with populated notifications
 */
export const WithNotifications: Story = {
  loaders: [async () => seedState(notificationDrawerData)],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all notifications are displayed
    await expect(canvas.getByText('Notification 1')).toBeVisible();
    await expect(canvas.getByText('Notification 2')).toBeVisible();
    await expect(canvas.getByText('Notification 3')).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer populated with 3 unread notifications.',
      },
    },
  },
};

/**
 * Mark a single notification as read
 */
export const MarkSingleAsRead: Story = {
  loaders: [async () => seedState(notificationDrawerData)],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for notifications to load
    await canvas.findByText('Notification 1');

    // Initially no notifications should have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(0);
    });

    // Find and click the first notification's actions dropdown
    const dropdowns = await canvas.findAllByLabelText('Notification actions dropdown');
    await user.click(dropdowns[0]);

    // Click "Mark as read"
    const markAsReadButton = await canvas.findByRole('menuitem', { name: /mark as read/i });
    await user.click(markAsReadButton);

    // Verify one notification now has the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(1);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Mark a single notification as read using the dropdown action.',
      },
    },
  },
};

/**
 * Mark a single notification as unread
 */
export const MarkSingleAsUnread: Story = {
  loaders: [
    async () => {
      const readNotifications = notificationDrawerData.map((n) => ({ ...n, read: true }));
      seedState(readNotifications);
    },
  ],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for notifications to load
    await canvas.findByText('Notification 1');

    // Initially all notifications should have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(3);
    });

    // Find and click the first notification's actions dropdown
    const dropdowns = await canvas.findAllByLabelText('Notification actions dropdown');
    await user.click(dropdowns[0]);

    // Click "Mark as unread"
    const markAsUnreadButton = await canvas.findByRole('menuitem', { name: /mark as unread/i });
    await user.click(markAsUnreadButton);

    // Verify one notification no longer has the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(2);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Mark a single notification as unread from the read state.',
      },
    },
  },
};

/**
 * Bulk mark all notifications as read
 */
export const BulkMarkAllAsRead: Story = {
  loaders: [async () => seedState(notificationDrawerData)],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for notifications to load
    await canvas.findByText('Notification 1');

    // Initially no notifications should have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(0);
    });

    // Open bulk select dropdown
    const bulkSelectToggle = await canvas.findByRole('button', { name: /Items selected/i });
    await user.click(bulkSelectToggle);

    // Click "Select all"
    const selectAllButton = await canvas.findByText(/Select all \(3\)/i);
    await user.click(selectAllButton);

    // Open actions dropdown
    const actionsToggle = await canvas.findByRole('button', { name: /Actions/i });
    await user.click(actionsToggle);

    // Click "Mark selected as read"
    const markSelectedAsRead = await canvas.findByText(/Mark selected as read/i);
    await user.click(markSelectedAsRead);

    // Verify all notifications now have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(3);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk select all notifications and mark them as read.',
      },
    },
  },
};

/**
 * Bulk mark all notifications as unread
 */
export const BulkMarkAllAsUnread: Story = {
  loaders: [
    async () => {
      const readNotifications = notificationDrawerData.map((n) => ({ ...n, read: true }));
      seedState(readNotifications);
    },
  ],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for notifications to load
    await canvas.findByText('Notification 1');

    // Initially all notifications should have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(3);
    });

    // Open bulk select dropdown
    const bulkSelectToggle = await canvas.findByRole('button', { name: /Items selected/i });
    await user.click(bulkSelectToggle);

    // Click "Select all"
    const selectAllButton = await canvas.findByText(/Select all \(3\)/i);
    await user.click(selectAllButton);

    // Open actions dropdown
    const actionsToggle = await canvas.findByRole('button', { name: /Actions/i });
    await user.click(actionsToggle);

    // Click "Mark selected as unread"
    const markSelectedAsUnread = await canvas.findByText(/Mark selected as unread/i);
    await user.click(markSelectedAsUnread);

    // Verify all notifications no longer have the read class
    await waitFor(() => {
      const readNotifications = canvasElement.querySelectorAll('.pf-m-read');
      expect(readNotifications).toHaveLength(0);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Bulk select all notifications and mark them as unread.',
      },
    },
  },
};

/**
 * Filter notifications by bundle
 */
export const FilterByBundle: Story = {
  loaders: [async () => seedState(notificationDrawerData)],
  render: () => <DrawerPanelWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for notifications to load
    await canvas.findByText('Notification 1');

    // Initially all 3 notifications should be visible
    const allItems = canvasElement.querySelectorAll('.pf-v6-c-notification-drawer__list-item');
    expect(allItems).toHaveLength(3);

    // Open filter dropdown
    const filterToggle = await canvas.findByRole('button', { name: /Filter/i });
    await user.click(filterToggle);

    // Select "Console" filter
    const consoleFilter = await canvas.findByText('Console');
    await user.click(consoleFilter);

    // Verify only 2 console notifications are visible (Notification 2 and 3 are console bundle)
    await waitFor(() => {
      const filteredItems = canvasElement.querySelectorAll(
        '.pf-v6-c-notification-drawer__list-item'
      );
      expect(filteredItems).toHaveLength(2);
    });

    // Click "Reset filter" to clear
    const resetFilter = await canvas.findByText(/Reset filter/i);
    await user.click(resetFilter);

    // Verify all 3 notifications are visible again
    await waitFor(() => {
      const allItemsAgain = canvasElement.querySelectorAll(
        '.pf-v6-c-notification-drawer__list-item'
      );
      expect(allItemsAgain).toHaveLength(3);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter notifications by bundle type (Console vs OpenShift) and reset the filter.',
      },
    },
  },
};
