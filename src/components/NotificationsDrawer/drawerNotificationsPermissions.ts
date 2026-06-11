import { Access } from '@redhat-cloud-services/rbac-client';

export const DRAWER_NOTIFICATIONS_V1_PERMISSIONS = [
  'notifications:*:*',
  'notifications:notifications:read',
  'notifications:notifications:write',
] as const;

const isDrawerNotificationsV1Permission = (permission: string | undefined): boolean =>
  DRAWER_NOTIFICATIONS_V1_PERMISSIONS.some((allowed) => allowed === permission);

export const hasV1DrawerNotificationsPermissions = (permissions: Access[] | undefined): boolean =>
  permissions?.some((item) => {
    const permission = (typeof item === 'string' && item) || item?.permission;
    return isDrawerNotificationsV1Permission(permission);
  }) ?? false;
