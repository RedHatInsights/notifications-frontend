import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const getApplicationsAction = (bundleName: string) => Operations.NotificationServiceGetApplicationsFacets.actionCreator({
    bundleName
});

export const useGetApplications = () => useParameterizedQuery(getApplicationsAction);
