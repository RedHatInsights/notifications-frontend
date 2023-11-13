import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const useGetTimePreference = () => {
  return useQuery(
    Operations.OrgConfigResourceGetDailyDigestTimePreference.actionCreator()
  );
};
