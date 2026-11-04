import React, { useEffect, useMemo, useState } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import type { SelfAccessCheckResourceWithRelation } from '@project-kessel/react-kessel-access-check';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { KesselRbacAccessContext, KesselRbacAccessContextValue } from './KesselRbacAccessContext';
import {
  KESSEL_WORKSPACE_RELATIONS,
  KESSEL_WORKSPACE_RELATIONS_ORDERED,
} from './kesselWorkspaceRelations';
import { useDefaultWorkspace } from './hooks/useDefaultWorkspace';
import { useIsOrgV2 } from './hooks/useIsOrgV2';

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
  const isOrgV2 = useIsOrgV2();
  const [errors, setErrors] = useState<Error[]>([]);
  const chrome = useChrome();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof chrome.auth?.getUser !== 'function') {
      return;
    }

    let cancelled = false;
    chrome.auth
      .getUser()
      .then((user) => {
        if (!cancelled) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOrgId((user as any)?.identity?.org_id);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrgId(undefined);
        }
      });
    return () => {
      cancelled = true;
    };
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    workspaceId: defaultWorkspaceId,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useDefaultWorkspace(isOrgV2 === true);

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
    if (!defaultWorkspaceId || !orgId) {
      return undefined;
    }

    // Notifications/integrations relations are workspace-scoped. The RBAC relations
    // (group/principal read) are tenant-scoped: `rbac_groups_read` and
    // `rbac_principal_read` are granted at the tenant level (resource `redhat/<orgId>`),
    // not on the workspace — checking them against the workspace returns a false
    // denial even for users who hold the permission. This matches how insights-chrome
    // checks the same relations for the notification drawer.
    const workspaceRelations = KESSEL_WORKSPACE_RELATIONS_ORDERED.filter(
      (relation) =>
        relation !== KESSEL_WORKSPACE_RELATIONS.RBAC_GROUPS_READ &&
        relation !== KESSEL_WORKSPACE_RELATIONS.RBAC_PRINCIPAL_READ
    ).map((relation) => ({
      id: defaultWorkspaceId,
      type: 'workspace' as const,
      reporter: { type: 'rbac' as const },
      relation,
    }));

    const tenantRelations = [
      KESSEL_WORKSPACE_RELATIONS.RBAC_GROUPS_READ,
      KESSEL_WORKSPACE_RELATIONS.RBAC_PRINCIPAL_READ,
    ].map((relation) => ({
      id: `redhat/${orgId}`,
      type: 'tenant' as const,
      reporter: { type: 'rbac' as const },
      relation,
    }));

    return [...workspaceRelations, ...tenantRelations] as NonEmptyResources;
  }, [defaultWorkspaceId, orgId]);

  // The library requires NotEmptyArray but handles empty gracefully at runtime.
  // When resources is undefined (no workspace), we pass [] to skip the API call.
  const bulkResult = useSelfAccessCheck({
    resources: (resources ?? []) as NonEmptyResources,
  });

  const allowed = useMemo(() => buildAllowedMap(bulkResult.data), [bulkResult.data]);

  // The workspace/orgId/Kessel terms only apply to v2 orgs — a v1 org never
  // runs the chain, and requiring orgId there would block loading forever in
  // contexts where chrome.auth.getUser is unavailable.
  const isLoading =
    isOrgV2 === undefined ||
    (isOrgV2 === true && (isLoadingWorkspace || orgId === undefined || bulkResult.loading));

  const contextValue: KesselRbacAccessContextValue = useMemo(
    () => ({
      isOrgV2,
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
    [isOrgV2, defaultWorkspaceId, isLoading, allowed, errors]
  );

  return (
    <KesselRbacAccessContext.Provider value={contextValue}>
      {children}
    </KesselRbacAccessContext.Provider>
  );
};
