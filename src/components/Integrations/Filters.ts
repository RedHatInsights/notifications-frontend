import {
  ClearFilters,
  Filters,
  SetFilters,
} from '@redhat-cloud-services/insights-common-typescript';

export enum IntegrationFilterColumn {
  NAME = 'name',
  ENABLED = 'enabled',
}

export type IntegrationFilters = Filters<typeof IntegrationFilterColumn>;
export type SetIntegrationFilters = SetFilters<typeof IntegrationFilterColumn>;
export type ClearIntegrationFilters = ClearFilters<
  typeof IntegrationFilterColumn
>;
