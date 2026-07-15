import { useEffect, useState } from 'react';
import { type Workspace, fetchDefaultWorkspace } from '@project-kessel/react-kessel-access-check';

/**
 * Hook to fetch and cache the default workspace ID.
 * Provides a similar API to useDefaultWorkspace from future versions of @project-kessel/react-kessel-access-check.
 */
export const useDefaultWorkspace = (enabled = true) => {
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let isMounted = true;

    const fetchWorkspace = async () => {
      try {
        const rbacBaseEndpoint = window.location.origin;
        const workspace: Workspace = await fetchDefaultWorkspace(rbacBaseEndpoint);

        if (isMounted) {
          setWorkspaceId(workspace.id);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch default workspace'));
          setIsLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return {
    workspaceId,
    isLoading,
    error,
  };
};
