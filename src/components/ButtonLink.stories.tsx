import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import {
  ArrowRightIcon,
  EditIcon,
  ExternalLinkAltIcon,
  PlusCircleIcon,
} from '@patternfly/react-icons';
import { ButtonLink } from './ButtonLink';

const meta: Meta<typeof ButtonLink> = {
  component: ButtonLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**ButtonLink** is a navigation component that combines PatternFly Button styling with React Router Link functionality.

## Features
- Combines Button visual styles with router-based navigation
- Automatically prefixes routes with Chrome bundle (\`/bundle/notifications\`)
- Supports all PatternFly Button variants (primary, secondary, tertiary, etc.)
- Supports all Button props (icons, sizes, disabled states)
- Integrates with React Router for client-side navigation
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ButtonLink>;

/**
 * Primary button link - the main call-to-action variant.
 * Uses solid blue background for high visibility.
 */
export const Primary: Story = {
  args: {
    to: '/integrations/create',
    variant: 'primary',
    children: 'Create integration',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify button is rendered with correct text
    const button = await canvas.findByRole('button', { name: 'Create integration' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-primary');

    // Verify it's wrapped in a link
    const link = button.closest('a');
    await expect(link).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary variant for main call-to-action navigation.',
      },
    },
  },
};

/**
 * Secondary button link - less prominent than primary.
 * Uses outlined style for secondary actions.
 */
export const Secondary: Story = {
  args: {
    to: '/settings',
    variant: 'secondary',
    children: 'View settings',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'View settings' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-secondary');
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary variant for less prominent navigation actions.',
      },
    },
  },
};

/**
 * Tertiary button link - minimal styling for subtle navigation.
 * No background or border, just text styling.
 */
export const Tertiary: Story = {
  args: {
    to: '/help',
    variant: 'tertiary',
    children: 'Learn more',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Learn more' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-tertiary');
  },
  parameters: {
    docs: {
      description: {
        story: 'Tertiary variant for subtle navigation with minimal styling.',
      },
    },
  },
};

/**
 * Link variant - styled as plain text link.
 * Appears as hyperlink text rather than button.
 */
export const Link: Story = {
  args: {
    to: '/documentation',
    variant: 'link',
    children: 'Read documentation',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Read documentation' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-link');
  },
  parameters: {
    docs: {
      description: {
        story: 'Link variant styled as plain text hyperlink.',
      },
    },
  },
};

/**
 * Danger variant - for destructive or warning navigation actions.
 * Uses red color scheme to indicate caution.
 */
export const Danger: Story = {
  args: {
    to: '/integrations/delete',
    variant: 'danger',
    children: 'Delete integration',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Delete integration' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-danger');
  },
  parameters: {
    docs: {
      description: {
        story: 'Danger variant for destructive or warning navigation actions.',
      },
    },
  },
};

/**
 * Button link with icon - demonstrates icon placement before text.
 * Icons provide visual context for the navigation action.
 */
export const WithIconStart: Story = {
  args: {
    to: '/integrations/new',
    variant: 'primary',
    icon: <PlusCircleIcon />,
    children: 'Add integration',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Add integration' });
    await expect(button).toBeInTheDocument();

    // Verify icon is present
    const icon = button.querySelector('svg');
    await expect(icon).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button link with icon positioned before text.',
      },
    },
  },
};

/**
 * Button link with icon at end - demonstrates trailing icon placement.
 * Commonly used for navigation or external link indicators.
 */
export const WithIconEnd: Story = {
  args: {
    to: '/integrations',
    variant: 'link',
    iconPosition: 'end',
    children: 'View all integrations',
    icon: <ArrowRightIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'View all integrations' });
    await expect(button).toBeInTheDocument();

    // Verify icon is present
    const icon = button.querySelector('svg');
    await expect(icon).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button link with trailing icon for directional navigation.',
      },
    },
  },
};

/**
 * External link style - uses external link icon to indicate navigation.
 * Useful for routes that lead to different contexts or sections.
 */
export const ExternalLinkStyle: Story = {
  args: {
    to: '/external/documentation',
    variant: 'link',
    iconPosition: 'end',
    children: 'External documentation',
    icon: <ExternalLinkAltIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'External documentation' });
    await expect(button).toBeInTheDocument();

    // Verify external link icon
    const icon = button.querySelector('svg');
    await expect(icon).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Button link with external link icon for context navigation.',
      },
    },
  },
};

/**
 * Icon-only button link - displays only icon without text.
 * Useful for compact navigation in toolbars or action menus.
 */
export const IconOnly: Story = {
  args: {
    to: '/edit',
    variant: 'plain',
    'aria-label': 'Edit',
    icon: <EditIcon />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Edit' });
    await expect(button).toBeInTheDocument();

    // Verify icon is present
    const icon = button.querySelector('svg');
    await expect(icon).toBeInTheDocument();

    // Verify no text content (icon only)
    expect(button).toHaveTextContent('');
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only button link for compact navigation. Requires aria-label for accessibility.',
      },
    },
  },
};

/**
 * Small size button link - compact variant for dense UI areas.
 * Useful in tables, cards, or toolbars with limited space.
 */
export const SmallSize: Story = {
  args: {
    to: '/view-details',
    variant: 'secondary',
    size: 'sm',
    children: 'View details',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'View details' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-small');
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant for compact navigation in dense UI areas.',
      },
    },
  },
};

/**
 * Large size button link - prominent variant for emphasis.
 * Useful for primary landing pages or important navigation.
 */
export const LargeSize: Story = {
  args: {
    to: '/get-started',
    variant: 'primary',
    size: 'lg',
    children: 'Get started',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Get started' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-display-lg');
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant for prominent navigation actions.',
      },
    },
  },
};

/**
 * Disabled button link - non-interactive state.
 * Prevents navigation when certain conditions aren't met.
 */
export const Disabled: Story = {
  args: {
    to: '/restricted',
    variant: 'primary',
    isDisabled: true,
    children: 'Restricted access',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Restricted access' });
    await expect(button).toBeInTheDocument();
    await expect(button).toBeDisabled();

    // Disabled buttons should not navigate
    await userEvent.click(button);
    // Navigation should not occur (verified by button remaining disabled)
    await expect(button).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: "Disabled state prevents navigation when conditions aren't met.",
      },
    },
  },
};

/**
 * Loading state button link - shows loading spinner.
 * Indicates navigation is in progress or pending.
 */
export const Loading: Story = {
  args: {
    to: '/processing',
    variant: 'primary',
    isLoading: true,
    children: 'Processing...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Processing...' });
    await expect(button).toBeInTheDocument();

    // Verify loading spinner is present
    const spinner = button.querySelector('.pf-v6-c-spinner');
    await expect(spinner).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner for pending navigation actions.',
      },
    },
  },
};

/**
 * Block-level button link - full width variant.
 * Spans entire container width, useful for mobile or narrow layouts.
 */
export const BlockLevel: Story = {
  args: {
    to: '/full-width',
    variant: 'primary',
    isBlock: true,
    children: 'Full width navigation',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Full width navigation' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('pf-m-block');
  },
  parameters: {
    docs: {
      description: {
        story: 'Block-level variant spans full container width.',
      },
    },
  },
};

/**
 * Multiple button links - demonstrates different styles together.
 * Common pattern for action groups or navigation menus.
 */
export const ActionGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <ButtonLink to="/save" variant="primary">
        Save
      </ButtonLink>
      <ButtonLink to="/cancel" variant="secondary">
        Cancel
      </ButtonLink>
      <ButtonLink to="/reset" variant="tertiary">
        Reset
      </ButtonLink>
      <ButtonLink to="/help" variant="link">
        Need help?
      </ButtonLink>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all buttons are present
    await expect(canvas.findByRole('button', { name: 'Save' })).resolves.toBeInTheDocument();
    await expect(canvas.findByRole('button', { name: 'Cancel' })).resolves.toBeInTheDocument();
    await expect(canvas.findByRole('button', { name: 'Reset' })).resolves.toBeInTheDocument();
    await expect(canvas.findByRole('button', { name: 'Need help?' })).resolves.toBeInTheDocument();

    // Verify different variants
    const saveButton = await canvas.findByRole('button', { name: 'Save' });
    await expect(saveButton).toHaveClass('pf-m-primary');

    const cancelButton = await canvas.findByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toHaveClass('pf-m-secondary');
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple button links in action group pattern showing different variants.',
      },
    },
  },
};

/**
 * Route with query parameters - demonstrates complex routing.
 * ButtonLink handles any valid React Router "to" prop value.
 */
export const WithQueryParameters: Story = {
  args: {
    to: '/search?query=notifications&sort=date',
    variant: 'link',
    children: 'Search notifications',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Search notifications' });
    await expect(button).toBeInTheDocument();

    // Verify link href (note: it will be prefixed with bundle path)
    const link = button.closest('a');
    expect(link?.getAttribute('href')).toContain('/search');
  },
  parameters: {
    docs: {
      description: {
        story: 'Button link with query parameters in route.',
      },
    },
  },
};

/**
 * Nested route navigation - demonstrates deep route paths.
 * Routes automatically get prefixed with Chrome bundle.
 */
export const NestedRoute: Story = {
  args: {
    to: '/integrations/slack/configure/channels',
    variant: 'secondary',
    children: 'Configure Slack channels',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole('button', { name: 'Configure Slack channels' });
    await expect(button).toBeInTheDocument();

    // Verify nested route in link
    const link = button.closest('a');
    expect(link?.getAttribute('href')).toContain('/integrations/slack/configure/channels');
  },
  parameters: {
    docs: {
      description: {
        story: 'Button link with deeply nested route path.',
      },
    },
  },
};

/**
 * Inline vs Block variants - demonstrates layout flexibility.
 * Shows how ButtonLink adapts to different layout contexts.
 */
export const InlineVsBlock: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <p>Inline buttons:</p>
        <ButtonLink to="/option-a" variant="primary" style={{ marginRight: '8px' }}>
          Option A
        </ButtonLink>
        <ButtonLink to="/option-b" variant="secondary">
          Option B
        </ButtonLink>
      </div>
      <div>
        <p>Block buttons:</p>
        <ButtonLink to="/full-width-a" variant="primary" isBlock style={{ marginBottom: '8px' }}>
          Full width option A
        </ButtonLink>
        <ButtonLink to="/full-width-b" variant="secondary" isBlock>
          Full width option B
        </ButtonLink>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify inline buttons
    const optionA = await canvas.findByRole('button', { name: 'Option A' });
    const optionB = await canvas.findByRole('button', { name: 'Option B' });
    await expect(optionA).toBeInTheDocument();
    await expect(optionB).toBeInTheDocument();

    // Verify block buttons
    const fullWidthA = await canvas.findByRole('button', { name: 'Full width option A' });
    const fullWidthB = await canvas.findByRole('button', { name: 'Full width option B' });
    await expect(fullWidthA).toHaveClass('pf-m-block');
    await expect(fullWidthB).toHaveClass('pf-m-block');
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of inline and block-level button link layouts.',
      },
    },
  },
};

/**
 * All variants showcase - comprehensive visual reference.
 * Displays all PatternFly button variants as navigation links.
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}
    >
      <ButtonLink to="/primary" variant="primary">
        Primary variant
      </ButtonLink>
      <ButtonLink to="/secondary" variant="secondary">
        Secondary variant
      </ButtonLink>
      <ButtonLink to="/tertiary" variant="tertiary">
        Tertiary variant
      </ButtonLink>
      <ButtonLink to="/danger" variant="danger">
        Danger variant
      </ButtonLink>
      <ButtonLink to="/warning" variant="warning">
        Warning variant
      </ButtonLink>
      <ButtonLink to="/link" variant="link">
        Link variant
      </ButtonLink>
      <ButtonLink to="/plain" variant="plain">
        Plain variant
      </ButtonLink>
      <ButtonLink to="/control" variant="control">
        Control variant
      </ButtonLink>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all variants are rendered
    await expect(
      canvas.findByRole('button', { name: 'Primary variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Secondary variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Tertiary variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Danger variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Warning variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Link variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Plain variant' })
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByRole('button', { name: 'Control variant' })
    ).resolves.toBeInTheDocument();

    // Verify variant classes
    const primaryButton = await canvas.findByRole('button', { name: 'Primary variant' });
    await expect(primaryButton).toHaveClass('pf-m-primary');

    const dangerButton = await canvas.findByRole('button', { name: 'Danger variant' });
    await expect(dangerButton).toHaveClass('pf-m-danger');
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all PatternFly button variants as navigation links.',
      },
    },
  },
};
