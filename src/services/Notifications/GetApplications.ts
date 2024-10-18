import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export const getApplicationsAction = (bundleName?: string) =>
  Operations.NotificationResource$v1GetApplicationsFacets.actionCreator({
    bundleName,
  });

export const useGetApplicationsLazy = () =>
  useParameterizedQuery(getApplicationsAction);
export const useGetApplications = (bundleName?: string) =>
  useQuery(getApplicationsAction(bundleName));
