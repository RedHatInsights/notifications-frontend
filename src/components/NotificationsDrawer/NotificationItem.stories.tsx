import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { HttpResponse, http } from 'msw';
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

const readStatusHandler = http.put(
  '*/api/notifications/*/notifications/drawer/read*',
  async ({ request }) => {
    const body = await request.json();
    readStatusSpy(body);
    return new HttpResponse(null, { status: 200 });
  }
);

const readStatusSpy = fn();
const onNavigateToSpy = fn();
const updateNotificationSelectedSpy = fn();
const updateNotificationReadSpy = fn();

const meta: Meta<typeof NotificationItem> = {
  title: 'Components/NotificationItem',
  component: NotificationItem,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [readStatusHandler],
    },
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

async function openKebabMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  let menu = page.queryByRole('menu');
  if (!menu) {
    const toggle = await canvas.findByRole('button', { name: 'Notification actions dropdown' });
    await userEvent.click(toggle);
    menu = await page.findByRole('menu');
  }
  const menuEl = menu as HTMLElement;
  await waitFor(() => {
    expect(within(menuEl).getAllByRole('menuitem')).toHaveLength(4);
  });
  return within(menuEl).getAllByRole('menuitem');
}

export const AdminKebabMenu: Story = {
  args: {
    notification: mockNotificationUnread,
    isOrgAdmin: true,
    onNavigateTo: onNavigateToSpy,
    updateNotificationSelected: updateNotificationSelectedSpy,
    updateNotificationRead: updateNotificationReadSpy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Admin kebab menu with all actions enabled and expected menu order.',
      },
    },
  },
  render: (args) => {
    onNavigateToSpy.mockClear();
    updateNotificationSelectedSpy.mockClear();
    updateNotificationReadSpy.mockClear();
    return <NotificationItem {...args} />;
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);

    const menuItems = await openKebabMenu(canvasElement);
    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).toHaveTextContent('Mark as read');
    expect(menuItems[1]).toHaveTextContent('View in event log');
    expect(menuItems[2]).toHaveTextContent('Manage my event notifications');
    expect(menuItems[3]).toHaveTextContent('Manage event configuration');

    const divider = await page.findByRole('separator');
    expect(divider).toBeInTheDocument();

    expect(menuItems[3]).toBeEnabled();
  },
};

export const NonAdminKebabMenu: Story = {
  args: {
    notification: mockNotificationUnread,
    isOrgAdmin: false,
    onNavigateTo: onNavigateToSpy,
    updateNotificationSelected: updateNotificationSelectedSpy,
    updateNotificationRead: updateNotificationReadSpy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Non-admin kebab menu with disabled manage configuration action and tooltip.',
      },
    },
  },
  render: (args) => {
    onNavigateToSpy.mockClear();
    updateNotificationSelectedSpy.mockClear();
    updateNotificationReadSpy.mockClear();
    return <NotificationItem {...args} />;
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);

    const menuItems = await openKebabMenu(canvasElement);
    expect(menuItems).toHaveLength(4);
    expect(menuItems[3]).toHaveTextContent('Manage event configuration');
    expect(menuItems[3]).toBeDisabled();

    const tooltipTrigger = menuItems[3].closest('span') ?? menuItems[3];
    await userEvent.hover(tooltipTrigger);
    await waitFor(() => {
      expect(page.getByRole('tooltip')).toHaveTextContent('Admin-access required');
    });
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
    onNavigateTo: onNavigateToSpy,
    updateNotificationSelected: updateNotificationSelectedSpy,
    updateNotificationRead: updateNotificationReadSpy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dynamic URL generation for drawer navigation actions.',
      },
    },
  },
  render: (args) => {
    onNavigateToSpy.mockClear();
    updateNotificationSelectedSpy.mockClear();
    updateNotificationReadSpy.mockClear();
    return <NotificationItem {...args} />;
  },
  play: async ({ canvasElement }) => {
    let menuItems = await openKebabMenu(canvasElement);

    await userEvent.click(menuItems[1]);
    expect(onNavigateToSpy).toHaveBeenCalledWith(
      '/settings/notifications/eventlog?service=vulnerability&event=Critical+vulnerability+detected'
    );

    onNavigateToSpy.mockClear();
    menuItems = await openKebabMenu(canvasElement);
    await userEvent.click(menuItems[2]);
    expect(onNavigateToSpy).toHaveBeenCalledWith(
      '/settings/notifications/user-preferences?bundle=rhel&app=vulnerability'
    );

    onNavigateToSpy.mockClear();
    menuItems = await openKebabMenu(canvasElement);
    await userEvent.click(menuItems[3]);
    expect(onNavigateToSpy).toHaveBeenCalledWith(
      '/settings/notifications/configure-events?bundle=rhel&tab=configuration'
    );
  },
};

export const ReadNotificationShowsMarkAsUnread: Story = {
  args: {
    notification: mockNotificationRead,
    isOrgAdmin: true,
    onNavigateTo: onNavigateToSpy,
    updateNotificationSelected: updateNotificationSelectedSpy,
    updateNotificationRead: updateNotificationReadSpy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read notification shows the Mark as unread action.',
      },
    },
  },
  render: (args) => {
    onNavigateToSpy.mockClear();
    updateNotificationSelectedSpy.mockClear();
    updateNotificationReadSpy.mockClear();
    return <NotificationItem {...args} />;
  },
  play: async ({ canvasElement }) => {
    const menuItems = await openKebabMenu(canvasElement);
    expect(menuItems[0]).toHaveTextContent('Mark as unread');
  },
};

export const MarkAsReadCallsAPI: Story = {
  args: {
    notification: mockNotificationUnread,
    isOrgAdmin: true,
    onNavigateTo: onNavigateToSpy,
    updateNotificationSelected: updateNotificationSelectedSpy,
    updateNotificationRead: updateNotificationReadSpy,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mark as read calls the read-status API and updates local read state.',
      },
    },
  },
  render: (args) => {
    readStatusSpy.mockClear();
    onNavigateToSpy.mockClear();
    updateNotificationSelectedSpy.mockClear();
    updateNotificationReadSpy.mockClear();
    return <NotificationItem {...args} />;
  },
  play: async ({ canvasElement }) => {
    const menuItems = await openKebabMenu(canvasElement);
    await userEvent.click(menuItems[0]);

    await waitFor(() => {
      expect(readStatusSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          notification_ids: ['1'],
          read_status: true,
        })
      );
    });
    await waitFor(() => {
      expect(updateNotificationReadSpy).toHaveBeenCalledWith('1', true);
    });
  },
};
