import { HttpResponse, type RequestHandler, http } from 'msw';
import { KESSEL_WORKSPACE_RELATIONS_ORDERED } from '../kesselWorkspaceRelations';

/** Default workspace id used in Storybook / tests (must match seeded group UUIDs if principals are requested). */
export const STORY_DEFAULT_WORKSPACE_ID =
  '00000000-0000-0000-0000-0000000000aa';

export type KesselBulkAllowOptions = {
  allowNotificationsView?: boolean;
  allowNotificationsEdit?: boolean;
  allowIntegrationsEndpointsView?: boolean;
  allowIntegrationsEndpointsEdit?: boolean;
  allowEventsView?: boolean;
  allowGroupsRead?: boolean;
  allowPrincipalRead?: boolean;
};

function kesselBulkPairsFromOptions(
  options: KesselBulkAllowOptions
): { item: { allowed: string } }[] {
  const allowedFor = (
    relation: (typeof KESSEL_WORKSPACE_RELATIONS_ORDERED)[number]
  ) => {
    switch (relation) {
      case 'notifications_notifications_view':
        return options.allowNotificationsView ?? true;
      case 'notifications_notifications_edit':
        return options.allowNotificationsEdit ?? true;
      case 'integrations_endpoints_view':
        return options.allowIntegrationsEndpointsView ?? true;
      case 'integrations_endpoints_edit':
        return options.allowIntegrationsEndpointsEdit ?? true;
      case 'notifications_events_view':
        return options.allowEventsView ?? true;
      case 'rbac_groups_read':
        return options.allowGroupsRead ?? true;
      case 'rbac_principal_read':
        return options.allowPrincipalRead ?? true;
    }
  };

  return KESSEL_WORKSPACE_RELATIONS_ORDERED.map((relation) => ({
    item: {
      allowed: allowedFor(relation) ? 'ALLOWED_TRUE' : 'ALLOWED_FALSE',
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
  const workspace = http.get(/\/api\/rbac\/v2\/workspaces\//, () =>
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
  return http.get(/\/api\/rbac\/v1\/groups\//, () =>
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
