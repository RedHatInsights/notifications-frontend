import { HttpResponse, type RequestHandler, http } from 'msw';

import {
  KESSEL_WORKSPACE_RELATIONS_ORDERED,
  type KesselWorkspaceRelation,
} from '../kesselWorkspaceRelations';

/** Default workspace id used in Storybook / tests (must match seeded group UUIDs if principals are requested). */
export const STORY_DEFAULT_WORKSPACE_ID =
  '00000000-0000-0000-0000-0000000000aa';

/** List only: `/api/rbac/v1/groups` or `/api/rbac/v1/groups/` with optional query — not `.../groups/<id>/principals/`. */
const RBAC_V1_GROUPS_LIST_PATH = /\/api\/rbac\/v1\/groups\/?(?:\?[^#]*)?$/;

/** Default workspace list (e.g. `?type=default`) without matching subpaths. */
const RBAC_V2_WORKSPACES_LIST_PATH =
  /\/api\/rbac\/v2\/workspaces\/?(?:\?[^#]*)?$/;

export type KesselBulkAllowOptions = {
  allowNotificationsView?: boolean;
  allowNotificationsEdit?: boolean;
  allowIntegrationsEndpointsView?: boolean;
  allowIntegrationsEndpointsEdit?: boolean;
  allowEventsView?: boolean;
  allowGroupsRead?: boolean;
  allowPrincipalRead?: boolean;
};

function relationAllowFromOptions(
  options: KesselBulkAllowOptions
): Record<KesselWorkspaceRelation, boolean> {
  return {
    notifications_notifications_view: options.allowNotificationsView ?? true,
    notifications_notifications_edit: options.allowNotificationsEdit ?? true,
    integrations_endpoints_view: options.allowIntegrationsEndpointsView ?? true,
    integrations_endpoints_edit: options.allowIntegrationsEndpointsEdit ?? true,
    notifications_events_view: options.allowEventsView ?? true,
    rbac_groups_read: options.allowGroupsRead ?? true,
    rbac_principal_read: options.allowPrincipalRead ?? true,
  };
}

function kesselBulkPairsFromOptions(
  options: KesselBulkAllowOptions
): { item: { allowed: string } }[] {
  const allowByRelation = relationAllowFromOptions(options);

  return KESSEL_WORKSPACE_RELATIONS_ORDERED.map((relation) => ({
    item: {
      allowed: allowByRelation[relation] ? 'ALLOWED_TRUE' : 'ALLOWED_FALSE',
    },
  }));
}

/**
 * MSW handlers for Kessel access checks + RBAC v2 default workspace.
 * Used by Storybook stories that mount {@link KesselRbacAccessProvider} with real fetches.
 */
export function createKesselWorkspaceAndAccessHandlers(
  options: KesselBulkAllowOptions = {}
): RequestHandler[] {
  const workspace = http.get(RBAC_V2_WORKSPACES_LIST_PATH, () =>
    HttpResponse.json({
      data: [
        {
          id: STORY_DEFAULT_WORKSPACE_ID,
          type: 'default',
          name: 'Default',
          created: '2020-01-01T00:00:00.000Z',
          modified: '2020-01-01T00:00:00.000Z',
        },
      ],
    })
  );

  const kesselBulk = http.post(/\/api\/kessel\/v1beta2\/checkselfbulk/, () =>
    HttpResponse.json({
      pairs: kesselBulkPairsFromOptions(options),
    })
  );

  return [workspace, kesselBulk];
}

/** Seeded groups for User Access Groups Storybook stories (stable ids for selection tests). */
export const STORY_USER_ACCESS_GROUPS = [
  {
    uuid: '10000000-0000-0000-0000-000000000001',
    name: 'Admin Group',
    principalCount: 5,
    admin_default: true,
    platform_default: false,
    system: false,
  },
  {
    uuid: '20000000-0000-0000-0000-000000000002',
    name: 'Platform Default',
    principalCount: 100,
    admin_default: false,
    platform_default: true,
    system: false,
  },
  {
    uuid: '30000000-0000-0000-0000-000000000003',
    name: 'Engineering Team',
    principalCount: 15,
    admin_default: false,
    platform_default: false,
    system: false,
  },
] as const;

export function createRbacGroupsListHandler(
  groups: ReadonlyArray<{
    uuid: string;
    name: string;
    principalCount?: number;
    admin_default?: boolean;
    platform_default?: boolean;
    system?: boolean;
  }>
): RequestHandler {
  return http.get(RBAC_V1_GROUPS_LIST_PATH, () =>
    HttpResponse.json({
      data: groups.map((g) => ({
        name: g.name,
        uuid: g.uuid,
        description: '',
        principalCount: g.principalCount ?? 0,
        admin_default: g.admin_default ?? false,
        platform_default: g.platform_default ?? false,
        system: g.system ?? false,
        created: '2020-01-01T00:00:00.000Z',
        modified: '2020-01-01T00:00:00.000Z',
      })),
      meta: { count: groups.length },
    })
  );
}

export function createGroupPrincipalsHandler(
  principals: ReadonlyArray<{ username: string; email?: string }>
): RequestHandler {
  return http.get(/\/api\/rbac\/v1\/groups\/[^/]+\/principals\//, () =>
    HttpResponse.json({
      data: principals.map((p) => ({
        username: p.username,
        email: p.email ?? `${p.username}`,
        first_name: 'Test',
        last_name: 'User',
        is_active: true,
        is_org_admin: false,
      })),
      meta: { count: principals.length },
    })
  );
}

export const STORY_GROUP_PRINCIPALS = [
  { username: 'user1@example.com', email: 'user1@example.com' },
  { username: 'user2@example.com', email: 'user2@example.com' },
] as const;

/**
 * Full MSW setup for {@link UserAccessGroupsDataView} with real Kessel + group providers.
 */
export function createUserAccessGroupsMswHandlers(
  options: KesselBulkAllowOptions = {}
): RequestHandler[] {
  return [
    ...createKesselWorkspaceAndAccessHandlers(options),
    createRbacGroupsListHandler([...STORY_USER_ACCESS_GROUPS]),
    createGroupPrincipalsHandler([...STORY_GROUP_PRINCIPALS]),
  ];
}
