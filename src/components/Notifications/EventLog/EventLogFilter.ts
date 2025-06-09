import {
  ClearFilters,
  Filters,
  SetFilters,
} from '../../../utils/insights-common-typescript/Filters';

export enum EventLogFilterColumn {
  EVENT = 'event',
  BUNDLE = 'bundle',
  SERVICE = 'service',
  ACTION_TYPE = 'endpointTypes',
  ACTION_STATUS = 'status',
}

export type EventLogFilters = Filters<typeof EventLogFilterColumn>;
export type SetEventLogFilters = SetFilters<typeof EventLogFilterColumn>;
export type ClearEventLogFilters = ClearFilters<typeof EventLogFilterColumn>;
