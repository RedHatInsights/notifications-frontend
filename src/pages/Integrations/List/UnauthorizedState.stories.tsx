import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { UnauthorizedState } from './UnauthorizedState';

const meta: Meta<typeof UnauthorizedState> = {
  title: 'Pages/Integrations/UnauthorizedState',
  component: UnauthorizedState,
  parameters: {
    docs: {
      description: {
        component: `
**UnauthorizedState** displays when a user does not have read permissions to view integrations.

## Usage
Shown on the Communications, Reporting & automation, and Webhooks tabs when users lack \`integrations:endpoints:read\` permissions.

### Features
- Informative alert explaining permission requirements
- Link to request access via the Virtual Assistant
- Clear messaging to contact organization administrator
- Lock icon and empty state pattern matching other unauthorized views

### When to Use
- User has no \`integrations:endpoints:read\` permission (RBAC check fails)
- API returns 401/403 even though RBAC check passed (permission mismatch)

This ensures non-org admin users see a proper empty state instead of an infinite loading spinner.
        `,
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof UnauthorizedState>;

/**
 * Default unauthorized state shown when users lack integrations read permissions.
 * This is the state non-org admin users see on the Communications, Reporting, and Webhooks tabs.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The default unauthorized state displayed when a user lacks `integrations:endpoints:read` permissions. Shows an alert with guidance on requesting access and an empty state explaining the permission requirement.',
      },
    },
  },
};

/**
 * This story demonstrates what the component looks like in a production environment.
 * The component uses react-intl for internationalization, so all text is properly translated.
 */
export const WithProductionData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The component in a production-like environment. All text uses internationalized messages via react-intl, ensuring proper translation support across different locales.',
      },
    },
  },
};
