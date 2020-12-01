import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const getApplicationsAction = () => Operations.NotificationServiceGetApplicationsFacets.actionCreator();

export const useGetApplications = () => useQuery(getApplicationsAction());
