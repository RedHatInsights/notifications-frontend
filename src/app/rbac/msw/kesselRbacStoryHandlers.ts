import { HttpResponse, http } from 'msw';

/**
 * MSW handlers for Kessel RBAC endpoints in Storybook stories.
 * Provides reusable factory functions for mocking workspace and permission responses.
 */

const KESSEL_RBAC_API_BASE = '/api/rbac/v2';

/**
 * Mock default workspace response
 */
export interface MockWorkspace {
  id: string;
  name: string;
  description?: string;
  type: 'default' | 'custom';
  created: string;
  modified: string;
}

/**
 * Creates a workspace list response handler
 * @param workspaces - Array of workspace objects to return
 */
export const createWorkspaceListHandler = (workspaces: MockWorkspace[]) => {
  return http.get(`${KESSEL_RBAC_API_BASE}/workspaces/`, () => {
    return HttpResponse.json({
      data: workspaces,
      meta: {
        count: workspaces.length,
      },
    });
  });
};

/**
 * Creates a default workspace with standard ID
 */
export const createDefaultWorkspace = (overrides?: Partial<MockWorkspace>): MockWorkspace => ({
  id: 'default-workspace-123',
  name: 'Default Workspace',
  description: 'Organization default workspace',
  type: 'default',
  created: '2024-01-01T00:00:00Z',
  modified: '2024-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Permission check result from Kessel bulk check endpoint
 */
export interface PermissionCheckResult {
  relation: string;
  permitted: boolean;
}

/**
 * Request body for bulk permission check
 */
interface BulkCheckRequest {
  checks: Array<{
    relation: string;
    resource: {
      id: string;
      type: string;
      reporter?: { type: string };
    };
  }>;
}

/**
 * Creates a bulk permission check response handler
 * @param permissions - Map of relation names to permitted status
 */
export const createBulkPermissionCheckHandler = (permissions: Record<string, boolean>) => {
  return http.post(`${KESSEL_RBAC_API_BASE}/check/self`, async ({ request }) => {
    const body = (await request.json()) as BulkCheckRequest;
    const checks = body.checks || [];

    const results = checks.map((check) => ({
      relation: check.relation,
      resource: check.resource,
      permitted: permissions[check.relation] ?? false,
    }));

    return HttpResponse.json({
      results,
    });
  });
};

/**
 * Permission preset: All permissions granted
 */
export const ALL_PERMISSIONS_GRANTED = {
  integrations_endpoints_edit: true,
  integrations_endpoints_view: true,
  notifications_events_view: true,
  notifications_notifications_edit: true,
  notifications_notifications_view: true,
  rbac_groups_read: true,
  rbac_principal_read: true,
};

/**
 * Permission preset: All permissions denied
 */
export const ALL_PERMISSIONS_DENIED = {
  integrations_endpoints_edit: false,
  integrations_endpoints_view: false,
  notifications_events_view: false,
  notifications_notifications_edit: false,
  notifications_notifications_view: false,
  rbac_groups_read: false,
  rbac_principal_read: false,
};

/**
 * Permission preset: Read-only access
 */
export const READ_ONLY_PERMISSIONS = {
  integrations_endpoints_edit: false,
  integrations_endpoints_view: true,
  notifications_events_view: true,
  notifications_notifications_edit: false,
  notifications_notifications_view: true,
  rbac_groups_read: true,
  rbac_principal_read: true,
};

/**
 * Permission preset: No RBAC permissions (for testing permission-denied states)
 */
export const NO_RBAC_PERMISSIONS = {
  ...ALL_PERMISSIONS_GRANTED,
  rbac_groups_read: false,
  rbac_principal_read: false,
};

/**
 * Creates standard Kessel RBAC handlers for Storybook
 * @param permissions - Permission map (defaults to all granted)
 * @param workspace - Optional workspace override
 */
export const createKesselRbacHandlers = (
  permissions: Record<string, boolean> = ALL_PERMISSIONS_GRANTED,
  workspace?: MockWorkspace
) => {
  const defaultWorkspace = workspace || createDefaultWorkspace();

  return [
    createWorkspaceListHandler([defaultWorkspace]),
    createBulkPermissionCheckHandler(permissions),
  ];
};

/**
 * Convenience: Handlers for all permissions granted (default happy path)
 */
export const kesselRbacGrantedHandlers = createKesselRbacHandlers(ALL_PERMISSIONS_GRANTED);

/**
 * Convenience: Handlers for all permissions denied
 */
export const kesselRbacDeniedHandlers = createKesselRbacHandlers(ALL_PERMISSIONS_DENIED);

/**
 * Convenience: Handlers for read-only access
 */
export const kesselRbacReadOnlyHandlers = createKesselRbacHandlers(READ_ONLY_PERMISSIONS);

/**
 * Convenience: Handlers with RBAC permissions denied (groups/principals)
 */
export const kesselRbacNoRbacHandlers = createKesselRbacHandlers(NO_RBAC_PERMISSIONS);
