import { IntegrationFilterColumn } from '../../../components/Integrations/Filters';
import { useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { useFilters, useUrlStateExclusiveOptions } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
const useUrlStateEnabled = (_defaultValue?: string) => useUrlStateExclusiveOptions('enabled', [ 'enabled', 'disabled' ],  undefined);

const useStateFactory = (column: IntegrationFilterColumn) => {
    switch (column) {
        case IntegrationFilterColumn.NAME:
            return useUrlStateName;
        case IntegrationFilterColumn.ENABLED:
            return useUrlStateEnabled;
        default:
            assertNever(column);
    }
};

export const useIntegrationFilter = (debounce = DEBOUNCE_MS) => {
    return useFilters(IntegrationFilterColumn, debounce, useStateFactory);
};
