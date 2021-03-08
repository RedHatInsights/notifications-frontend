import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const getBundlesAction = () => Operations.NotificationServiceGetBundleFacets.actionCreator();

export const useGetBundles = () => useQuery(getBundlesAction());
