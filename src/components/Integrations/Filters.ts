import { ClearFilters, Filters, SetFilters } from '../../types/Filters';

export enum IntegrationFilterColumn {
    NAME = 'name',
    TYPE = 'type',
    ENABLED = 'enabled'
}

export type IntegrationFilters = Filters<typeof IntegrationFilterColumn>;
export type SetIntegrationFilters = SetFilters<typeof IntegrationFilterColumn>;
export type ClearIntegrationFilters = ClearFilters<typeof IntegrationFilterColumn>;
