import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiRbac';

type GetGroupsParams = {
  limit: number;
  offset: number;
};

export const getRbacGroupsAction = (params: GetGroupsParams) => {
  return Operations.ListGroups.actionCreator({
    limit: params.limit,
    offset: params.offset,
    // Include all groups (default and custom) like the Red Hat Console
    // Removed platformDefault: false and adminDefault: false filters
  });
};

export const useRbacGroupsQuery = () => {
  return useParameterizedQuery(getRbacGroupsAction);
};
