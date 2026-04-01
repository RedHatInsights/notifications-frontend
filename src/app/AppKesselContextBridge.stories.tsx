import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import * as React from 'react';
import { expect, within } from 'storybook/test';

import { type Server, ServerStatus } from '../types/Server';
import { useAppContext } from './AppContext';
import { AppKesselContextBridge } from './AppKesselContextBridge';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';
import { createKesselWorkspaceAndAccessHandlers } from './rbac/msw/kesselRbacStoryHandlers';

const server: Server = { status: ServerStatus.RUNNING };

function RbacFromContextDisplay() {
  const { rbac } = useAppContext();
  return (
    <div data-testid="kessel-rbac-dump">
      <span data-testid="can-read-notifications">
        {rbac.canReadNotifications ? '1' : '0'}
      </span>
      <span data-testid="can-read-integrations">
        {rbac.canReadIntegrationsEndpoints ? '1' : '0'}
      </span>
      <span data-testid="can-read-events">
        {rbac.canReadEvents ? '1' : '0'}
      </span>
    </div>
  );
}

function MswBridgeStory() {
  const apiBaseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <AccessCheck.Provider baseUrl={apiBaseUrl} apiPath="/api/kessel/v1beta2">
      <KesselRbacAccessProvider>
        <AppKesselContextBridge server={server} isOrgAdmin={false}>
          <RbacFromContextDisplay />
        </AppKesselContextBridge>
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
}

const meta: Meta = {
  title: 'App/AppKesselContextBridge (MSW)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'End-to-end Storybook check: default workspace + Kessel `checkselfbulk` (rbac-config relations) populate `AppContext` via `AppKesselContextBridge`. Uses MSW handlers aligned with `kesselWorkspaceRelations.ts` order.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MswBridgeStory>;

export const AllKesselChecksAllowed: Story = {
  name: 'MSW — all relations allowed',
  render: () => <MswBridgeStory />,
  parameters: {
    msw: {
      handlers: createKesselWorkspaceAndAccessHandlers({
        allowNotificationsView: true,
        allowNotificationsEdit: true,
        allowIntegrationsEndpointsView: true,
        allowIntegrationsEndpointsEdit: true,
        allowEventsView: true,
        allowGroupsRead: true,
        allowPrincipalRead: true,
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('kessel-rbac-dump', {}, { timeout: 15000 })
    ).toBeInTheDocument();
    await expect(
      canvas.getByTestId('can-read-notifications')
    ).toHaveTextContent('1');
    await expect(canvas.getByTestId('can-read-integrations')).toHaveTextContent(
      '1'
    );
    await expect(canvas.getByTestId('can-read-events')).toHaveTextContent('1');
  },
};

export const NotificationsViewDenied: Story = {
  name: 'MSW — notifications_notifications_view denied',
  render: () => <MswBridgeStory />,
  parameters: {
    msw: {
      handlers: createKesselWorkspaceAndAccessHandlers({
        allowNotificationsView: false,
        allowNotificationsEdit: true,
        allowIntegrationsEndpointsView: true,
        allowIntegrationsEndpointsEdit: true,
        allowEventsView: true,
        allowGroupsRead: true,
        allowPrincipalRead: true,
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('kessel-rbac-dump', {}, { timeout: 15000 })
    ).toBeInTheDocument();
    await expect(
      canvas.getByTestId('can-read-notifications')
    ).toHaveTextContent('0');
  },
};
