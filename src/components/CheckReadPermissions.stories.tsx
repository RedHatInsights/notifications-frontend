import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';

import { linkTo } from '../Routes';
import { CheckReadPermissions } from './CheckReadPermissions';

/** Mirrors `.storybook/preview.tsx` defaults — Kessel-mapped flags surface here as `AppContext.rbac`. */
const defaultRbac = {
  canWriteNotifications: true,
  canWriteIntegrationsEndpoints: true,
  canReadIntegrationsEndpoints: true,
  canReadNotifications: true,
  canReadEvents: true,
};

const meta: Meta<typeof CheckReadPermissions> = {
  title: 'App/CheckReadPermissions',
  component: CheckReadPermissions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Route guard that reads `AppContext.rbac` (populated from Kessel workspace relations in production). Stories override `parameters.appContext.rbac` and `parameters.chrome` to mirror `notifications_notifications_view`, `integrations_endpoints_view`, and `notifications_events_view` without calling the API.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckReadPermissions>;

const protectedContent = (
  <div data-testid="protected-content">Protected content</div>
);

/**
 * Inner router so `useLocation` matches Kessel scenarios (e.g. event log path).
 */
function RouterShell({
  initialPath,
  children,
}: React.PropsWithChildren<{ initialPath: string }>) {
  return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
}

export const NotificationsReadAllowed: Story = {
  name: 'Notifications — read allowed',
  parameters: {
    chrome: {
      getApp: () => 'notifications',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadNotifications: true,
      },
    },
  },
  render: () => (
    <RouterShell initialPath="/configure-events">
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('protected-content')
    ).toBeInTheDocument();
  },
};

export const NotificationsReadDenied: Story = {
  name: 'Notifications — read denied',
  parameters: {
    chrome: {
      getApp: () => 'notifications',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadNotifications: false,
      },
    },
  },
  render: () => (
    <RouterShell initialPath="/configure-events">
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/Contact your organization administrator/i)
    ).toBeInTheDocument();
  },
};

export const IntegrationsReadAllowed: Story = {
  name: 'Integrations — endpoints read allowed',
  parameters: {
    chrome: {
      getApp: () => 'integrations',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadIntegrationsEndpoints: true,
      },
    },
  },
  render: () => (
    <RouterShell initialPath="/settings/integrations">
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('protected-content')
    ).toBeInTheDocument();
  },
};

export const IntegrationsReadDenied: Story = {
  name: 'Integrations — endpoints read denied',
  parameters: {
    chrome: {
      getApp: () => 'integrations',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadIntegrationsEndpoints: false,
      },
    },
  },
  render: () => (
    <RouterShell initialPath="/settings/integrations">
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/Contact your organization administrator/i)
    ).toBeInTheDocument();
  },
};

export const EventLogReadAllowed: Story = {
  name: 'Event log — events read allowed',
  parameters: {
    chrome: {
      getApp: () => 'notifications',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadEvents: true,
      },
    },
  },
  render: () => (
    <RouterShell initialPath={linkTo.eventLog()}>
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('protected-content')
    ).toBeInTheDocument();
  },
};

export const EventLogReadDenied: Story = {
  name: 'Event log — events read denied',
  parameters: {
    chrome: {
      getApp: () => 'notifications',
    },
    appContext: {
      rbac: {
        ...defaultRbac,
        canReadEvents: false,
        canReadNotifications: true,
      },
    },
  },
  render: () => (
    <RouterShell initialPath={linkTo.eventLog()}>
      <CheckReadPermissions>{protectedContent}</CheckReadPermissions>
    </RouterShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/Contact your organization administrator/i)
    ).toBeInTheDocument();
  },
};
