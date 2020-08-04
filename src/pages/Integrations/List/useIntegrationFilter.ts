import { IntegrationFilterColumn } from '../../../components/Integrations/Filters';
import { assertNever, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { useFilters, useUrlStateExclusiveOptions } from '@redhat-cloud-services/insights-common-typescript';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
const useUrlStateType = (defaultValue?: string) => useUrlStateString('type', defaultValue);
const useUrlStateEnabled = (_defaultValue?: string) => useUrlStateExclusiveOptions('enabled', [ 'enabled', 'disabled' ],  undefined);

const useStateFactory = (column: IntegrationFilterColumn) => {
    switch (column) {
        case IntegrationFilterColumn.NAME:
            return useUrlStateName;
        case IntegrationFilterColumn.TYPE:
            return useUrlStateType;
        case IntegrationFilterColumn.ENABLED:
            return useUrlStateEnabled;
        default:
            assertNever(column);
    }
};

export const useIntegrationFilter = (debounce = DEBOUNCE_MS) => {
    return useFilters(IntegrationFilterColumn, debounce, useStateFactory);
};
