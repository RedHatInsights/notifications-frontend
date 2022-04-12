import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

const getBundlesAction = (includeApplications: boolean) => Operations.NotificationServiceGetBundleFacets.actionCreator(includeApplications);

export const useGetBundles = (includeApplications?: boolean) => useQuery(getBundlesAction(!!includeApplications));
