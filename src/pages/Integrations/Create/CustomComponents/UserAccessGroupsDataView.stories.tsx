import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { KesselRbacAccessProvider } from '../../../../app/rbac/KesselRbacAccessProvider';
import {
  KesselRbacAccessContext,
  type KesselRbacAccessContextValue,
  defaultKesselRbacAccess,
} from '../../../../app/rbac/KesselRbacAccessContext';
import {
  type RbacGroup,
  RbacGroupContext,
} from '../../../../app/rbac/RbacGroupContext';
import { RbacGroupContextProvider } from '../../../../app/rbac/RbacGroupContextProvider';
import {
  STORY_USER_ACCESS_GROUPS,
  createUserAccessGroupsMswHandlers,
} from '../../../../app/rbac/msw/kesselRbacStoryHandlers';
import UserAccessGroupsDataView from './UserAccessGroupsDataView';

const FIELD_NAME = 'user-access-groups';

const schema = {
  fields: [
    {
      component: 'user-access-groups',
      name: FIELD_NAME,
      label: 'User Access Groups',
      isRequired: true,
    },
  ],
};

const customMapper = {
  ...componentMapper,
  'user-access-groups': UserAccessGroupsDataView,
};

function mapSeedToRbacGroups(): RbacGroup[] {
  return STORY_USER_ACCESS_GROUPS.map((g) => ({
    id: g.uuid,
    name: g.name,
    principalCount: g.principalCount,
    admin_default: g.admin_default,
    platform_default: g.platform_default,
    system: g.system,
  }));
}

function UserAccessGroupsStubStory({
  kessel,
  groupsState,
}: {
  kessel: KesselRbacAccessContextValue;
  groupsState: { groups: ReadonlyArray<RbacGroup>; isLoading: boolean };
}) {
  return (
    <KesselRbacAccessContext.Provider value={kessel}>
      <RbacGroupContext.Provider value={groupsState}>
        <FormRenderer
          schema={schema}
          componentMapper={customMapper}
          onSubmit={fn()}
          onCancel={fn()}
          initialValues={{}}
        />
      </RbacGroupContext.Provider>
    </KesselRbacAccessContext.Provider>
  );
}

function UserAccessGroupsMswStory() {
  const apiBaseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <AccessCheck.Provider baseUrl={apiBaseUrl} apiPath="/api/kessel/v1beta2">
      <KesselRbacAccessProvider>
        <RbacGroupContextProvider>
          <FormRenderer
            schema={schema}
            componentMapper={customMapper}
            onSubmit={fn()}
            onCancel={fn()}
            initialValues={{}}
          />
        </RbacGroupContextProvider>
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
}

const meta: Meta<typeof UserAccessGroupsStubStory> = {
  title: 'Integrations/UserAccessGroupsDataView',
  component: UserAccessGroupsStubStory,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Email integration step: pick User Access Groups. Kessel relations from rbac-config (e.g. `rbac_groups_read` / `rbac_principal_read`) gate listing groups and viewing principals; V1 group APIs still fetch data when allowed.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserAccessGroupsStubStory>;

export const StubAllPermissionsAllowed: Story = {
  name: 'Stub — groups and principals allowed',
  args: {
    kessel: {
      ...defaultKesselRbacAccess,
      isLoading: false,
      canReadNotifications: true,
      canWriteNotifications: true,
      canReadIntegrationsEndpoints: true,
      canWriteIntegrationsEndpoints: true,
      canReadEvents: true,
      canReadRbacGroups: true,
      canReadRbacPrincipals: true,
    },
    groupsState: {
      groups: mapSeedToRbacGroups(),
      isLoading: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText('Engineering Team', {}, { timeout: 5000 })
    ).toBeInTheDocument();
  },
};

export const StubGroupsReadDenied: Story = {
  name: 'Stub — rbac_groups_read denied',
  args: {
    kessel: {
      ...defaultKesselRbacAccess,
      isLoading: false,
      canReadRbacGroups: false,
      canReadRbacPrincipals: false,
    },
    groupsState: {
      groups: [],
      isLoading: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/No User Access Groups are available/i)
    ).toBeInTheDocument();
  },
};

export const StubPrincipalReadDenied: Story = {
  name: 'Stub — rbac_principal_read denied',
  args: {
    kessel: {
      ...defaultKesselRbacAccess,
      isLoading: false,
      canReadRbacGroups: true,
      canReadRbacPrincipals: false,
    },
    groupsState: {
      groups: mapSeedToRbacGroups(),
      isLoading: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(/viewing users requires permission/i)
    ).toBeInTheDocument();
  },
};

export const StubKesselLoading: Story = {
  name: 'Stub — Kessel checks loading',
  args: {
    kessel: {
      ...defaultKesselRbacAccess,
      isLoading: true,
      canReadRbacGroups: false,
      canReadRbacPrincipals: false,
    },
    groupsState: {
      groups: [],
      isLoading: true,
    },
  },
};

/** Real {@link KesselRbacAccessProvider} + {@link RbacGroupContextProvider} with MSW. */
export const MswFullStackAllowed: StoryObj<typeof UserAccessGroupsMswStory> = {
  name: 'MSW — full stack (Kessel + V1 groups)',
  render: () => <UserAccessGroupsMswStory />,
  parameters: {
    msw: {
      handlers: createUserAccessGroupsMswHandlers({
        allowGroupsRead: true,
        allowPrincipalRead: true,
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Engineering Team', {}, { timeout: 15000 });
    const row = canvas.getByText('Engineering Team').closest('tr');
    if (!row) {
      throw new Error('Expected table row for Engineering Team');
    }
    const viewBtn = within(row).getByRole('button', { name: /^View/i });
    await userEvent.click(viewBtn);
    await expect(
      await canvas.findByText('user1@example.com', {}, { timeout: 10000 })
    ).toBeInTheDocument();
  },
};

export const MswPrincipalReadDenied: StoryObj<typeof UserAccessGroupsMswStory> =
  {
    name: 'MSW — principal read denied',
    render: () => <UserAccessGroupsMswStory />,
    parameters: {
      msw: {
        handlers: createUserAccessGroupsMswHandlers({
          allowGroupsRead: true,
          allowPrincipalRead: false,
        }),
      },
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await canvas.findByText('Engineering Team', {}, { timeout: 15000 });
      await expect(
        canvas.getByText(/viewing users requires permission/i)
      ).toBeInTheDocument();
    },
  };
