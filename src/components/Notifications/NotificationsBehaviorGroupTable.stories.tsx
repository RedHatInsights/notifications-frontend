import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { NotificationsBehaviorGroupTable } from './NotificationsBehaviorGroupTable';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { NotificationsTableColumns } from './NotificationsBehaviorGroupTable';
import { SortDirection } from '../../types/SortDirection';
import { BehaviorGroup } from '../../types/Notification';
import { CUSTOM_THRESHOLD_DISPLAY_NAME, DEFAULT_THRESHOLD } from './constants';

const mockBehaviorGroups: BehaviorGroup[] = [
  {
    id: 'bg-1',
    displayName: 'Subscription Usage',
    bundleId: 'bundle-1',
    bundleName: 'subscription-services',
    isDefault: true,
    actions: [],
    events: [],
  },
  {
    id: 'bg-2',
    displayName: 'Email Alerts',
    bundleId: 'bundle-1',
    bundleName: 'subscription-services',
    isDefault: false,
    actions: [],
    events: [],
  },
];

const mockNotifications: BehaviorGroupNotificationRow[] = [
  {
    id: 'evt-1',
    eventTypeDisplayName: CUSTOM_THRESHOLD_DISPLAY_NAME,
    applicationDisplayName: 'Subscriptions Usage',
    description: 'Notification triggered when subscription usage exceeds the configured threshold',
    loadingActionStatus: 'done',
    behaviors: [mockBehaviorGroups[0]],
    isEditMode: false,
    thresholdValue: DEFAULT_THRESHOLD,
  },
  {
    id: 'evt-2',
    eventTypeDisplayName: 'Subscription Enhancements',
    applicationDisplayName: 'Errata',
    loadingActionStatus: 'done',
    behaviors: [],
    isEditMode: false,
  },
  {
    id: 'evt-3',
    eventTypeDisplayName: 'Subscription Security Updates',
    applicationDisplayName: 'Errata',
    loadingActionStatus: 'done',
    behaviors: [],
    isEditMode: false,
  },
  {
    id: 'evt-4',
    eventTypeDisplayName: 'Subscription threshold exceeded',
    applicationDisplayName: 'Subscriptions Usage',
    loadingActionStatus: 'done',
    behaviors: [mockBehaviorGroups[0]],
    isEditMode: false,
  },
];

const meta: Meta<typeof NotificationsBehaviorGroupTable> = {
  title: 'Notifications/NotificationsBehaviorGroupTable',
  component: NotificationsBehaviorGroupTable,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationsBehaviorGroupTable>;

/**
 * Default view showing the notifications table with the "Custom subscription threshold exceeded" event.
 * The threshold notification shows: 🔒 80 % of usage threshold with the
 * "Subscription Usage" behavior group label inline. Labels wrap if they don't fit.
 */
export const Default: Story = {
  args: {
    notifications: mockNotifications,
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Edit mode for the "Custom subscription threshold exceeded" event.
 * Shows the NumberInput with +/- buttons and editable threshold value.
 * The threshold input has minus (-), value field (80), plus (+), and % symbol.
 * The "Subscription Usage" behavior group label appears below with an X to remove it.
 */
export const EditMode: Story = {
  args: {
    notifications: [
      {
        ...mockNotifications[0],
        isEditMode: true,
        oldBehaviors: mockNotifications[0].behaviors,
        oldThresholdValue: 80,
      },
      ...mockNotifications.slice(1),
    ],
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    onThresholdChange: (notificationId, threshold) => {
      console.log('Threshold changed:', { notificationId, threshold });
    },
    onStartEditing: (notificationId) => {
      console.log('Start editing:', notificationId);
    },
    onFinishEditing: (notificationId) => {
      console.log('Finish editing:', notificationId);
    },
    onCancelEditing: (notificationId) => {
      console.log('Cancel editing:', notificationId);
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Edit mode for "Custom subscription threshold exceeded" showing a different threshold value (85%).
 * Demonstrates that the threshold value can be customized.
 * Shows the behavior group label below the NumberInput.
 */
export const CustomThresholdValue: Story = {
  args: {
    notifications: [
      {
        ...mockNotifications[0],
        isEditMode: true,
        oldBehaviors: mockNotifications[0].behaviors,
        oldThresholdValue: 85,
        thresholdValue: 85,
      },
      ...mockNotifications.slice(1),
    ],
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    onThresholdChange: (notificationId, threshold) => {
      console.log('Threshold changed:', { notificationId, threshold });
    },
    onStartEditing: (notificationId) => {
      console.log('Start editing:', notificationId);
    },
    onFinishEditing: (notificationId) => {
      console.log('Finish editing:', notificationId);
    },
    onCancelEditing: (notificationId) => {
      console.log('Cancel editing:', notificationId);
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Shows the "Custom subscription threshold exceeded" event with multiple behavior groups assigned.
 * Demonstrates that behavior groups (Subscription Usage, Email Alerts) appear as labels
 * below the threshold NumberInput in edit mode. Each label has an X to remove it.
 */
export const WithMultipleBehaviorGroups: Story = {
  args: {
    notifications: [
      {
        ...mockNotifications[0],
        isEditMode: true,
        behaviors: mockBehaviorGroups,
        oldBehaviors: [mockBehaviorGroups[0]],
        oldThresholdValue: 80,
      },
      ...mockNotifications.slice(1),
    ],
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    onThresholdChange: (notificationId, threshold) => {
      console.log('Threshold changed:', { notificationId, threshold });
    },
    onStartEditing: (notificationId) => {
      console.log('Start editing:', notificationId);
    },
    onFinishEditing: (notificationId) => {
      console.log('Finish editing:', notificationId);
    },
    onCancelEditing: (notificationId) => {
      console.log('Cancel editing:', notificationId);
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Shows the "Custom subscription threshold exceeded" event WITHOUT any behavior groups linked.
 * In read-only mode, only the threshold appears: 🔒 80 % of usage threshold
 * No behavior group labels are shown because none are linked yet.
 */
export const WithoutBehaviorGroups: Story = {
  args: {
    notifications: [
      {
        ...mockNotifications[0],
        behaviors: [], // No behavior groups linked
        isEditMode: false,
      },
      ...mockNotifications.slice(1),
    ],
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Loading state for behavior groups.
 */
export const LoadingBehaviorGroups: Story = {
  args: {
    notifications: mockNotifications,
    behaviorGroupContent: {
      isLoading: true,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};

/**
 * Empty state when no notifications are configured.
 */
export const EmptyState: Story = {
  args: {
    notifications: [],
    behaviorGroupContent: {
      isLoading: false,
      hasError: false,
      content: mockBehaviorGroups,
      reload: () => console.log('Reload behavior groups'),
    },
    onBehaviorGroupLinkUpdated: (notification, behaviorGroup, isLinked) => {
      console.log('Behavior group link updated:', { notification, behaviorGroup, isLinked });
    },
    sortBy: NotificationsTableColumns.EVENT,
    sortDirection: SortDirection.ASC,
    onSort: (column, direction) => {
      console.log('Sort:', { column, direction });
    },
  },
};
