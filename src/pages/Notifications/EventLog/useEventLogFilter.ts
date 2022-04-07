import {
    useFilters,
    useUrlStateMultipleOptions,
    useUrlStateString
} from '@redhat-cloud-services/insights-common-typescript';
import assertNever from 'assert-never';
import { useMemo } from 'react';

import { EventLogFilterColumn } from '../../../components/Notifications/EventLog/EventLogFilter';

const DEBOUNCE_MS = 250;

export const useEventLogFilter = (debounce = DEBOUNCE_MS) => {
    const useStateFactory = useMemo(() => {

        const useApplication = () => useUrlStateMultipleOptions('application');
        const useBundle = () => useUrlStateMultipleOptions('bundle');

        const useActionType = () => useUrlStateMultipleOptions('endpointTypes');
        const useActionStatus = () => useUrlStateMultipleOptions('invocationResults');

        const useEvent = () => useUrlStateString('event');

        return (column: EventLogFilterColumn) => {
            switch (column) {
                case EventLogFilterColumn.APPLICATION:
                    return useApplication;
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
