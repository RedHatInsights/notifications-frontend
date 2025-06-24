import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';
import { ConditionalFilterProps } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { FilterChipsProps } from '@redhat-cloud-services/frontend-components/FilterChips';
import * as React from 'react';
import { useCallback, useMemo } from 'react';

import { PageAdapter } from '../../hooks/usePage';
import { useTableExportConfig } from '../../hooks/useTableExportConfig';
import { isExperimental, stagingAndProd } from '../../types/Environments';
import { Facet } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import {
  ClearNotificationFilters,
  NotificationFilterColumn,
  NotificationFilters,
  SetNotificationFilters,
} from './Filter';
import {
  ExporterType,
  OptionalColumnsMetada,
  getInsights,
  useInsightsEnvironmentFlag,
  usePrimaryToolbarFilterConfig,
} from '../../utils/insights-common-typescript';

export enum SelectionCommand {
  NONE,
  PAGE,
  ALL,
}

export interface NotificationsToolbarProps extends OuiaProps {
  filters: NotificationFilters;
  setFilters: SetNotificationFilters;
  clearFilter: ClearNotificationFilters;
  filterColumns?: ReadonlyArray<NotificationFilterColumn>;

  appFilterOptions: ReadonlyArray<Facet>;

  pageAdapter: PageAdapter;
  count: number;

  onExport?: (type: ExporterType) => void;

  selectedCount?: number;
  onSelectionChanged?: (command: SelectionCommand) => void;
  bulkSelectionDisabled?: boolean;
  pageCount?: number;
}

const allFilterColumns = [
  NotificationFilterColumn.NAME,
  NotificationFilterColumn.APPLICATION,
  NotificationFilterColumn.ACTION,
];

export const NotificationsToolbar: React.FunctionComponent<
  React.PropsWithChildren<NotificationsToolbarProps>
> = (props) => {
  const insights = getInsights();
  const filterColumns = props.filterColumns ?? allFilterColumns;
  const filterMetadata = useMemo<
    OptionalColumnsMetada<typeof NotificationFilterColumn>
  >(() => {
    const appFilterItems = props.appFilterOptions.map((a) => ({
      value: a.displayName,
      label: <> {a.displayName}</>,
    }));

    return {
      [NotificationFilterColumn.NAME]: filterColumns.includes(
        NotificationFilterColumn.NAME
      )
        ? {
            label: 'Event type',
            placeholder: 'Filter by event type',
          }
        : undefined,
      [NotificationFilterColumn.APPLICATION]: filterColumns.includes(
        NotificationFilterColumn.APPLICATION
      )
        ? {
            label: 'Service',
            placeholder: 'Filter by service',
            options: {
              exclusive: false,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              default: [] as any,
              items: appFilterItems,
            },
          }
        : undefined,
      [NotificationFilterColumn.ACTION]:
        filterColumns.includes(NotificationFilterColumn.ACTION) &&
        isExperimental(insights)
          ? {
              label: 'Action',
              placeholder: 'Filter by action',
            }
          : undefined,
    };
  }, [props.appFilterOptions, insights, filterColumns]);

  const bulkSelectProps = React.useMemo(() => {
    const onSelectionChanged = props.onSelectionChanged;
    const count = props.count;
    const pageAdapter = props.pageAdapter;
    const selectedCount = props.selectedCount;
    const pageSize = pageAdapter.page.size;
    if (!onSelectionChanged) {
      return undefined;
    }

    const selectAll = () => onSelectionChanged(SelectionCommand.ALL);
    const selectNone = () => onSelectionChanged(SelectionCommand.NONE);

    return {
      count: selectedCount ?? 0,
      items: [
        {
          title: 'Select none (0)',
          onClick: selectNone,
        },
        {
          title: `Select page (${props.pageCount ?? pageSize})`,
          onClick: () => onSelectionChanged(SelectionCommand.PAGE),
        },
        {
          title: `Select all (${count})`,
          onClick: selectAll,
        },
      ],
      checked: selectedCount !== 0 && selectedCount === count,
      onSelect: (isSelected: boolean) =>
        isSelected ? selectAll() : selectNone(),
      isDisabled: props.bulkSelectionDisabled,
    };
  }, [
    props.onSelectionChanged,
    props.selectedCount,
    props.pageAdapter,
    props.count,
    props.bulkSelectionDisabled,
    props.pageCount,
  ]);

  const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
    NotificationFilterColumn,
    props.filters,
    props.setFilters,
    props.clearFilter,
    filterMetadata
  );

  const exportConfigInternal = useTableExportConfig(props.onExport);

  const filterConfig = primaryToolbarFilterConfig.filterConfig;
  const activeFiltersConfig = primaryToolbarFilterConfig.activeFiltersConfig;

  const exportConfig = useInsightsEnvironmentFlag(
    getInsights(),
    stagingAndProd,
    undefined,
    useCallback(() => exportConfigInternal, [exportConfigInternal])
  );

  const pageChanged = React.useCallback(
    (_event: unknown, page: number) => {
      const inner = props.pageAdapter.changePage;
      inner(page);
    },
    [props.pageAdapter]
  );

  const perPageChanged = React.useCallback(
    (_event: unknown, perPage: number) => {
      const inner = props.pageAdapter.changeItemsPerPage;
      inner(perPage);
    },
    [props.pageAdapter]
  );

  const topPaginationProps = React.useMemo<PaginationProps>(
    () => ({
      itemCount: props.count,
      page: props.pageAdapter.page.index,
      perPage: props.pageAdapter.page.size,
      isCompact: true,
      variant: PaginationVariant.top,
      onSetPage: pageChanged,
      onFirstClick: pageChanged,
      onPreviousClick: pageChanged,
      onNextClick: pageChanged,
      onLastClick: pageChanged,
      onPageInput: pageChanged,
      onPerPageSelect: perPageChanged,
    }),
    [props.count, props.pageAdapter, pageChanged, perPageChanged]
  );

  const bottomPaginationProps = React.useMemo<PaginationProps>(
    () => ({
      ...topPaginationProps,
      isCompact: false,
      variant: PaginationVariant.bottom,
    }),
    [topPaginationProps]
  );

  return (
    <div {...getOuiaProps('Notifications/DualToolbar', props)}>
      <PrimaryToolbar
        bulkSelect={bulkSelectProps}
        filterConfig={filterConfig as ConditionalFilterProps}
        activeFiltersConfig={activeFiltersConfig as FilterChipsProps}
        exportConfig={exportConfig}
        pagination={topPaginationProps}
      />
      {props.children}
      <PrimaryToolbar pagination={bottomPaginationProps} />
    </div>
  );
};
