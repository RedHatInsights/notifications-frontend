import { Pagination } from '@patternfly/react-core';
import {
  Table as TableComposable,
  Tbody,
  Td,
  Th,
  ThProps,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import NotificationsLogEmptyState from './NotificationsLogEmptyState';

export type DirectionType = 'asc' | 'desc';

export type OnSort = (index: number, direction: DirectionType) => void;

export type SortType = {
  columnIndex: number;
  direction: DirectionType;
};

export type PaginationType = {
  limit: number;
  offset: number;
  count: number;
};

export type OnPagination = (pagnation: Omit<PaginationType, 'count'>) => void;

export type DrawerType = {
  id: string;
  description: string;
  title: string;
  created: string;
  read: boolean;
  source: string;
}[];

const NotificationsLogTable = ({
  isEmptyState,
  onSort,
  sort,
  drawer,
  onPagination,
  pagination,
}: {
  isEmptyState: boolean;
  onSort: OnSort;
  sort: SortType;
  drawer: DrawerType;
  onPagination: OnPagination;
  pagination: PaginationType;
}) => {
  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sort.columnIndex,
      direction: sort.direction,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      onSort(index, direction);
    },
    columnIndex,
  });

  return (
    <React.Fragment>
      <TableComposable>
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>Event type</Th>
            <Th>Service</Th>
            <Th sort={getSortParams(2)}>Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isEmptyState ? (
            <Tr>
              <Td colSpan={8}>
                <NotificationsLogEmptyState />
              </Td>
            </Tr>
          ) : (
            <React.Fragment>
              {drawer.map((data) => (
                <Tr key={data.id}>
                  <Td>{data.title}</Td>
                  <Td>{data.source}</Td>
                  <Td>
                    <DateFormat date={data.created} />
                  </Td>
                </Tr>
              ))}
            </React.Fragment>
          )}
        </Tbody>
      </TableComposable>
      <Pagination
        itemCount={pagination.count}
        perPage={pagination.limit}
        page={pagination.offset / pagination.limit + 1}
        onSetPage={(_ev, newPage, perPage) => {
          onPagination({
            limit: perPage ?? pagination.limit,
            offset: (newPage - 1) * (perPage ?? pagination.limit),
          });
        }}
        widgetId="pagination-id"
        onPerPageSelect={(_ev, perPage) => {
          onPagination({
            limit: perPage ?? pagination.limit,
            offset: 0,
          });
        }}
      />
    </React.Fragment>
  );
};

export default NotificationsLogTable;
