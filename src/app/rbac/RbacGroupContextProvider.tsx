import * as React from 'react';
import { useState } from 'react';
import { useClient } from 'react-fetching-library';

import { getRbacGroupsAction } from '../../services/Rbac/GetGroups';
import { RbacGroup, RbacGroupContext } from './RbacGroupContext';
import { useSyncInterval } from '../../utils/insights-common-typescript';

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
  const [isLoading, setLoading] = useState(true);
  const [rbacGroups, setRbacGroups] = useState<ReadonlyArray<RbacGroup>>([]);

  const sync = React.useCallback(async () => {
    const allGroups: Array<RbacGroup> = [];
    let offset = 0;
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

    setRbacGroups(allGroups);
    setLoading(false);
  }, [query]);

  useSyncInterval(SYNC_INTERVAL, sync, true);

  const value = React.useMemo(
    () => ({
      groups: rbacGroups,
      isLoading,
    }),
    [rbacGroups, isLoading]
  );

  return (
    <RbacGroupContext.Provider value={value}>
      {props.children}
    </RbacGroupContext.Provider>
  );
};
