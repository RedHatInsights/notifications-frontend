import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

const getSeveritiesAction = Operations.NotificationResource$v1GetSeverities.actionCreator();

export const useGetSeverities = (initFetch = true) => useQuery(getSeveritiesAction, initFetch);
