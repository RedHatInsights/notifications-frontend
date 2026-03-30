import * as React from 'react';
import { useState } from 'react';
import { useClient } from 'react-fetching-library';

import { getRbacGroupsAction } from '../../services/Rbac/GetGroups';
import { useSyncInterval } from '../../utils/insights-common-typescript';
import { RbacGroup, RbacGroupContext } from './RbacGroupContext';
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
      page.data.length > 0 &&
      (page.meta?.count ? page.meta.count > offset + LIMIT : true);

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

export const RbacGroupContextProvider: React.FunctionComponent<
  React.PropsWithChildren
> = (props) => {
  const { query } = useClient();
  const kessel = useKesselRbacAccess();
  const [isLoading, setLoading] = useState(true);
  const [rbacGroups, setRbacGroups] = useState<ReadonlyArray<RbacGroup>>([]);

  const sync = React.useCallback(async () => {
    if (kessel.isLoading) {
      return;
    }

    if (!kessel.canReadRbacGroups) {
      setRbacGroups([]);
      setLoading(false);
      return;
    }

    const allGroups: Array<RbacGroup> = [];
    let offset = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [groups, hasMorePages] = await getPage(query, offset);
      if (groups === undefined) {
        setRbacGroups([]);
        setLoading(false);
        return;
      }

      allGroups.push(...groups);
      if (!hasMorePages) {
        break;
      }

      offset += LIMIT;
    }

    setRbacGroups(allGroups);
    setLoading(false);
  }, [query, kessel.isLoading, kessel.canReadRbacGroups]);

  React.useEffect(() => {
    if (!kessel.isLoading && !kessel.canReadRbacGroups) {
      setRbacGroups([]);
      setLoading(false);
    }
  }, [kessel.isLoading, kessel.canReadRbacGroups]);

  useSyncInterval(SYNC_INTERVAL, sync, true);

  const groupsLoading =
    kessel.isLoading || (kessel.canReadRbacGroups && isLoading);

  const value = React.useMemo(
    () => ({
      groups: rbacGroups,
      isLoading: groupsLoading,
    }),
    [rbacGroups, groupsLoading]
  );

  return (
    <RbacGroupContext.Provider value={value}>
      {props.children}
    </RbacGroupContext.Provider>
  );
};
