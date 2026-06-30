import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import NotificationItem from './NotificationItem';
import { NotificationData } from '../../types/Drawer';

const mockNotificationUnread: NotificationData = {
  id: '1',
  title: 'Advisor recommendation',
  description: 'New recommendations are available for your systems',
  read: false,
  selected: false,
  source: 'advisor',
  bundle: 'rhel',
  application: 'advisor',
  created: '2024-01-15T10:30:00Z',
};

const mockNotificationRead: NotificationData = {
  id: '2',
  title: 'System update completed',
  description: 'Your system has been successfully updated',
  read: true,
  selected: false,
  source: 'patch',
  bundle: 'rhel',
  application: 'patch',
  created: '2024-01-14T09:15:00Z',
};

const meta: Meta<typeof NotificationItem> = {
  title: 'Components/NotificationItem',
  component: NotificationItem,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isOrgAdmin: {
      control: 'boolean',
      description: 'Whether the user is an organization admin',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const UnreadNotificationAdmin: Story = {
  args: {
    notification: mockNotificationUnread,
    isOrgAdmin: true,
    onNavigateTo: (link: string) => console.log('Navigate to:', link),
    updateNotificationSelected: (id: string, selected: boolean) =>
      console.log('Update selected:', id, selected),
    updateNotificationRead: (id: string, read: boolean) => console.log('Update read:', id, read),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Unread notification for admin user. Kebab menu shows "Mark as read" and all navigation items are enabled.',
      },
    },
  },
};

export const ReadNotificationAdmin: Story = {
  args: {
    notification: mockNotificationRead,
    isOrgAdmin: true,
    onNavigateTo: (link: string) => console.log('Navigate to:', link),
    updateNotificationSelected: (id: string, selected: boolean) =>
      console.log('Update selected:', id, selected),
    updateNotificationRead: (id: string, read: boolean) => console.log('Update read:', id, read),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Read notification for admin user. Kebab menu shows "Mark as unread" instead of "Mark as read".',
      },
    },
  },
};

export const UnreadNotificationNonAdmin: Story = {
  args: {
    notification: mockNotificationUnread,
    isOrgAdmin: false,
    onNavigateTo: (link: string) => console.log('Navigate to:', link),
    updateNotificationSelected: (id: string, selected: boolean) =>
      console.log('Update selected:', id, selected),
    updateNotificationRead: (id: string, read: boolean) => console.log('Update read:', id, read),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Unread notification for non-admin user. "Manage event configuration" is disabled with "Admin-access required" tooltip.',
      },
    },
  },
};

export const ReadNotificationNonAdmin: Story = {
  args: {
    notification: mockNotificationRead,
    isOrgAdmin: false,
    onNavigateTo: (link: string) => console.log('Navigate to:', link),
    updateNotificationSelected: (id: string, selected: boolean) =>
      console.log('Update selected:', id, selected),
    updateNotificationRead: (id: string, read: boolean) => console.log('Update read:', id, read),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Read notification for non-admin user. Kebab menu shows "Mark as unread" and "Manage event configuration" is disabled.',
      },
    },
  },
};

export const DynamicURLGeneration: Story = {
  args: {
    notification: {
      id: '3',
      title: 'Critical vulnerability detected',
      description: 'A critical CVE has been detected on your systems',
      read: false,
      selected: false,
      source: 'vulnerability',
      bundle: 'rhel',
      application: 'vulnerability',
      created: '2024-01-16T14:45:00Z',
    },
    isOrgAdmin: true,
    onNavigateTo: (link: string) => {
      console.log('Navigate to:', link);
      alert(`Would navigate to: ${link}`);
    },
    updateNotificationSelected: (id: string, selected: boolean) =>
      console.log('Update selected:', id, selected),
    updateNotificationRead: (id: string, read: boolean) => console.log('Update read:', id, read),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test dynamic URL generation. Click menu items to see generated URLs with query params:\n- "View in event log": /settings/notifications/eventlog?service=vulnerability&event=Critical vulnerability detected\n- "Manage my event notifications": /settings/notifications/user-preferences?bundle=rhel&app=vulnerability\n- "Manage event configuration": /settings/notifications/configure-events?bundle=rhel&tab=configuration',
      },
    },
  },
};
