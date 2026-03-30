import {
  fetchDefaultWorkspace,
  useSelfAccessCheck,
} from '@project-kessel/react-kessel-access-check';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import * as React from 'react';

import {
  KesselRbacAccessContext,
  KesselRbacAccessContextValue,
  defaultKesselRbacAccess,
} from './KesselRbacAccessContext';

const rbacReporter = { type: 'rbac' as const };

/** Kessel API returns allowed enums; the SDK maps them to booleans, but we normalize defensively. */
function normalizeKesselAllowed(raw: unknown): boolean {
  if (raw === true) {
    return true;
  }
  if (raw === false) {
    return false;
  }
  if (raw === 'ALLOWED_TRUE') {
    return true;
  }
  if (raw === 'ALLOWED_FALSE' || raw === 'ALLOWED_UNSPECIFIED') {
    return false;
  }
  return false;
}

function KesselChecksInner({
  workspaceId,
  children,
}: React.PropsWithChildren<{ workspaceId: string }>) {
  const { data, loading, error } = useSelfAccessCheck({
    resources: [
      {
        id: workspaceId,
        type: 'workspace',
        relation: 'rbac_groups_read',
        reporter: rbacReporter,
      },
      {
        id: workspaceId,
        type: 'workspace',
        relation: 'rbac_principal_read',
        reporter: rbacReporter,
      },
    ],
  });

  const value = React.useMemo((): KesselRbacAccessContextValue => {
    const allowedFor = (relation: string) =>
      normalizeKesselAllowed(
        data?.find((c) => c.relation === relation)?.allowed
      );

    return {
      isLoading: loading,
      canReadRbacGroups: allowedFor('rbac_groups_read'),
      canReadRbacPrincipals: allowedFor('rbac_principal_read'),
      kesselError: !!error,
    };
  }, [data, loading, error]);

  return (
    <KesselRbacAccessContext.Provider value={value}>
      {children}
    </KesselRbacAccessContext.Provider>
  );
}

/**
 * Resolves the org default workspace and runs Kessel self-checks for
 * rbac_groups_read / rbac_principal_read. Must render under AccessCheck.Provider.
 */
export const KesselRbacAccessProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  const chrome = useChrome();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = React.useState(true);
  const [workspaceError, setWorkspaceError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let auth: { headers: { Authorization: string } } | undefined;
      try {
        const token = await chrome.auth.getToken();
        if (token) {
          auth = { headers: { Authorization: `Bearer ${token}` } };
        }
      } catch {
        // Token acquisition is best-effort; proceed without auth.
      }

      try {
        const ws = await fetchDefaultWorkspace(baseUrl, auth);
        if (!cancelled) {
          setWorkspaceId(ws.id);
          setWorkspaceError(false);
        }
      } catch {
        if (!cancelled) {
          setWorkspaceError(true);
        }
      } finally {
        if (!cancelled) {
          setWorkspaceLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [chrome, baseUrl]);

  if (workspaceLoading) {
    return (
      <KesselRbacAccessContext.Provider value={defaultKesselRbacAccess}>
        {children}
      </KesselRbacAccessContext.Provider>
    );
  }

  if (!workspaceId || workspaceError) {
    const denied: KesselRbacAccessContextValue = {
      isLoading: false,
      canReadRbacGroups: false,
      canReadRbacPrincipals: false,
      workspaceError: true,
    };
    return (
      <KesselRbacAccessContext.Provider value={denied}>
        {children}
      </KesselRbacAccessContext.Provider>
    );
  }

  return (
    <KesselChecksInner workspaceId={workspaceId}>{children}</KesselChecksInner>
  );
};
