import { assertNever } from 'assert-never';
import { useMemo, useState } from 'react';

import { NotificationFilterColumn } from '../../../components/Notifications/Filter';
import {
  useUrlStateMultipleOptions,
  useUrlStateString,
} from '../../../utils/insights-common-typescript';
import { useFilters } from '../../../utils/insights-common-typescript/useFilters';

const DEBOUNCE_MS = 250;

export const useNotificationFilter = (
  initialAppOptions: Array<string>,
  initUseUrlState: boolean,
  debounce = DEBOUNCE_MS
) => {
  const useStateFactory = useMemo(() => {
    const useUrlStateName = (defaultValue?: string) =>
      useUrlStateString('name', defaultValue);
    const useUrlStateApplication = (defaultValue?: Array<string>) =>
      useUrlStateMultipleOptions('app', initialAppOptions, defaultValue);
    const useUrlStateAction = (defaultValue?: string) =>
      useUrlStateString('action', defaultValue);

    return (column: NotificationFilterColumn) => {
      switch (column) {
        case NotificationFilterColumn.NAME:
          return initUseUrlState ? useUrlStateName : useState;
        case NotificationFilterColumn.ACTION:
          return initUseUrlState ? useUrlStateAction : useState;
        case NotificationFilterColumn.APPLICATION:
          return initUseUrlState ? useUrlStateApplication : useState;
        default:
          assertNever(column);
      }
    };
    // This is an init param, so it doesn't need to recompute on change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useFilters(NotificationFilterColumn, debounce, useStateFactory);
};
