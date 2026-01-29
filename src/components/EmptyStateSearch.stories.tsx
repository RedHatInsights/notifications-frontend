import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { EmptyStateSearch } from './EmptyStateSearch';
import { EmptyStateVariant } from '@patternfly/react-core';
import { SearchIcon, CubesIcon } from '@patternfly/react-icons';

const meta: Meta<typeof EmptyStateSearch> = {
  title: 'Components/EmptyStateSearch',
  component: EmptyStateSearch,
  parameters: {
    docs: {
      description: {
        component: `
**EmptyStateSearch** displays an empty state with a customizable icon, title, and description.

## Usage
Used throughout the application when search or filter results return no matches.

### Props
- \`title\`: The main heading text
- \`description\`: Supporting text below the title
- \`icon\`: Optional custom icon (defaults to SearchIcon)
- \`variant\`: PatternFly EmptyStateVariant for sizing
- \`headingLevel\`: HTML heading level (h1-h6)
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main heading text',
    },
    description: {
      control: 'text',
      description: 'Supporting description text',
    },
    variant: {
      control: 'select',
      options: [EmptyStateVariant.xs, EmptyStateVariant.sm, EmptyStateVariant.lg, EmptyStateVariant.xl, EmptyStateVariant.full],
      description: 'Size variant for the empty state',
    },
    headingLevel: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyStateSearch>;

export const Default: Story = {
  args: {
    title: 'No results found',
    description: 'No items match your search criteria. Try adjusting your filters or search terms.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state with search icon, commonly used for filter/search results.',
      },
    },
  },
};

export const NoNotifications: Story = {
  args: {
    title: 'No notifications found',
    description: 'There are no notifications matching your current filters.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state specifically for the notifications list.',
      },
    },
  },
};

export const NoIntegrations: Story = {
  args: {
    title: 'No integrations found',
    description: 'No integrations match your search. Create a new integration to get started.',
    icon: CubesIcon,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for integrations list with a custom icon.',
      },
    },
  },
};

export const SmallVariant: Story = {
  args: {
    title: 'No matches',
    description: 'Try different search terms.',
    variant: EmptyStateVariant.sm,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small variant for compact spaces like table rows.',
      },
    },
  },
};

export const LargeVariant: Story = {
  args: {
    title: 'No results found',
    description: 'Your search returned no results. Please try a different query or clear your filters to see all available items.',
    variant: EmptyStateVariant.lg,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large variant for full-page empty states.',
      },
    },
  },
};
