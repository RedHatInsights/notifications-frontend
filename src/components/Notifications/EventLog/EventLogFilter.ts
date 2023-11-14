import {
  ClearFilters,
  Filters,
  SetFilters,
} from '@redhat-cloud-services/insights-common-typescript';

export enum EventLogFilterColumn {
  EVENT = 'event',
  BUNDLE = 'bundle',
  APPLICATION = 'application',
  ACTION_TYPE = 'endpointTypes',
  ACTION_STATUS = 'invocationResults',
}

export type EventLogFilters = Filters<typeof EventLogFilterColumn>;
export type SetEventLogFilters = SetFilters<typeof EventLogFilterColumn>;
export type ClearEventLogFilters = ClearFilters<typeof EventLogFilterColumn>;
