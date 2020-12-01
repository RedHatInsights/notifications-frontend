import { Operations } from '../../generated/OpenapiNotifications';
import { useQuery } from 'react-fetching-library';

export const getApplicationsAction = () => Operations.NotificationServiceGetApplicationsFacets.actionCreator();

export const useGetApplications = () => useQuery(getApplicationsAction());
