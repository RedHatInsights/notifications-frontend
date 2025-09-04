import {
  Content,
  Pagination,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import {
  DataView,
  DataViewCheckboxFilter,
  DataViewTextFilter,
  DataViewToolbar,
  useDataViewFilters,
  useDataViewPagination,
  useDataViewSelection,
} from '@patternfly/react-data-view';
import {
  ExpandableRowContent,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import {
  BulkSelect,
  BulkSelectValue,
} from '@patternfly/react-component-groups/dist/dynamic/BulkSelect';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewFilters from '@patternfly/react-data-view/dist/cjs/DataViewFilters';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';
import { toNotifications } from '../../types/adapters/NotificationAdapter';
import {
  getEventTypes,
  paramsCreator,
} from '../../api/helpers/notifications/event-types-helper';
import { EventType, Facet } from '../../types/Notification';
import { debouncePromise } from '../../pages/Integrations/Create/nameValidator';
import { perPageOptions } from '../../config/Config';

interface EventTypeFilters {
  filterEventFilterName?: string;
  filterApplicationId?: string[];
}

interface EventTypesProps {
  selectedEvents?: readonly EventType[];
  setSelectedEvents?: React.Dispatch<
    React.SetStateAction<EventType[] | undefined>
  >;
  currBundle: Facet;
  applications?: readonly Facet[];
}

const EventTypes: React.FC<EventTypesProps> = ({
  selectedEvents,
  setSelectedEvents,
  currBundle,
  applications,
}) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<{
    meta?: { count: number };
    data?: EventType[];
  }>({});
  const [expanded, SetExpanded] = useState<string[]>([]);
  const setEventExpanded = (event: EventType, isExpanding = true) =>
    SetExpanded((prevExpanded) => {
      const otherExpanded = prevExpanded.filter((r) => r !== event.id);
      return isExpanding ? [...otherExpanded, event.id] : otherExpanded;
    });
  const isEventExpanded = (event: EventType) => expanded.includes(event.id);
  const { filters, onSetFilters, clearAllFilters } =
    useDataViewFilters<EventTypeFilters>({
      initialFilters: { filterEventFilterName: '', filterApplicationId: [] },
    });

  const { page, perPage, onSetPage, onPerPageSelect } = useDataViewPagination({
    perPage: 20,
  });

  const selection = useDataViewSelection({
    matchOption: (a, b) => a.id === b.id,
    initialSelected: selectedEvents ? [...selectedEvents] : undefined,
  });
  const { selected, onSelect, isSelected } = selection;

  const setSelected = useCallback(
    (selection, newSelect: EventType[] = [], prevSelected) => {
      setSelectedEvents?.([
        ...prevSelected.filter(
          (item) => !newSelect.some((newItem) => newItem.id === item.id)
        ),
        ...(selection ? newSelect : []),
      ]);
      onSelect(selection, newSelect);
    },
    [onSelect, setSelectedEvents]
  );

  useEffect(() => {
    setSelectedEvents?.([...(selectedEvents || [])]);
    onSelect(false, selected);
    onSelect(true, [...(selectedEvents || [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currBundle.id]);

  const fetchNotifications = useCallback(
    async (pager, filters) => {
      setLoading(true);
      try {
        const response = await getEventTypes(
          paramsCreator({ ...pager, filterBundleId: currBundle.id, ...filters })
        );
        setResponse({
          ...response,
          data: toNotifications(response.data) ?? [],
        });
      } finally {
        setLoading(false);
      }
    },
    [currBundle.id]
  );

  const debouncedFetchNotifications = useMemo(
    () => debouncePromise(fetchNotifications),
    [fetchNotifications]
  );

  useEffect(() => {
    fetchNotifications(
      {
        limit: perPage,
        offset: (page - 1) * perPage,
      },
      {}
    );
  }, [fetchNotifications, page, perPage]);

  const handleBulkSelect = (value: BulkSelectValue) => {
    value === BulkSelectValue.none && setSelected(false, selected, selected);
    value === BulkSelectValue.nonePage &&
      setSelected(false, response.data, selected);
    value === BulkSelectValue.page &&
      setSelected(true, response.data, selected);
    if (value === BulkSelectValue.all) {
      (async () => {
        const { data } = await getEventTypes(
          paramsCreator({
            limit: `${response.meta?.count}`,
            offset: '0',
            bundleId: currBundle.id,
          })
        );
        setSelected(true, data, selected);
      })();
    }
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h4" size="xl">
          Associate event types
        </Title>
        <Content className="pf-v5-u-pt-sm">
          <Content component="p">
            Select event types you would like to assign this behavior group to.
          </Content>
        </Content>
      </StackItem>
      <StackItem>
        <DataView
          selection={selection}
          activeState={
            loading
              ? 'loading'
              : (response.data?.length || 0) > 0
              ? undefined
              : 'empty'
          }
        >
          <DataViewToolbar
            aria-label="Events type top toolbar"
            ouiaId="LayoutExampleHeader"
            clearAllFilters={() => {
              fetchNotifications(
                {
                  limit: perPage,
                  offset: (page - 1) * perPage,
                },
                {}
              );
              clearAllFilters();
            }}
            bulkSelect={
              <BulkSelect
                aria-label="Event types bulk select"
                canSelectAll
                pageCount={response.data?.length || 0}
                totalCount={response.meta?.count}
                selectedCount={selected.length}
                pageSelected={
                  response.data?.length !== 0 &&
                  response.data?.every((item) => isSelected(item))
                }
                pagePartiallySelected={
                  response.data?.some((item) => isSelected(item)) &&
                  !response.data?.every((item) => isSelected(item))
                }
                onSelect={handleBulkSelect}
              />
            }
            filters={
              <DataViewFilters
                aria-label="Event types filters"
                onChange={(_e, values) => {
                  if (
                    values.filterEventFilterName !==
                    filters.filterEventFilterName
                  ) {
                    debouncedFetchNotifications(
                      {
                        limit: perPage,
                        offset: (page - 1) * perPage,
                      },
                      values
                    );
                  } else {
                    fetchNotifications(
                      {
                        limit: perPage,
                        offset: (page - 1) * perPage,
                      },
                      values
                    );
                  }
                  onSetFilters(values);
                }}
                values={filters}
              >
                <DataViewTextFilter
                  aria-label="Filter by event type"
                  filterId="filterEventFilterName"
                  title="Event type"
                  placeholder="Filter by event type"
                />
                <DataViewCheckboxFilter
                  aria-label="Filter by event Service"
                  filterId="filterApplicationId"
                  title="Service"
                  placeholder="Filter by service"
                  options={
                    applications?.map(({ id, displayName }) => ({
                      label: displayName,
                      value: id,
                    })) || []
                  }
                />
              </DataViewFilters>
            }
            pagination={
              <Pagination
                aria-label="Event types top pagination"
                isCompact
                perPageOptions={perPageOptions}
                itemCount={response.meta?.count}
                page={page}
                perPage={perPage}
                onSetPage={(e, newPage) => {
                  onSetPage(e, newPage);
                  fetchNotifications(
                    {
                      limit: perPage,
                      offset: (newPage - 1) * perPage,
                    },
                    {}
                  );
                }}
                onPerPageSelect={(e, newPerPage) => {
                  onPerPageSelect(e, newPerPage);
                  onSetPage(e, 1);
                  fetchNotifications(
                    {
                      limit: newPerPage,
                      offset: 0,
                    },
                    {}
                  );
                }}
              />
            }
          />
          <Table variant={'compact'} aria-label="Event types table">
            {loading ? (
              <SkeletonTableHead columns={['Event type', 'Service']} />
            ) : (
              <Thead aria-label="Event types table head">
                <Tr>
                  <Th screenReaderText="Row selection" />
                  <Th screenReaderText="Row expansion" />
                  <Th>Event type</Th>
                  <Th>Service</Th>
                </Tr>
              </Thead>
            )}
            {loading ? (
              <SkeletonTableBody rowsCount={5} columnsCount={2} />
            ) : (
              response.data?.map((row: EventType, index) => (
                <Tbody key={index}>
                  <Tr
                    aria-label={`Event type ${row.id}`}
                    isContentExpanded={isEventExpanded(row)}
                  >
                    <Td
                      aria-label={
                        row.description
                          ? `Expandable row - ${
                              isEventExpanded(row) ? 'expanded' : 'collapsed'
                            }`
                          : 'Non expandable row'
                      }
                      expand={
                        row.description
                          ? {
                              rowIndex: index,
                              isExpanded: isEventExpanded(row),
                              onToggle: () =>
                                setEventExpanded(row, !isEventExpanded(row)),
                              expandId: 'composable-expandable-example',
                            }
                          : undefined
                      }
                    />
                    <Td
                      aria-label={`Selectable row - ${
                        selected.find(({ id }) => id === row.id)
                          ? 'selected'
                          : 'not selected'
                      }`}
                      select={{
                        rowIndex: index,
                        onSelect: (_event, isSelecting) =>
                          setSelected(isSelecting, [row], selected),
                        isSelected: selected.find(({ id }) => id === row.id),
                      }}
                    />
                    <Td dataLabel="event-type">{row.applicationDisplayName}</Td>
                    <Td dataLabel="service">{row.eventTypeDisplayName}</Td>
                  </Tr>
                  {row.description ? (
                    <Tr
                      aria-label="Event type description"
                      isExpanded={isEventExpanded(row)}
                    >
                      <Td dataLabel="Event type description" colSpan={4}>
                        <ExpandableRowContent>
                          {row.description}
                        </ExpandableRowContent>
                      </Td>
                    </Tr>
                  ) : null}
                </Tbody>
              ))
            )}
          </Table>
          <DataViewToolbar
            ouiaId="EventTypesFooter"
            aria-label="Event types footer"
            pagination={
              <Pagination
                aria-label="Event types footer pagination"
                perPageOptions={perPageOptions}
                itemCount={response.meta?.count}
                page={page}
                perPage={perPage}
                onSetPage={(e, newPage) => {
                  onSetPage(e, newPage);
                  fetchNotifications(
                    {
                      limit: perPage,
                      offset: (newPage - 1) * perPage,
                    },
                    {}
                  );
                }}
                onPerPageSelect={(e, newPerPage) => {
                  onPerPageSelect(e, newPerPage);
                  onSetPage(e, 1);
                  fetchNotifications(
                    {
                      limit: newPerPage,
                      offset: 0,
                    },
                    {}
                  );
                }}
              />
            }
          />
        </DataView>
      </StackItem>
    </Stack>
  );
};

export default EventTypes;
