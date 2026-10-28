import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { RecipientTypeahead } from './RecipientTypeahead';
import { RecipientContextProvider } from '../RecipientContext';
import { useGetRecipients } from '../useGetRecipients';
import { RbacGroupContextProvider } from '../../../app/rbac/RbacGroupContextProvider';
import { KesselRbacAccessProvider } from '../../../app/rbac/KesselRbacAccessProvider';
import { HttpResponse, http } from 'msw';

/**
 * User journeys for the behavior group email recipients dropdown.
 *
 * The dropdown must show a "User Access Groups" section (RBAC groups) whenever
 * the user can read them:
 * - v1 org (`orgOptedIn: false`): the Kessel chain does not run; groups come
 *   from the RBAC API, which enforces access itself.
 * - v2 org (`orgOptedIn: true`): groups are gated on the Kessel
 *   `rbac_groups_read` relation, checked at TENANT scope by the app and
 *   resolved by the hub's Kessel mock from `tenantPermissions`.
 *
 * These stories pin the regression where v1 orgs (and v2 orgs with
 * tenant-scoped group permissions) silently lost the groups section.
 *
 * Everything Kessel is driven by the hub's mock state — the same import
 * surface as the real SDK, controlled per story via parameters.
 */

// Shape must satisfy the generated GroupOut schema (name, uuid, created,
// modified) — the fetching client validates responses against it.
const ts = '2026-01-01T00:00:00Z';
const mockGroups = [
  {
    uuid: '11111111-1111-1111-1111-111111111111',
    name: 'Admin Group',
    principalCount: 5,
    admin_default: true,
    created: ts,
    modified: ts,
  },
  {
    uuid: '22222222-2222-2222-2222-222222222222',
    name: 'Platform Default',
    principalCount: 100,
    platform_default: true,
    created: ts,
    modified: ts,
  },
  {
    uuid: '33333333-3333-3333-3333-333333333333',
    name: 'Engineering Team',
    principalCount: 15,
    created: ts,
    modified: ts,
  },
];

// The groups list is real HTTP (react-fetching-library), so it stays on MSW.
// The call counter lets the denied journey assert the fetch never fires
// (a plain absence assertion could pass before permission resolution).
let rbacGroupsCallCount = 0;
const rbacGroupsHandler = http.get('/api/rbac/v1/groups/', () => {
  rbacGroupsCallCount++;
  return HttpResponse.json({
    meta: { count: mockGroups.length },
    data: mockGroups,
  });
});

/**
 * Wires the real recipient getter (groups from RbacGroupContext) into the
 * context the wizard normally provides. Must render BELOW
 * RbacGroupContextProvider — useGetRecipients reads that context.
 */
const RecipientWiring: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getNotificationRecipients = useGetRecipients();
  const recipientContextValue = React.useMemo(
    () => ({
      getNotificationRecipients,
      getIntegrations: async () => [],
    }),
    [getNotificationRecipients]
  );

  return (
    <RecipientContextProvider value={recipientContextValue}>{children}</RecipientContextProvider>
  );
};

const JourneyProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <KesselRbacAccessProvider>
    <RbacGroupContextProvider>
      <RecipientWiring>{children}</RecipientWiring>
    </RbacGroupContextProvider>
  </KesselRbacAccessProvider>
);

const meta: Meta<typeof RecipientTypeahead> = {
  title: 'Notifications/RecipientTypeahead Journeys',
  component: RecipientTypeahead,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <JourneyProviders>
        <Story />
      </JourneyProviders>
    ),
  ],
  args: {
    selected: [],
    onSelected: () => {},
    onClear: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof RecipientTypeahead>;

const renderJourney = () => (
  <RecipientTypeahead selected={[]} onSelected={() => {}} onClear={() => {}} />
);

/**
 * Journey: v1 org. The Kessel chain does not run; the RBAC groups API serves
 * the list and enforces access itself. The "User Access Groups" section MUST
 * be present.
 */
export const V1OrgSeesRbacGroups: Story = {
  parameters: {
    orgOptedIn: false,
    msw: { handlers: [rbacGroupsHandler] },
  },
  render: renderJourney,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    // The PF Select menu renders in a portal on document.body, outside the
    // canvas element — post-click queries must be scoped to document.body.
    const menu = await within(document.body).findByRole('listbox', {}, { timeout: 5000 });
    await waitFor(async () => {
      await expect(within(menu).getByText('User Access Groups')).toBeInTheDocument();
      await expect(within(menu).getByText('Engineering Team')).toBeInTheDocument();
    });
  },
};

/**
 * Journey: v2 org, all Kessel permissions granted (including tenant-scoped
 * rbac_groups_read). The groups section MUST be present.
 */
export const V2OrgGrantedSeesRbacGroups: Story = {
  parameters: {
    orgOptedIn: true,
    tenantPermissions: { rbac_groups_read: true, rbac_principal_read: true },
    msw: { handlers: [rbacGroupsHandler] },
  },
  render: renderJourney,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    const menu = await within(document.body).findByRole('listbox', {}, { timeout: 5000 });
    await waitFor(async () => {
      await expect(within(menu).getByText('User Access Groups')).toBeInTheDocument();
      await expect(within(menu).getByText('Engineering Team')).toBeInTheDocument();
    });
  },
};

/**
 * Journey: v2 org, Kessel explicitly denies rbac_groups_read. The groups
 * section MUST be absent — only the static "Users" section renders.
 */
export const V2OrgDeniedSeesNoRbacGroups: Story = {
  parameters: {
    orgOptedIn: true,
    tenantPermissions: { rbac_groups_read: false, rbac_principal_read: false },
    msw: { handlers: [rbacGroupsHandler] },
  },
  render: renderJourney,
  play: async ({ canvasElement }) => {
    rbacGroupsCallCount = 0;
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    const menu = await within(document.body).findByRole('listbox', {}, { timeout: 5000 });
    // Users section always renders
    await expect(within(menu).getAllByRole('option').length).toBeGreaterThanOrEqual(2);
    // Give the (mocked, synchronous) permission chain a tick to settle, then
    // assert both the absence and — deterministically — that the groups
    // endpoint was never asked.
    await waitFor(async () => {
      await expect(within(menu).queryByText('User Access Groups')).not.toBeInTheDocument();
    });
    await expect(within(menu).queryByText('Engineering Team')).not.toBeInTheDocument();
    await expect(rbacGroupsCallCount).toBe(0);
  },
};
