import { IntegrationFilterColumn } from '../../../components/Integrations/Filters';
import { assertNever, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { useFilters } from '../../../hooks/useFilters';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);

const useStateFactory = (column: IntegrationFilterColumn) => {
    switch (column) {
        case IntegrationFilterColumn.NAME:
            return useUrlStateName;
        default:
            assertNever(column);
    }
};

export const useIntegrationFilter = (debounce = DEBOUNCE_MS) => {
    return useFilters(IntegrationFilterColumn, debounce, useStateFactory);
};
