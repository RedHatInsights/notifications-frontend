import {
  useFilters,
  useUrlStateMultipleOptions,
  useUrlStateString,
} from '@redhat-cloud-services/insights-common-typescript';
import assertNever from 'assert-never';
import { useMemo } from 'react';

import { EventLogFilterColumn } from '../../../components/Notifications/EventLog/EventLogFilter';

const DEBOUNCE_MS = 250;

export const useEventLogFilter = (debounce = DEBOUNCE_MS) => {
  const useStateFactory = useMemo(() => {
    const useService = () => useUrlStateMultipleOptions('service');
    const useBundle = () => useUrlStateMultipleOptions('bundle');

    const useActionType = () => useUrlStateMultipleOptions('endpointTypes');
    const useActionStatus = () => useUrlStateMultipleOptions('status');

    const useEvent = () => useUrlStateString('event');

    return (column: EventLogFilterColumn) => {
      switch (column) {
        case EventLogFilterColumn.SERVICE:
          return useService;
        case EventLogFilterColumn.BUNDLE:
          return useBundle;
        case EventLogFilterColumn.EVENT:
          return useEvent;
        case EventLogFilterColumn.ACTION_TYPE:
          return useActionType;
        case EventLogFilterColumn.ACTION_STATUS:
          return useActionStatus;
        default:
          assertNever(column);
      }
    };
  }, []);

  return useFilters(EventLogFilterColumn, debounce, useStateFactory);
};
