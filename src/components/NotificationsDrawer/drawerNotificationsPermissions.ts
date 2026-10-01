import { Access } from '@redhat-cloud-services/rbac-client';

export const DRAWER_NOTIFICATIONS_V1_PERMISSIONS = [
  'notifications:*:*',
  'notifications:notifications:read',
  'notifications:notifications:write',
] as const;

// Admin is write access specifically, so read-only users are excluded. This is a strict subset
// of DRAWER_NOTIFICATIONS_V1_PERMISSIONS: anyone who is an admin also has drawer permissions
export const DRAWER_NOTIFICATIONS_V1_ADMIN_PERMISSIONS = [
  'notifications:*:*',
  'notifications:notifications:write',
] as const;

const isDrawerNotificationsV1Permission = (permission: string | undefined): boolean =>
  DRAWER_NOTIFICATIONS_V1_PERMISSIONS.some((allowed) => allowed === permission);

const isDrawerNotificationsV1AdminPermission = (permission: string | undefined): boolean =>
  DRAWER_NOTIFICATIONS_V1_ADMIN_PERMISSIONS.some((allowed) => allowed === permission);

const matchesPermission = (
  permissions: Access[] | undefined,
  predicate: (permission: string | undefined) => boolean
): boolean =>
  permissions?.some((item) => {
    const permission = (typeof item === 'string' && item) || item?.permission;
    return predicate(permission);
  }) ?? false;

export const hasV1DrawerNotificationsPermissions = (permissions: Access[] | undefined): boolean =>
  matchesPermission(permissions, isDrawerNotificationsV1Permission);

export const hasV1DrawerNotificationsAdminPermissions = (
  permissions: Access[] | undefined
): boolean => matchesPermission(permissions, isDrawerNotificationsV1AdminPermission);
