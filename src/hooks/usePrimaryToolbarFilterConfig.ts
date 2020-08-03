import { useCallback, useMemo, useState } from 'react';
import { ClearFilters, EnumElement, FilterBase, Filters, SetFilters, StandardFilterEnum } from '../types/Filters';

const filterItem = <FilterColumn extends StandardFilterEnum<any>>(
    column: EnumElement<FilterColumn>,
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

const getActiveFilterConfigItem = <FilterColumn extends StandardFilterEnum<any>>(
    filters: Filters<FilterColumn>,
    column: EnumElement<FilterColumn>,
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

export type ColumnsMetada<Enum extends StandardFilterEnum<any>> = FilterBase<Enum, FilterColumnMetadata>;

export const usePrimaryToolbarFilterConfig = <FilterColumn extends StandardFilterEnum<any>>(
    initEnum: FilterColumn,
    filters: Filters<FilterColumn>,
    setFilters: SetFilters<FilterColumn>,
    clearFilters: ClearFilters<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => {

    const [ Enum ] = useState(initEnum);

    const filterConfig = useMemo(() => ({
        items: (Object.values(Enum) as unknown as Array<EnumElement<FilterColumn>>).map(
            column => filterItem(column, filters, setFilters, meta)
        )
    }), [ filters, setFilters, meta, Enum ]);

    const onFilterDelete = useCallback((_event, rawFilterConfigs: any[]) => {
        const toClear: Array<EnumElement<FilterColumn>> = [];
        for (const element of rawFilterConfigs) {
            const key = Object.keys(
                meta
            ).find(
                key => meta[key].label === element.category
            ) as undefined | EnumElement<FilterColumn>;
            if (key && Object.values(Enum).includes(key)) {
                toClear.push(key);
            } else {
                throw new Error(`Unexpected filter column label found: ${element.category}`);
            }
        }

        clearFilters(toClear);
    }, [ clearFilters, Enum, meta ]);

    const activeFiltersConfig = useMemo(() => {
        const filterConfig: Array<ReturnType<typeof getActiveFilterConfigItem>> = [];
        for (const column of Object.values(Enum) as Array<EnumElement<FilterColumn>>) {
            const config = getActiveFilterConfigItem(filters, column, meta);
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
