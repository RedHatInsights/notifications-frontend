import { ReactNode, useCallback, useMemo, useState } from 'react';
import { FilterChipsFilter } from '@redhat-cloud-services/frontend-components/FilterChips';
import {
  ClearFilterElement,
  ClearFilters,
  EnumElement,
  FilterBase,
  FilterContent,
  Filters,
  OptionalFilterBase,
  SetFilters,
  StandardFilterEnum,
} from './Filters';

const getFilterItemType = <FilterColumn extends StandardFilterEnum<never>>(
  column: EnumElement<FilterColumn>,
  meta: ColumnsMetada<FilterColumn>[EnumElement<FilterColumn>]
) => {
  const options = meta.options;
  if (options) {
    if (options.exclusive) {
      return 'radio';
    } else {
      return 'checkbox';
    }
  }

  return 'text';
};

const getFilterItemValue = <FilterColumn extends StandardFilterEnum<never>>(
  column: EnumElement<FilterColumn>,
  filters: Filters<FilterColumn>[EnumElement<FilterColumn>],
  meta: ColumnsMetada<FilterColumn>[EnumElement<FilterColumn>]
) => {
  const options = meta.options;
  let value: FilterContent = filters;
  if (options) {
    if (options.exclude) {
      if (typeof value === 'string') {
        if (options.exclude.includes(value)) {
          value = '';
        }
      } else {
        if (value) {
          value = value.filter((v) => !options?.exclude?.includes(v));
        }
      }
    }

    if (options.default) {
      if (
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        value = options.default;
      }
    }

    if (value === undefined || value === '') {
      value = options.exclusive === false ? [] : '';
    }
  }

  return value;
};

const filterItem = <FilterColumn extends StandardFilterEnum<never>>(
  column: EnumElement<FilterColumn>,
  filters: Filters<FilterColumn>[EnumElement<FilterColumn>],
  setFilters: SetFilters<FilterColumn>[EnumElement<FilterColumn>],
  meta: ColumnsMetada<FilterColumn>[EnumElement<FilterColumn>]
) => ({
  label: meta.label,
  type: getFilterItemType(column, meta),
  filterValues: {
    id: `filter-${column}`,
    value: getFilterItemValue(column, filters, meta),
    placeholder: meta.placeholder,
    onChange: (_event, value: string | Array<string>) => {
      const options = meta.options;
      if (options) {
        if (options.exclusive) {
          if (options.exclude?.includes(value as string)) {
            setFilters('');
          } else if (options.items.find((i) => i.value === value)) {
            setFilters(value);
          }
        } else {
          setFilters(
            (value as Array<string>).filter((v) =>
              options.items.find((i) => i.value === v)
            )
          );
        }
      } else {
        setFilters(value);
      }
    },
    items: meta.options?.items,
  },
});

const getChipValue = <FilterColumn extends StandardFilterEnum<never>>(
  value: string,
  items: FilterColumnMetadataOptionsBase<FilterColumn>['items']
) => {
  const found = items.find((i) => i.value === value);
  return found?.chipValue ?? value;
};

const getActiveFilterConfigItem = <
  FilterColumn extends StandardFilterEnum<never>
>(
  column: EnumElement<FilterColumn>,
  filters: Filters<FilterColumn>[EnumElement<FilterColumn>],
  meta: ColumnsMetada<FilterColumn>[EnumElement<FilterColumn>]
) => {
  const value: FilterContent = filters;
  let chipsValues: Array<string> = [];
  const options = meta.options;
  if (value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'string') {
    if (options?.exclude?.includes(value)) {
      return undefined;
    } else {
      chipsValues = [value];
    }
  } else {
    if (options?.exclude) {
      chipsValues = value.filter((v) => !options?.exclude?.includes(v));
    } else {
      chipsValues = value;
    }
  }

  if (chipsValues.length === 0) {
    return undefined;
  }

  return {
    category: meta.label,
    chips: chipsValues.map((v) => ({
      name: getChipValue(v, options?.items ?? []),
      value: v,
      isRead: true,
    })),
  };
};

interface FilterColumnMetadataOptionsBase<T> {
  exclude?: Array<string>;
  default?: T;
  exclusive?: boolean;
  items: Array<{
    value: string;
    chipValue?: string;
    label: ReactNode;
  }>;
}

interface FilterColumnMetadataOptionsSingleValue
  extends FilterColumnMetadataOptionsBase<string> {
  exclusive?: true;
}

interface FilterColumnMetadataOptionsMultipleValue
  extends FilterColumnMetadataOptionsBase<Array<string>> {
  exclusive?: false;
}

export interface FilterColumnMetadata {
  label: string;
  placeholder: string;
  options?:
    | FilterColumnMetadataOptionsSingleValue
    | FilterColumnMetadataOptionsMultipleValue;
}

export type OptionalColumnsMetada<Enum extends StandardFilterEnum<never>> =
  OptionalFilterBase<Enum, FilterColumnMetadata>;
export type ColumnsMetada<Enum extends StandardFilterEnum<never>> = FilterBase<
  Enum,
  FilterColumnMetadata
>;

export const usePrimaryToolbarFilterConfig = <
  FilterColumn extends StandardFilterEnum<never>
>(
  initEnum: FilterColumn,
  filters: Filters<FilterColumn>,
  setFilters: SetFilters<FilterColumn>,
  clearFilters: ClearFilters<FilterColumn>,
  meta: OptionalColumnsMetada<FilterColumn>,
  deleteTitle?: 'Reset filters'
) => {
  const [Enum] = useState(initEnum);

  const filterConfig = useMemo(
    () => ({
      items: (
        Object.values(Enum) as unknown as Array<EnumElement<FilterColumn>>
      )
        .filter((e) => meta[e])
        .map((column) =>
          filterItem(
            column,
            filters[column],
            setFilters[column],
            meta[column] as FilterColumnMetadata
          )
        ),
    }),
    [filters, setFilters, meta, Enum]
  );

  const onFilterDelete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event, rawFilterConfigs: any[]) => {
      const toClear: ClearFilterElement<FilterColumn> = {};
      for (const element of rawFilterConfigs) {
        const key = Object.keys(meta).find(
          (key) => meta[key] && meta[key].label === element.category
        ) as undefined | EnumElement<FilterColumn>;
        if (key && Object.values(Enum).includes(key)) {
          toClear[key] = element.chips.map((c) => c.name); // Todo: Check chips - do they have a value?
        } else {
          throw new Error(
            `Unexpected filter column label found: ${element.category}`
          );
        }
      }

      clearFilters(toClear);
    },
    [clearFilters, Enum, meta]
  );

  const activeFiltersConfig = useMemo(() => {
    const filterConfig: Array<FilterChipsFilter> = [];
    for (const column of Object.values(Enum) as Array<
      EnumElement<FilterColumn>
    >) {
      if (!meta[column]) {
        continue;
      }

      const config = getActiveFilterConfigItem(
        column,
        filters[column],
        meta[column] as FilterColumnMetadata
      );
      if (config) {
        filterConfig.push(config);
      }
    }

    return {
      filters: filterConfig,
      onDelete: onFilterDelete,
    };
  }, [filters, onFilterDelete, Enum, meta]);

  return {
    filterConfig,
    activeFiltersConfig,
    deleteTitle,
  };
};
