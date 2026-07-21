import React, { useEffect, useMemo, useState } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import type { SelfAccessCheckResourceWithRelation } from '@project-kessel/react-kessel-access-check';
import { KesselRbacAccessContext, KesselRbacAccessContextValue } from './KesselRbacAccessContext';
import {
  KESSEL_WORKSPACE_RELATIONS,
  KESSEL_WORKSPACE_RELATIONS_ORDERED,
} from './kesselWorkspaceRelations';
import { useDefaultWorkspace } from './hooks/useDefaultWorkspace';

type AllowedByRelation = Partial<Record<string, boolean>>;

function buildAllowedMap(
  data: Array<{ allowed: boolean; relation: string }> | undefined
): AllowedByRelation {
  if (!data) {
    return {};
  }

  const map: AllowedByRelation = {};
  for (const item of data) {
    map[item.relation] = item.allowed;
  }
  return map;
}

/**
 * Provider that fetches the default workspace and checks all Kessel v2 permissions
 * in a single bulk API call.
 *
 * When the workspace ID is not yet available, an empty resources array is passed so
 * the hook completes immediately without making an API call. Once the workspace loads,
 * the resources array is populated and a single /checkselfbulk request fires for all
 * 7 permission relations at once.
 */
export const KesselRbacAccessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);

  const {
    workspaceId: defaultWorkspaceId,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useDefaultWorkspace();

  useEffect(() => {
    if (workspaceError) {
      setErrors((prev) => [...prev, workspaceError]);
    }
  }, [workspaceError]);

  type NonEmptyResources = [
    SelfAccessCheckResourceWithRelation,
    ...SelfAccessCheckResourceWithRelation[]
  ];

  const resources = useMemo<NonEmptyResources | undefined>(() => {
    if (!defaultWorkspaceId) {
      return undefined;
    }

    // KESSEL_WORKSPACE_RELATIONS_ORDERED is a const tuple of 7 elements, so .map() always returns non-empty
    return KESSEL_WORKSPACE_RELATIONS_ORDERED.map((relation) => ({
      id: defaultWorkspaceId,
      type: 'workspace' as const,
      reporter: { type: 'rbac' as const },
      relation,
    })) as NonEmptyResources;
  }, [defaultWorkspaceId]);

  // The library requires NotEmptyArray but handles empty gracefully at runtime.
  // When resources is undefined (no workspace), we pass [] to skip the API call.
  const bulkResult = useSelfAccessCheck({
    resources: (resources ?? []) as NonEmptyResources,
  });

  const allowed = useMemo(() => buildAllowedMap(bulkResult.data), [bulkResult.data]);

  const isLoading = isLoadingWorkspace || bulkResult.loading;

  const contextValue: KesselRbacAccessContextValue = useMemo(
    () => ({
      workspaceId: defaultWorkspaceId,
      isLoading,
      permissions: {
        canEditIntegrationsEndpoints:
          allowed[KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT] ?? false,
        canViewIntegrationsEndpoints:
          allowed[KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW] ?? false,
        canViewNotificationsEvents:
          allowed[KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_EVENTS_VIEW] ?? false,
        canEditNotifications:
          allowed[KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_EDIT] ?? false,
        canViewNotifications:
          allowed[KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_VIEW] ?? false,
        canReadRbacGroups: allowed[KESSEL_WORKSPACE_RELATIONS.RBAC_GROUPS_READ] ?? false,
        canReadRbacPrincipal: allowed[KESSEL_WORKSPACE_RELATIONS.RBAC_PRINCIPAL_READ] ?? false,
      },
      errors,
    }),
    [defaultWorkspaceId, isLoading, allowed, errors]
  );

  return (
    <KesselRbacAccessContext.Provider value={contextValue}>
      {children}
    </KesselRbacAccessContext.Provider>
  );
};
