import { useKesselRbacAccess } from '../KesselRbacAccessContext';

export type OrgVersion = 'v1' | 'v2';

export interface UseOrgVersionResult {
  version: OrgVersion;
  isLoading: boolean;
}

/**
 * Hook to detect whether the current org is using RBAC v1 or v2.
 * Detection: v2 orgs have a workspace ID, v1 orgs do not.
 *
 * @returns Object containing the org version and loading state
 */
export const useOrgVersion = (): UseOrgVersionResult => {
  const { workspaceId, isLoading } = useKesselRbacAccess();

  return {
    version: workspaceId !== undefined ? 'v2' : 'v1',
    isLoading,
  };
};
