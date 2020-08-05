import { assertNever, useUrlStateString, useFilters } from '@redhat-cloud-services/insights-common-typescript';
import { NotificationFilterColumn } from '../../../components/Notifications/Filter';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);

const useStateFactory = (column: NotificationFilterColumn) => {
    switch (column) {
        case NotificationFilterColumn.NAME:
            return useUrlStateName;
        default:
            assertNever(column);
    }
};

export const useNotificationFilter = (debounce = DEBOUNCE_MS) => {
    return useFilters(NotificationFilterColumn, debounce, useStateFactory);
};
