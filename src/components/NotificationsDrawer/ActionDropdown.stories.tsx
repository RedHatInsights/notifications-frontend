import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ActionDropdown } from './Dropdowns';

const InteractiveActionDropdown = ({
  selectedCount = 0,
  isOrgAdmin = false,
}: {
  selectedCount?: number;
  isOrgAdmin?: boolean;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const onUpdateSelectedStatus = (read: boolean) => {
    console.log(`Mark ${selectedCount} notifications as ${read ? 'read' : 'unread'}`);
  };

  const onNavigateTo = (link: string) => {
    console.log(`Navigate to: ${link}`);
  };

  return (
    <ActionDropdown
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      selectedCount={selectedCount}
      onUpdateSelectedStatus={onUpdateSelectedStatus}
      onNavigateTo={onNavigateTo}
      isOrgAdmin={isOrgAdmin}
    />
  );
};

const meta: Meta<typeof ActionDropdown> = {
  title: 'Components/ActionDropdown',
  component: ActionDropdown,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionDropdown>;

export const NoSelection: Story = {
  render: () => <InteractiveActionDropdown selectedCount={0} isOrgAdmin={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'Action dropdown with no notifications selected. Both bulk action items ("Mark selected (0) as read/unread") are disabled.',
      },
    },
  },
};

export const WithSelection: Story = {
  render: () => <InteractiveActionDropdown selectedCount={3} isOrgAdmin={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'Action dropdown with 3 notifications selected. Bulk action items show "Mark selected (3) as read/unread" and are enabled.',
      },
    },
  },
};

export const NonAdminUser: Story = {
  render: () => <InteractiveActionDropdown selectedCount={2} isOrgAdmin={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'Action dropdown for non-admin user. "Manage event configuration" is disabled with "Admin-access required" tooltip.',
      },
    },
  },
};

export const AdminUser: Story = {
  render: () => <InteractiveActionDropdown selectedCount={2} isOrgAdmin={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'Action dropdown for admin user. All menu items including "Manage event configuration" are enabled.',
      },
    },
  },
};
