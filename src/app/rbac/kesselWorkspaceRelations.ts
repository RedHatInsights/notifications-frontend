/**
 * Kessel workspace relations for notifications / integrations permissions.
 * Source: rbac-config notifications.ksl (v1-based → v2_perm mappings).
 * @see https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl
 *
 * v1 permission → v2 relation mapping:
 * - integrations:endpoints:write → integrations_endpoints_edit
 * - integrations:endpoints:read → integrations_endpoints_view
 * - notifications:events:read → notifications_events_view
 * - notifications:notifications:write → notifications_notifications_edit
 * - notifications:notifications:read → notifications_notifications_view
 *
 * Note: The wildcard v1 permission "notifications:*:*" expands to:
 * - notifications_events_view
 * - notifications_notifications_edit
 * - notifications_notifications_view
 */
export const KESSEL_WORKSPACE_RELATIONS = {
  // Integrations app permissions
  INTEGRATIONS_ENDPOINTS_EDIT: 'integrations_endpoints_edit',
  INTEGRATIONS_ENDPOINTS_VIEW: 'integrations_endpoints_view',

  // Notifications app permissions
  NOTIFICATIONS_EVENTS_VIEW: 'notifications_events_view',
  NOTIFICATIONS_NOTIFICATIONS_EDIT: 'notifications_notifications_edit',
  NOTIFICATIONS_NOTIFICATIONS_VIEW: 'notifications_notifications_view',

  // RBAC permissions (for group and principal access)
  RBAC_GROUPS_READ: 'rbac_groups_read',
  RBAC_PRINCIPAL_READ: 'rbac_principal_read',
} as const;

/**
 * Ordered array of all relations for bulk checking
 */
export const KESSEL_WORKSPACE_RELATIONS_ORDERED = [
  KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_VIEW,
  KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_EDIT,
  KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW,
  KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT,
  KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_EVENTS_VIEW,
  KESSEL_WORKSPACE_RELATIONS.RBAC_GROUPS_READ,
  KESSEL_WORKSPACE_RELATIONS.RBAC_PRINCIPAL_READ,
] as const;

export type KesselWorkspaceRelation = (typeof KESSEL_WORKSPACE_RELATIONS_ORDERED)[number];
