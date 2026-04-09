import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Toolbar, ToolbarContent } from '@patternfly/react-core/dist/dynamic/components/Toolbar';
import DrawerBell from './DrawerBell';
import { DrawerSingleton } from './DrawerSingleton';
import { NotificationData } from '../../types/Drawer';

const seedState = (notificationData: NotificationData[], ready = true) => {
  Object.assign(DrawerSingleton.getState(), {
    notificationData,
    hasUnread: notificationData.some((n) => !n.read),
    ready,
    initializing: !ready,
  });
};

const unreadNotifications: NotificationData[] = [
  {
    id: '1',
    title: 'New package updates available',
    description:
      'Security advisories RHSA-2024:1234 and RHSA-2024:1235 are available for your systems.',
    read: false,
    source: 'advisor',
    bundle: 'rhel',
    created: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    title: 'OpenShift cluster upgrade available',
    description: 'Cluster "prod-us-east-1" can be upgraded to OpenShift 4.15.3.',
    read: false,
    source: 'openshift',
    bundle: 'openshift',
    created: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    title: 'Policy violation detected',
    description: '3 systems are non-compliant with PCI-DSS policy "No SSH root login".',
    read: false,
    source: 'compliance',
    bundle: 'rhel',
    created: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    title: 'Integration webhook delivery failed',
    description: 'Webhook to "https://hooks.example.com/notify" failed after 3 retries.',
    read: true,
    source: 'integrations',
    bundle: 'console',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const readNotifications: NotificationData[] = unreadNotifications.map((n) => ({
  ...n,
  read: true,
}));

const meta: Meta<typeof DrawerBell> = {
  title: 'Components/DrawerBell',
  component: DrawerBell,
  decorators: [
    (Story) => (
      <Toolbar>
        <ToolbarContent>
          <Story />
        </ToolbarContent>
      </Toolbar>
    ),
  ],
  args: {
    isNotificationDrawerExpanded: false,
  },
};

export default meta;
type Story = StoryObj<typeof DrawerBell>;

export const WithUnread: Story = {
  loaders: [async () => seedState(unreadNotifications)],
  parameters: {
    docs: {
      description: {
        story: 'Bell with 3 unread notifications — badge shows the unread count.',
      },
    },
  },
};

export const AllRead: Story = {
  loaders: [async () => seedState(readNotifications)],
  parameters: {
    docs: {
      description: {
        story: 'Bell with all notifications read — no count badge.',
      },
    },
  },
};

export const DrawerExpanded: Story = {
  args: { isNotificationDrawerExpanded: true },
  loaders: [async () => seedState(unreadNotifications)],
  parameters: {
    docs: {
      description: {
        story: 'Bell in expanded/active state while the drawer is open.',
      },
    },
  },
};

export const Loading: Story = {
  loaders: [async () => seedState([], false)],
  parameters: {
    docs: {
      description: {
        story: 'Bell disabled while notifications are still loading.',
      },
    },
  },
};
