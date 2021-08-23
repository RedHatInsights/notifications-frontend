import { ClearFilters, Filters, SetFilters } from '@redhat-cloud-services/insights-common-typescript';

export enum EventLogFilterColumn {
    EVENT = 'event',
    APPLICATION = 'application',
    BUNDLE = 'bundle'
}

export type EventLogFilters = Filters<typeof EventLogFilterColumn>;
export type SetEventLogFilters = SetFilters<typeof EventLogFilterColumn>;
export type ClearEventLogFilters = ClearFilters<typeof EventLogFilterColumn>;
