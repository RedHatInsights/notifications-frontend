import { useCallback, useMemo, useState } from 'react';
import { useDebouncedState } from '@redhat-cloud-services/insights-common-typescript';

const DEFAULT_DEBOUNCE_MS = 250;

type StandardEnum<T> = Record<keyof T, string>;
export type FilterBase<Enum extends StandardEnum<any>, T> = Record<Enum[keyof Enum], T>;
type Setter<T> = (val: T) => void;

export type Filters<Enum extends StandardEnum<any>> = FilterBase<Enum, string>;
export type SetFilters<Enum extends StandardEnum<any>> = FilterBase<Enum, Setter<string>>;
export type ClearFilters<Enum> = (columns: Array<Enum[keyof Enum]>) => void;

type FilterUseStateFunctions<Enum extends StandardEnum<any>> = FilterBase<Enum, typeof useState | undefined>;

export const useFilters = <FilterColumn extends StandardEnum<any>>(
    initEnum: FilterColumn,
    debounce = DEFAULT_DEBOUNCE_MS,
    initUseStateFactory?: (column: FilterColumn[keyof FilterColumn]) => typeof useState | undefined
) => {

    const [ columns ] = useState(() => Object.values(initEnum).sort()) as unknown as [
        Array<FilterColumn[keyof FilterColumn]>
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
