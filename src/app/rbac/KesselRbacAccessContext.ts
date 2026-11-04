import { createContext, useContext } from 'react';

/**
 * Context for Kessel v2 RBAC access checks.
 * Provides workspace ID and permission check results for all relations.
 */
export interface KesselRbacAccessContextValue {
  /**
   * Whether the current org is onboarded to RBAC v2 (Kessel), from
   * `GET /api/rbac/v1/tenant/opt-in/` via Chrome's `isKesselOrgOnboarded`.
   * `undefined` while detection is pending. On the v1 path (`false`) the
   * Kessel chain does not run and consumers must use their v1 fallbacks.
   */
  isOrgV2: boolean | undefined;

  /**
   * Default workspace ID from /api/rbac/v2/workspaces/?type=default
   */
  workspaceId: string | undefined;

  /**
   * Whether the workspace and permissions are still loading
   */
  isLoading: boolean;

  /**
   * Permission check results
   */
  permissions: {
    // Integrations permissions
    canEditIntegrationsEndpoints: boolean;
    canViewIntegrationsEndpoints: boolean;

    // Notifications permissions
    canViewNotificationsEvents: boolean;
    canEditNotifications: boolean;
    canViewNotifications: boolean;

    // RBAC permissions
    canReadRbacGroups: boolean;
    canReadRbacPrincipal: boolean;
  };

  /**
   * Errors encountered during workspace or permission fetching
   */
  errors: Error[];
}

export const KesselRbacAccessContext = createContext<KesselRbacAccessContextValue | undefined>(
  undefined
);

/**
 * Hook to access Kessel RBAC context.
 * @throws if used outside KesselRbacAccessProvider
 */
export const useKesselRbacAccess = (): KesselRbacAccessContextValue => {
  const context = useContext(KesselRbacAccessContext);
  if (!context) {
    throw new Error('useKesselRbacAccess must be used within KesselRbacAccessProvider');
  }
  return context;
};
