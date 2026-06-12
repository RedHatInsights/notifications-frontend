/**
 * NotificationItem Read/Unread State Stories
 *
 * Play-function stories that verify the visual state changes when marking
 * a notification as read/unread via the kebab menu.
 *
 * Tests:
 *   - Bell icon stays purple (variant="info") in both read and unread states
 *   - Notification border/styling updates when marked as read (pf-m-read)
 *   - Kebab menu toggles between "Mark as read" and "Mark as unread"
 *
 * Related: RHCLOUD-48122
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, waitFor, within, userEvent } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import NotificationItem from './NotificationItem';
import { NotificationData } from '../../types/Drawer';

const makeNotification = (read: boolean): NotificationData => ({
  id: 'test-read-state-1',
  title: 'Security advisory RHSA-2026:4321',
  description: 'A critical security update is available for your RHEL 9 systems.',
  read,
  selected: false,
  source: 'advisor',
  bundle: 'rhel',
  created: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
});

/**
 * Stateful wrapper that manages notification read state so the component
 * re-renders correctly when toggled via the kebab menu.
 */
const NotificationItemWrapper = ({ initialRead }: { initialRead: boolean }) => {
  const [notification, setNotification] = useState<NotificationData>(makeNotification(initialRead));

  const updateNotificationRead = (_id: string, read: boolean) => {
    setNotification((prev) => ({ ...prev, read }));
  };

  const updateNotificationSelected = (_id: string, selected: boolean) => {
    setNotification((prev) => ({ ...prev, selected }));
  };

  return (
    <NotificationItem
      notification={notification}
      onNavigateTo={() => {}}
      updateNotificationSelected={updateNotificationSelected}
      updateNotificationRead={updateNotificationRead}
    />
  );
};

const meta: Meta = {
  title: 'Components/NotificationItemReadState',
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.put('/api/notifications/v1.0/notifications/drawer/read', () => {
          return HttpResponse.json(1);
        }),
        http.put('/api/notifications/v1/notifications/drawer/read', () => {
          return HttpResponse.json(1);
        }),
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Notification item in unread state. The bell icon is purple (variant="info")
 * and the item does not have read styling. The kebab menu shows "Mark as read".
 */
export const UnreadState: Story = {
  render: () => <NotificationItemWrapper initialRead={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'Notification item in unread state. The bell icon is purple (variant="info") ' +
          'and the item does not have read styling. The kebab menu shows "Mark as read".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify unread visual state — no pf-m-read class, pf-m-info present
    await waitFor(() => {
      const listItem = canvas.getByRole('listitem');
      expect(listItem).toHaveClass('pf-m-info');
      expect(listItem).not.toHaveClass('pf-m-read');
    });

    // Open kebab and verify "Mark as read" option
    await userEvent.click(canvas.getByRole('button', { name: 'Notification actions dropdown' }));
    await waitFor(() => {
      expect(canvas.getByText('Mark as read')).toBeInTheDocument();
    });
  },
};

/**
 * Notification item in read state. The bell icon remains purple (variant="info")
 * and the item has read styling (subdued appearance). The kebab menu shows
 * "Mark as unread".
 */
export const ReadState: Story = {
  render: () => <NotificationItemWrapper initialRead={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'Notification item in read state. The bell icon remains purple (variant="info") ' +
          'and the item has read styling (subdued appearance). The kebab menu shows "Mark as unread".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify read visual state — pf-m-read class present, pf-m-info preserved
    await waitFor(() => {
      const listItem = canvas.getByRole('listitem');
      expect(listItem).toHaveClass('pf-m-info');
      expect(listItem).toHaveClass('pf-m-read');
    });

    // Open kebab and verify "Mark as unread" option
    await userEvent.click(canvas.getByRole('button', { name: 'Notification actions dropdown' }));
    await waitFor(() => {
      expect(canvas.getByText('Mark as unread')).toBeInTheDocument();
    });
  },
};

/**
 * Interactive toggle test: marks a notification as read via the kebab menu,
 * verifies the visual change, then marks it back as unread. Confirms:
 *   - Bell icon stays purple (variant="info") in both states
 *   - Border/styling updates when marked as read (pf-m-read class)
 *   - Kebab menu text toggles between "Mark as read" and "Mark as unread"
 */
export const ToggleReadUnread: Story = {
  render: () => <NotificationItemWrapper initialRead={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive test: toggles a notification from unread to read to unread. ' +
          'Verifies that the bell icon stays purple in both states, border/styling ' +
          'updates correctly, and the kebab menu text toggles between ' +
          '"Mark as read" and "Mark as unread".',
      },
    },
    chromatic: { delay: 3000 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Verify initial unread state
    await waitFor(() => {
      const listItem = canvas.getByRole('listitem');
      expect(listItem).toHaveClass('pf-m-info');
      expect(listItem).not.toHaveClass('pf-m-read');
    });

    // 2. Open kebab and verify "Mark as read" is present
    await userEvent.click(canvas.getByRole('button', { name: 'Notification actions dropdown' }));
    await waitFor(() => {
      expect(canvas.getByText('Mark as read')).toBeInTheDocument();
    });

    // 3. Click "Mark as read"
    await userEvent.click(canvas.getByText('Mark as read'));

    // 4. Verify transition to read state — icon stays purple, read styling applied
    await waitFor(() => {
      const listItem = canvas.getByRole('listitem');
      expect(listItem).toHaveClass('pf-m-info');
      expect(listItem).toHaveClass('pf-m-read');
    });

    // 5. Open kebab and verify "Mark as unread" is now shown
    await userEvent.click(canvas.getByRole('button', { name: 'Notification actions dropdown' }));
    await waitFor(() => {
      expect(canvas.getByText('Mark as unread')).toBeInTheDocument();
    });

    // 6. Click "Mark as unread"
    await userEvent.click(canvas.getByText('Mark as unread'));

    // 7. Verify transition back to unread state
    await waitFor(() => {
      const listItem = canvas.getByRole('listitem');
      expect(listItem).toHaveClass('pf-m-info');
      expect(listItem).not.toHaveClass('pf-m-read');
    });

    // 8. Verify kebab shows "Mark as read" again
    await userEvent.click(canvas.getByRole('button', { name: 'Notification actions dropdown' }));
    await waitFor(() => {
      expect(canvas.getByText('Mark as read')).toBeInTheDocument();
    });
  },
};
