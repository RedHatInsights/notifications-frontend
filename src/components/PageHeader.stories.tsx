import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PageHeader } from './PageHeader';
import { Button } from '@patternfly/react-core';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component: `
**PageHeader** provides a consistent header layout for pages with a title, subtitle, and optional action button.

## Usage
Used at the top of main content pages to provide context and primary actions.

### Props
- \`title\`: Main page title (string or ReactNode)
- \`subtitle\`: Supporting description text
- \`action\`: Optional ReactNode for action buttons
        `,
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main page title',
    },
    subtitle: {
      control: 'text',
      description: 'Supporting description text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Notifications',
    subtitle:
      'Configure how you receive notifications for events in your organization.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic page header with title and subtitle.',
      },
    },
  },
};

export const WithAction: Story = {
  args: {
    title: 'Integrations',
    subtitle: 'Manage your integration endpoints for receiving notifications.',
    action: <Button variant="primary">Create integration</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header with an action button for creating new items.',
      },
    },
  },
};

export const NotificationsPage: Story = {
  args: {
    title: 'Event Log',
    subtitle:
      'View the history of events and notifications that have been sent.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header for the Event Log page.',
      },
    },
  },
};

export const BehaviorGroupsPage: Story = {
  args: {
    title: 'Behavior Groups',
    subtitle:
      'Create and manage behavior groups to define how different events trigger notifications.',
    action: <Button variant="primary">Create behavior group</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Page header for the Behavior Groups page with create action.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    title: 'Configure Notification Preferences',
    subtitle:
      'Customize how and when you receive notifications for various events across your organization. You can set up different notification channels including email, webhooks, and integrations with third-party services.',
    action: <Button variant="secondary">Learn more</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Page header with longer content to demonstrate text wrapping behavior.',
      },
    },
  },
};
