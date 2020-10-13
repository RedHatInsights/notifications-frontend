import { useFilters, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { NotificationFilterColumn } from '../../../components/Notifications/Filter';
import { assertNever } from 'assert-never';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
const useUrlStateApplication = (defaultValue?: string) => useUrlStateString('app', defaultValue);
const useUrlStateAction = (defaultValue?: string) => useUrlStateString('action', defaultValue);
const useUrlStateRecipient = (defaultValue?: string) => useUrlStateString('recipient', defaultValue);

const useStateFactory = (column: NotificationFilterColumn) => {
    switch (column) {
        case NotificationFilterColumn.NAME:
            return useUrlStateName;
        case NotificationFilterColumn.ACTION:
            return useUrlStateAction;
        case NotificationFilterColumn.APPLICATION:
            return useUrlStateApplication;
        case NotificationFilterColumn.RECIPIENT:
            return useUrlStateRecipient;
        default:
            assertNever(column);
    }
};

export const useNotificationFilter = (debounce = DEBOUNCE_MS) => {
    return useFilters(NotificationFilterColumn, debounce, useStateFactory);
};
