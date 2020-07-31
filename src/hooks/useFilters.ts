import { useCallback, useMemo, useState } from 'react';
import { useDebouncedState } from '@redhat-cloud-services/insights-common-typescript';
import { ClearFilters, EnumElement, FilterBase, Filters, SetFilters, StandardFilterEnum } from '../types/Filters';

const DEFAULT_DEBOUNCE_MS = 250;

type FilterUseStateFunctions<Enum extends StandardFilterEnum<any>> = FilterBase<Enum, typeof useState | undefined>;

export const useFilters = <FilterColumn extends StandardFilterEnum<any>>(
    initEnum: FilterColumn,
    debounce = DEFAULT_DEBOUNCE_MS,
    initUseStateFactory?: (column: EnumElement<FilterColumn>) => typeof useState | undefined
) => {

    const [ columns ] = useState(() => Object.values(initEnum).sort()) as unknown as [
        Array<EnumElement<FilterColumn>>
    ];
    const [ useStateFunctions ] = useState(() => {
        if (initUseStateFactory) {
            const stateFunctions = {} as FilterUseStateFunctions<FilterColumn>;
            for (const column of columns) {
                stateFunctions[column] = initUseStateFactory(column);
            }

            return stateFunctions;
        }

        return undefined;
    });

    const elements = {
        filters: {},
        setFilters: {},
        debouncedFilters: {}
    } as {
        filters: Filters<FilterColumn>;
        setFilters: SetFilters<FilterColumn>;
        debouncedFilters: Filters<FilterColumn>;
    };

    for (const column of columns) {
        // We ensure that this loop is always the same length with the same contents, thus not breaking the rules of hook.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [ value, setter, debouncedValue ] = useDebouncedState<string>(
            '', debounce, useStateFunctions ? useStateFunctions[column] : undefined
        );
        elements.filters[column] = value;
        elements.setFilters[column] = setter;
        elements.debouncedFilters[column] = debouncedValue;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const filters = useMemo(() => elements.filters, [ ...Object.values(elements.filters) ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setFilters = useMemo(() => elements.setFilters, [ ...Object.values(elements.setFilters) ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFilters = useMemo(() => elements.debouncedFilters, [ ...Object.values(elements.debouncedFilters) ]);

    const clearFilter: ClearFilters<FilterColumn> = useCallback((columns: Array<string>) => {
        for (const column of columns) {
            if (setFilters[column]) {
                setFilters[column]('');
            } else {
                throw new Error(`Unexpected column ${column}`);
            }
        }
    }, [ setFilters ]);

    return {
        clearFilter,
        filters,
        setFilters,
        debouncedFilters
    };
};
