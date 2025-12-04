import { useCallback } from 'react';

import {
  NotificationFilterColumn,
  NotificationFilters,
} from '../../../components/Notifications/Filter';
import { Facet } from '../../../types/Notification';
import {
  Filter,
  Operator,
  arrayValue,
  stringValue,
} from '../../../utils/insights-common-typescript';

export const useEventTypesFilterBuilder = (
  bundle: Facet,
  appFilterOptions: ReadonlyArray<Facet>
) => {
  return useCallback(
    (filters?: NotificationFilters) => {
      const filter = new Filter();

      const appFilter =
        filters && filters[NotificationFilterColumn.APPLICATION];

      if (appFilter) {
        const appIds: Array<string> = [];
        for (const appName of arrayValue(appFilter)) {
          const filterOption = appFilterOptions.find(
            (a) => a.displayName === appName
          );
          if (filterOption) {
            appIds.push(filterOption.id);
          }
        }

        filter.and('applicationId', Operator.EQUAL, appIds);
      }

      filter.and('bundleId', Operator.EQUAL, bundle.id);

      const eventTypeFilter = filters && filters[NotificationFilterColumn.NAME];
      if (eventTypeFilter) {
        const eventTypeFilterName = stringValue(eventTypeFilter);
        filter.and('eventFilterName', Operator.EQUAL, eventTypeFilterName);
      }

      return filter;
    },
    [bundle, appFilterOptions]
  );
};
