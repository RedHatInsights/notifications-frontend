import {
  ClearFilters,
  Filters,
  SetFilters,
} from '../../utils/insights-common-typescript/Filters';

export enum IntegrationFilterColumn {
  NAME = 'name',
  ENABLED = 'enabled',
}

export type IntegrationFilters = Filters<typeof IntegrationFilterColumn>;
export type SetIntegrationFilters = SetFilters<typeof IntegrationFilterColumn>;
export type ClearIntegrationFilters = ClearFilters<
  typeof IntegrationFilterColumn
>;
