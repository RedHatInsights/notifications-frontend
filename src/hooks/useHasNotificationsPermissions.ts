import { useKesselRbacAccess } from '../app/rbac/KesselRbacAccessContext';

export const useV2HasNotificationsPermissions = (): boolean | undefined => {
  const { permissions, isLoading, workspaceId } = useKesselRbacAccess();

  if (isLoading) {
    return undefined;
  }

  if (!workspaceId) {
    return false;
  }

  return permissions.canViewNotifications || permissions.canEditNotifications;
};
