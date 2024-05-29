import React from 'react';
import useFieldApi, {
  UseFieldApiProps,
} from '@data-driven-forms/react-form-renderer/use-field-api';
import {
  NotificationsToolbar,
  NotificationsToolbarProps,
} from '../../../../components/Notifications/Toolbar';
import { NotificationFilters } from '../../../../components/Notifications/Filter';

interface TableToolbarProps extends UseFieldApiProps<NotificationFilters> {
  name: string;
  filters: NotificationsToolbarProps['filters'];
  setFilters: NotificationsToolbarProps['setFilters'];
  clearFilter: NotificationsToolbarProps['clearFilter'];
  appFilterOptions: NotificationsToolbarProps['appFilterOptions'];
  pageAdapter: NotificationsToolbarProps['pageAdapter'];
  count: NotificationsToolbarProps['count'];
  pageCount?: NotificationsToolbarProps['pageCount'];
  onSelectionChanged?: NotificationsToolbarProps['onSelectionChanged'];
  selectedCount?: NotificationsToolbarProps['selectedCount'];
  bulkSelectionDisabled?: NotificationsToolbarProps['bulkSelectionDisabled'];
}

const TableToolbar: React.FC<TableToolbarProps> = (props) => {
  const {
    filters,
    setFilters,
    clearFilter,
    appFilterOptions,
    pageAdapter,
    count,
    pageCount,
    onSelectionChanged,
    selectedCount,
    bulkSelectionDisabled,
    ...rest
  } = useFieldApi(props);

  return (
    <NotificationsToolbar
      {...rest}
      filters={filters}
      setFilters={setFilters}
      clearFilter={clearFilter}
      appFilterOptions={appFilterOptions}
      pageAdapter={pageAdapter}
      count={count}
      pageCount={pageCount}
      onSelectionChanged={onSelectionChanged}
      selectedCount={selectedCount}
      bulkSelectionDisabled={bulkSelectionDisabled}
    />
  );
};

export default TableToolbar;
