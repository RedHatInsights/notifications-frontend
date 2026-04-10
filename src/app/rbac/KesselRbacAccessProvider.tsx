import React, { useEffect, useMemo, useState } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { KesselRbacAccessContext, KesselRbacAccessContextValue } from './KesselRbacAccessContext';
import { KESSEL_WORKSPACE_RELATIONS } from './kesselWorkspaceRelations';
import { useDefaultWorkspace } from './hooks/useDefaultWorkspace';

/**
 * Provider that fetches the default workspace and checks all Kessel v2 permissions.
 * Wraps children with KesselRbacAccessContext to expose workspace ID and permission results.
 *
 * Usage:
 * ```tsx
 * import { AccessCheck } from '@project-kessel/react-kessel-access-check';
 *
 * <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/rbac/v2">
 *   <KesselRbacAccessProvider>
 *     <App />
 *   </KesselRbacAccessProvider>
 * </AccessCheck.Provider>
 * ```
 */
export const KesselRbacAccessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);

  // Fetch the default workspace ID
  const {
    workspaceId: defaultWorkspaceId,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useDefaultWorkspace();

  // Track workspace errors
  useEffect(() => {
    if (workspaceError) {
      setErrors((prev) => [...prev, workspaceError]);
    }
  }, [workspaceError]);

  // Build workspace resource for permission checks
  // Only create resource if workspace ID is available
  const workspace = useMemo(() => {
    if (!defaultWorkspaceId) {
      // Return a placeholder - permission hooks will handle undefined gracefully
      return {
        id: '',
        type: 'workspace' as const,
        reporter: { type: 'rbac' as const },
      };
    }
    return {
      id: defaultWorkspaceId,
      type: 'workspace' as const,
      reporter: { type: 'rbac' as const },
    };
  }, [defaultWorkspaceId]);

  // Permission checks - using v0.5.0 API which returns { loading, error, data }
  const integrationsEndpointsEdit = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT,
    resource: workspace,
  });

  const integrationsEndpointsView = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW,
    resource: workspace,
  });

  const notificationsEventsView = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_EVENTS_VIEW,
    resource: workspace,
  });

  const notificationsNotificationsEdit = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_EDIT,
    resource: workspace,
  });

  const notificationsNotificationsView = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_VIEW,
    resource: workspace,
  });

  const rbacGroupsRead = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.RBAC_GROUPS_READ,
    resource: workspace,
  });

  const rbacPrincipalRead = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.RBAC_PRINCIPAL_READ,
    resource: workspace,
  });

  // Aggregate loading states
  const isLoading =
    isLoadingWorkspace ||
    integrationsEndpointsEdit.loading ||
    integrationsEndpointsView.loading ||
    notificationsEventsView.loading ||
    notificationsNotificationsEdit.loading ||
    notificationsNotificationsView.loading ||
    rbacGroupsRead.loading ||
    rbacPrincipalRead.loading;

  // Build context value
  const contextValue: KesselRbacAccessContextValue = useMemo(
    () => ({
      workspaceId: defaultWorkspaceId,
      isLoading,
      permissions: {
        // Only grant permissions if workspace is loaded and check returned allowed=true
        canEditIntegrationsEndpoints:
          !!defaultWorkspaceId && (integrationsEndpointsEdit.data?.allowed ?? false),
        canViewIntegrationsEndpoints:
          !!defaultWorkspaceId && (integrationsEndpointsView.data?.allowed ?? false),
        canViewNotificationsEvents:
          !!defaultWorkspaceId && (notificationsEventsView.data?.allowed ?? false),
        canEditNotifications:
          !!defaultWorkspaceId && (notificationsNotificationsEdit.data?.allowed ?? false),
        canViewNotifications:
          !!defaultWorkspaceId && (notificationsNotificationsView.data?.allowed ?? false),
        canReadRbacGroups: !!defaultWorkspaceId && (rbacGroupsRead.data?.allowed ?? false),
        canReadRbacPrincipal: !!defaultWorkspaceId && (rbacPrincipalRead.data?.allowed ?? false),
      },
      errors,
    }),
    [
      defaultWorkspaceId,
      isLoading,
      integrationsEndpointsEdit.data?.allowed,
      integrationsEndpointsView.data?.allowed,
      notificationsEventsView.data?.allowed,
      notificationsNotificationsEdit.data?.allowed,
      notificationsNotificationsView.data?.allowed,
      rbacGroupsRead.data?.allowed,
      rbacPrincipalRead.data?.allowed,
      errors,
    ]
  );

  return (
    <KesselRbacAccessContext.Provider value={contextValue}>
      {children}
    </KesselRbacAccessContext.Provider>
  );
};
