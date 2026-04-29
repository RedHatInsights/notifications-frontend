import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import DrawerPanel from './DrawerPanel';
import { DrawerSingleton } from './DrawerSingleton';
import { FilterConfigItem, NotificationData } from '../../types/Drawer';

const seedState = (
  notificationData: NotificationData[],
  filterConfig: FilterConfigItem[],
  filters: string[] = [],
  ready = true
) => {
  Object.assign(DrawerSingleton.getState(), {
    notificationData,
    filterConfig,
    filters,
    hasUnread: notificationData.some((n) => !n.read),
    ready,
    initializing: !ready,
    hasNotificationsPermissions: true,
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
    title: 'Ansible Automation Platform job completed',
    description: 'Job template "Deploy Web Servers" completed successfully.',
    read: true,
    source: 'automation',
    bundle: 'ansible',
    created: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '5',
    title: 'Integration webhook delivery failed',
    description: 'Webhook to "https://hooks.example.com/notify" failed after 3 retries.',
    read: true,
    source: 'integrations',
    bundle: 'console',
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
