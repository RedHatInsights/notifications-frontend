import { useCallback, useMemo, useState, ReactNode } from 'react';
import { ClearFilters, EnumElement, FilterBase, Filters, SetFilters, StandardFilterEnum } from '../types/Filters';

const getFilterItemType = <FilterColumn extends StandardFilterEnum<any>>(
    column: EnumElement<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => {
    const options = meta[column].options;
    if (options) {
        if (options.exclusive) {
            return 'radio';
        } else {
            throw new Error('Inclusive options are not yet implemented');
        }
    }

    return 'text';
};

const getFilterItemValue = <FilterColumn extends StandardFilterEnum<any>>(
    column: EnumElement<FilterColumn>,
    filters: Filters<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => {
    const options = meta[column].options;
    let value = filters[column];
    if (options) {
        if (options.exclude && options.exclude.includes(value)) {
            value = '';
        }

        if (options.default && (value === undefined || value === '')) {
            return options.default;
        }
    }

    return value;
};

const filterItem = <FilterColumn extends StandardFilterEnum<any>>(
    column: EnumElement<FilterColumn>,
    filters: Filters<FilterColumn>,
    setFilters: SetFilters<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => ({
        label: meta[column].label,
        type: getFilterItemType(column, meta),
        filterValues: {
            id: `filter-${column}`,
            value: getFilterItemValue(column, filters, meta),
            placeholder: meta[column].placeholder,
            onChange: (_event, value: string) => {
                const options = meta[column].options;
                if (options) {
                    if (options.exclusive) {
                        if (options.exclude?.includes(value)) {
                            setFilters[column]('');
                        } else if (options.items.find(i => i.value === value)) {
                            setFilters[column](value);
                        }
                    } else {
                        throw new Error('Inclusive options are not yet implemented');
                    }
                } else {
                    setFilters[column](value);
                }
            },
            items: meta[column].options?.items
        }
    });

const getActiveFilterConfigItem = <FilterColumn extends StandardFilterEnum<any>>(
    filters: Filters<FilterColumn>,
    column: EnumElement<FilterColumn>,
    meta: ColumnsMetada<FilterColumn>
) => {
    const value = filters[column]?.trim();
    const options = meta[column].options;
    if (value === undefined || value === '' || options?.exclude?.includes(value)) {
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
    options?: {
        exclusive?: boolean;
        items: Array<{
            value: string;
            label: ReactNode;
        }>;
        default?: string;
        exclude?: Array<string>;
    };
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
