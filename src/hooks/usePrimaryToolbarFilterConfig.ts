import { Filters, SetFilters, ClearFilters, FilterBase } from './useFilters';
import { useCallback, useMemo, useState } from 'react';

type StandardEnum<T> = Record<keyof T, string>;

const filterItem = <FilterColumn extends StandardEnum<any>>(
    column: FilterColumn[keyof FilterColumn],
    filters: Filters<FilterColumn>,
    setFilters: SetFilters<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => ({
        label: meta[column].label,
        type: 'text',
        filterValues: {
            id: `filter-${column}`,
            value: filters[column],
            placeholder: meta[column].placeholder,
            onChange: (_event, value: string) => setFilters[column](value)
        }
});

const getFilterConfig = <FilterColumn extends StandardEnum<any>>(
    filters: Filters<FilterColumn>,
    column: FilterColumn[keyof FilterColumn],
    meta: ColumnsMetada<FilterColumn>
) => {
    const value = filters[column].trim();
    if (value === '') {
        return undefined;
    }

    return {
        category: meta[column].label,
        chips: [
            {
                name: value,
                isRead: true
            }
        ]
    };
};

export interface FilterColumnMetadata {
    label: string;
    placeholder: string;
}

export type ColumnsMetada<Enum extends StandardEnum<any>> = FilterBase<Enum, FilterColumnMetadata>;

export const usePrimaryToolbarFilterConfig = <FilterColumn extends StandardEnum<any>>(
    initEnum: FilterColumn,
    filters: Filters<FilterColumn>,
    setFilters: SetFilters<FilterColumn>,
    clearFilters: ClearFilters<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => {

    const [ Enum ] = useState(initEnum);

    const filterConfig = useMemo(() => ({
        items: (Object.values(Enum) as unknown as Array<FilterColumn[keyof FilterColumn]>).map(
            column => filterItem(column, filters, setFilters, meta)
        )
    }), [ filters, setFilters, meta, Enum ]);

    const onFilterDelete = useCallback((_event, rawFilterConfigs: any[]) => {
        const toClear: Array<FilterColumn[keyof FilterColumn]> = [];
        for (const element of rawFilterConfigs) {
            const key = Object.keys(
                meta
            ).find(
                key => meta[key].label === element.category
            ) as undefined | FilterColumn[keyof FilterColumn];
            if (key && Object.values(Enum).includes(key)) {
                toClear.push(key);
            } else {
                throw new Error(`Unexpected filter column found: ${key}`);
            }
        }

        clearFilters(toClear);
    }, [ clearFilters, Enum, meta ]);

    const activeFiltersConfig = useMemo(() => {
        const filterConfig: Array<ReturnType<typeof getFilterConfig>> = [];
        for (const column of Object.values(Enum) as Array<FilterColumn[keyof FilterColumn]>) {
            const config = getFilterConfig(filters, column, meta);
            if (config) {
                filterConfig.push(config);
            }
        }

        return {
            filters: filterConfig,
            onDelete: onFilterDelete
        };
    }, [ filters, onFilterDelete, Enum, meta ]);

    return {
        filterConfig,
        activeFiltersConfig
    };
};
