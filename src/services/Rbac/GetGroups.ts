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
    platformDefault: false,
    adminDefault: false,
  });
};

export const useRbacGroupsQuery = () => {
  return useParameterizedQuery(getRbacGroupsAction);
};
