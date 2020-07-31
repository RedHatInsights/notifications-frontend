import { ClearFilters, Filters, SetFilters } from '../../hooks/useFilters';

export enum IntegrationFilterColumn {
    NAME = 'name'
}

export type IntegrationFilters = Filters<typeof IntegrationFilterColumn>;
export type SetIntegrationFilters = SetFilters<typeof IntegrationFilterColumn>;
export type ClearIntegrationFilters = ClearFilters<typeof IntegrationFilterColumn>;
