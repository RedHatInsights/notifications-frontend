import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const getApplicationsAction = (bundleName: string) => Operations.NotificationServiceGetApplicationsFacets.actionCreator({
    bundleName
});

export const useGetApplications = (bundleName: string) => useQuery(getApplicationsAction(bundleName));
