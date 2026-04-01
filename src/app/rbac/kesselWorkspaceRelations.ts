/**
 * Kessel workspace relations for notifications / integrations permissions.
 * Source: rbac-config notifications.ksl (v1-based → v2_perm mappings).
 * @see https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl
 */
export const KESSEL_WORKSPACE_RELATIONS_ORDERED = [
  'notifications_notifications_view',
  'notifications_notifications_edit',
  'integrations_endpoints_view',
  'integrations_endpoints_edit',
  'notifications_events_view',
  'rbac_groups_read',
  'rbac_principal_read',
] as const;

export type KesselWorkspaceRelation =
  (typeof KESSEL_WORKSPACE_RELATIONS_ORDERED)[number];
