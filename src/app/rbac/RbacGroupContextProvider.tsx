import * as React from 'react';
import { useRef, useState } from 'react';
import { useClient } from 'react-fetching-library';

import { getRbacGroupsAction } from '../../services/Rbac/GetGroups';
import { RbacGroup, RbacGroupContext } from './RbacGroupContext';
import { useSyncInterval } from '../../utils/insights-common-typescript';
import { useKesselRbacAccess } from './KesselRbacAccessContext';

const SYNC_INTERVAL = 2 * 60 * 1000;
const LIMIT = 100;

const getPage = async (
  query: ReturnType<typeof useClient>['query'],
  offset: number
): Promise<[ReadonlyArray<RbacGroup> | undefined, boolean]> => {
  const groups = await query(
    getRbacGroupsAction({
      limit: LIMIT,
      offset,
    })
  );

  if (groups.payload?.type === 'GroupPagination') {
    const page = groups.payload.value;

    const hasMore =
      page.data.length > 0 && (page.meta?.count ? page.meta.count > offset + LIMIT : true);

    return [
      groups.payload.value.data.map((value) => ({
        id: value.uuid,
        name: value.name,
        principalCount: value.principalCount ?? undefined,
        admin_default: value.admin_default ?? undefined,
        platform_default: value.platform_default ?? undefined,
        system: value.system ?? undefined,
      })),
      hasMore,
    ];
  }

  return [undefined, false];
};

export const RbacGroupContextProvider: React.FunctionComponent<React.PropsWithChildren> = (
  props
) => {
  const { query } = useClient();
  const { permissions, isLoading: isLoadingPermissions } = useKesselRbacAccess();
  const { canReadRbacGroups } = permissions;

  const [isLoading, setLoading] = useState(true);
  const [rbacGroups, setRbacGroups] = useState<ReadonlyArray<RbacGroup>>([]);

  const syncRunIdRef = useRef(0);
  const canReadRbacGroupsRef = useRef(canReadRbacGroups);
  canReadRbacGroupsRef.current = canReadRbacGroups;

  const sync = React.useCallback(async () => {
    syncRunIdRef.current += 1;
    const runId = syncRunIdRef.current;

    if (!canReadRbacGroups) {
      setRbacGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const allGroups: Array<RbacGroup> = [];
    let offset = 0;
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const [groups, hasMorePages] = await getPage(query, offset);
        if (groups === undefined) {
          return;
        }

        allGroups.push(...groups);
        if (!hasMorePages) {
          break;
        }

        offset += LIMIT;
      }

      if (runId === syncRunIdRef.current && canReadRbacGroupsRef.current) {
        setRbacGroups(allGroups);
      }
    } finally {
      if (runId === syncRunIdRef.current) {
        setLoading(false);
      }
    }
  }, [query, canReadRbacGroups]);

  useSyncInterval(SYNC_INTERVAL, sync, true);

  const value = React.useMemo(
    () => ({
      groups: rbacGroups,
      isLoading: isLoading || isLoadingPermissions,
    }),
    [rbacGroups, isLoading, isLoadingPermissions]
  );

  return <RbacGroupContext.Provider value={value}>{props.children}</RbacGroupContext.Provider>;
};
