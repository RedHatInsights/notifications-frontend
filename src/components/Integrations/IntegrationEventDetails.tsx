import React from 'react';
import {
  AssignedEventType,
  NameDisplayName,
  UserIntegration,
} from '../../types/Integration';
import { getEndpoint } from '../../api/helpers/integrations/endpoints-helper';
import { DataViewTable } from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';
import { DataView } from '@patternfly/react-data-view/dist/dynamic/DataView';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Pagination,
} from '@patternfly/react-core';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';
import {
  useDataViewPagination,
  useDataViewSort,
} from '@patternfly/react-data-view/dist/dynamic/Hooks';
import { DataViewToolbar } from '@patternfly/react-data-view';

const columns = [
  { label: 'Event Type', key: 'event-type' },
  { label: 'Service', key: 'service' },
  { label: 'Bundle', key: 'bundle' },
];

const ouiaId = 'Event-types';

export type EventTypes = AssignedEventType & {
  application: NameDisplayName;
  bundle: NameDisplayName;
};

const getColumnByKey = (row: EventTypes, key) =>
  ({
    'event-type': row.display_name,
    service: row.application.display_name,
    bundle: row.bundle.display_name,
  }[key]);

const sortData = (
  data: EventTypes[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined
) =>
  sortBy && direction
    ? [...data].sort((a, b) => {
        const first = getColumnByKey(a, sortBy);
        const second = getColumnByKey(b, sortBy);
        return direction === 'asc'
          ? first < second
            ? -1
            : first > second
            ? 1
            : 0
          : first > second
          ? -1
          : first < second
          ? 1
          : 0;
      })
    : data;

const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
];

const EmptyTable: React.FC<{ onEdit?: (event?: React.MouseEvent) => void }> = ({
  onEdit,
}) => (
  <Tbody>
    <Tr key="loading" ouiaId={`${ouiaId}-tr-loading`}>
      <Td colSpan={columns.length}>
        <EmptyState>
          <EmptyStateBody>
            There are no Events assigned to this integration.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => onEdit?.()}>
                Edit integration
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Td>
    </Tr>
  </Tbody>
);

const IntegrationEventDetails: React.FC<{
  id: string;
  onEdit?: (event?: React.MouseEvent) => void;
}> = ({ id, onEdit }) => {
  const [activeIntegration, setActiveIntegration] = React.useState<
    | (UserIntegration & {
        eventTypes?: EventTypes[];
      })
    | null
    | undefined
  >(undefined);
  const { sortBy, direction, onSort } = useDataViewSort();
  const pagination = useDataViewPagination({ perPage: 10 });
  const { page, perPage } = pagination;
  const sortByIndex = React.useMemo(
    () => columns.findIndex((item) => item?.key === sortBy),
    [sortBy]
  );
  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortByIndex,
      direction,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) =>
      onSort(_event, columns[index].key, direction),
    columnIndex,
  });
  const fetchIntegration = React.useCallback(async () => {
    setActiveIntegration(undefined);
    const data = await getEndpoint(id);
    if (data.event_types_group_by_bundles_and_applications) {
      const eventTypes = data.event_types_group_by_bundles_and_applications
        .flatMap(({ applications, ...bundle }) =>
          applications.map(({ event_types, ...application }) =>
            event_types.map((event) => ({ ...event, application, bundle }))
          )
        )
        .flat();
      setActiveIntegration({
        ...data,
        eventTypes,
      });
    } else {
      setActiveIntegration(null);
    }
  }, [id]);
  React.useEffect(() => {
    void fetchIntegration();
  }, [id, fetchIntegration]);

  return (
    <DataView
      ouiaId={ouiaId}
      activeState={
        activeIntegration === undefined
          ? 'loading'
          : activeIntegration === null
          ? 'empty'
          : undefined
      }
    >
      <DataViewToolbar
        ouiaId="DataViewHeader"
        pagination={
          <Pagination
            perPageOptions={perPageOptions}
            itemCount={(activeIntegration?.eventTypes || []).length}
            {...pagination}
          />
        }
      />

      <DataViewTable
        aria-label="Event types"
        variant="compact"
        columns={columns.map((column, index) => ({
          cell: column.label,
          props: { sort: getSortParams(index) },
        }))}
        headStates={{
          loading: (
            <SkeletonTableHead columns={columns.map(({ label }) => label)} />
          ),
        }}
        bodyStates={{
          loading: (
            <SkeletonTableBody rowsCount={10} columnsCount={columns.length} />
          ),
          empty: <EmptyTable onEdit={onEdit} />,
        }}
        rows={
          sortData(activeIntegration?.eventTypes || [], sortBy, direction)
            .slice((page - 1) * perPage, (page - 1) * perPage + perPage)
            .map(({ display_name, application, bundle }) => [
              display_name,
              application.display_name,
              bundle.display_name,
            ]) || []
        }
      />
      <DataViewToolbar
        ouiaId="DataViewFooter"
        pagination={
          <Pagination
            isCompact
            perPageOptions={perPageOptions}
            itemCount={(activeIntegration?.eventTypes || []).length}
            {...pagination}
          />
        }
      />
    </DataView>
  );
};

export default IntegrationEventDetails;
