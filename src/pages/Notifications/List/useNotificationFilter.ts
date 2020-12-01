import { useFilters, useUrlStateMultipleOptions, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import { useMemo } from 'react';

import { NotificationFilterColumn } from '../../../components/Notifications/Filter';

const DEBOUNCE_MS = 250;

export const useNotificationFilter = (initialAppOptions: Array<string>, debounce = DEBOUNCE_MS) => {
    const useStateFactory = useMemo(() => {
        const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
        const useUrlStateApplication = (defaultValue?: Array<string>) => useUrlStateMultipleOptions(
            'app',
            initialAppOptions,
            defaultValue
        );
        const useUrlStateAction = (defaultValue?: string) => useUrlStateString('action', defaultValue);

        const useStateFactoryInternal = (column: NotificationFilterColumn) => {
            switch (column) {
                case NotificationFilterColumn.NAME:
                    return useUrlStateName;
                case NotificationFilterColumn.ACTION:
                    return useUrlStateAction;
                case NotificationFilterColumn.APPLICATION:
                    return useUrlStateApplication;
                default:
                    assertNever(column);
            }
        };

        return useStateFactoryInternal;
        // This is an init param, so it doesn't need to recompute on change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useFilters(NotificationFilterColumn, debounce, useStateFactory);
};
