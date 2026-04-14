import {
  Content,
  Label,
  Pagination,
  Stack,
  StackItem,
  Title,
  Tooltip,
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
import { ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import {
  BulkSelect,
  BulkSelectValue,
} from '@patternfly/react-component-groups/dist/dynamic/BulkSelect';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataViewFilters from '@patternfly/react-data-view/dist/cjs/DataViewFilters';
import { SkeletonTableBody, SkeletonTableHead } from '@patternfly/react-component-groups';
import { toNotifications } from '../../types/adapters/NotificationAdapter';
import { getEventTypes, paramsCreator } from '../../api/helpers/notifications/event-types-helper';
import { EventType, Facet } from '../../types/Notification';
import { debouncePromise } from '../../pages/Integrations/Create/nameValidator';
import { perPageOptions } from '../../config/Config';
import {
  SEVERITY_VALUES,
  severityDescription,
  severityDisplayName,
  toSeverityLabelProps,
} from '../../utils/severityUtils';

interface EventTypeFilters {
  filterEventFilterName?: string;
  filterApplicationId?: string[];
  filterSeverity?: string[];
}

interface EventTypesProps {
  selectedEvents?: readonly EventType[];
  setSelectedEvents?: React.Dispatch<React.SetStateAction<EventType[] | undefined>>;
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
  const [expanded, setExpanded] = useState<string[]>([]);
  const setEventExpanded = (event: EventType, isExpanding = true) =>
    setExpanded((prevExpanded) => {
      const otherExpanded = prevExpanded.filter((r) => r !== event.id);
      return isExpanding ? [...otherExpanded, event.id] : otherExpanded;
    });
  const isEventExpanded = (event: EventType) => expanded.includes(event.id);
  const { filters, onSetFilters, clearAllFilters } = useDataViewFilters<EventTypeFilters>({
    initialFilters: { filterEventFilterName: '', filterApplicationId: [], filterSeverity: [] },
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
        ...prevSelected.filter((item) => !newSelect.some((newItem) => newItem.id === item.id)),
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

  // Filter data client-side by severity since the API does not support it
  const filteredData = useMemo(() => {
    if (!response.data || !filters.filterSeverity || filters.filterSeverity.length === 0) {
      return response.data;
    }

    return response.data.filter((event) => {
      const sev = event.defaultSeverity ?? 'UNDEFINED';
      return filters.filterSeverity!.includes(sev);
    });
  }, [response.data, filters.filterSeverity]);

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
    const dataForBulk = filteredData ?? [];
    value === BulkSelectValue.none && setSelected(false, selected, selected);
    value === BulkSelectValue.nonePage && setSelected(false, dataForBulk, selected);
    value === BulkSelectValue.page && setSelected(true, dataForBulk, selected);
    if (value === BulkSelectValue.all) {
      (async () => {
        const { data } = await getEventTypes(
          paramsCreator({
            limit: `${response.meta?.count}`,
            offset: '0',
            bundleId: currBundle.id,
          })
        );
        const allData = toNotifications(data) ?? [];
        // Apply severity filter to all data if active
        const filtered =
          filters.filterSeverity && filters.filterSeverity.length > 0
            ? allData.filter((event) => {
                const sev = event.defaultSeverity ?? 'UNDEFINED';
                return filters.filterSeverity!.includes(sev);
              })
            : allData;
        setSelected(true, filtered, selected);
      })();
    }
  };

  const displayData = filteredData ?? [];

  const renderSeverityCell = (event: EventType) => {
    const severity = event.defaultSeverity;
    if (severity) {
      return (
        <Tooltip content={severityDescription[severity]}>
          <Label {...toSeverityLabelProps(severity)}>
            {severityDisplayName[severity] ?? severity}
          </Label>
        </Tooltip>
      );
    }

    return (
      <Tooltip content={severityDescription.UNDEFINED}>
        <Label {...toSeverityLabelProps(undefined)}>{'— Undefined'}</Label>
      </Tooltip>
    );
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
          activeState={loading ? 'loading' : displayData.length > 0 ? undefined : 'empty'}
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
                pageCount={displayData.length}
                totalCount={
                  filters.filterSeverity && filters.filterSeverity.length > 0
                    ? displayData.length
                    : response.meta?.count
                }
                selectedCount={selected.length}
                pageSelected={
                  displayData.length !== 0 && displayData.every((item) => isSelected(item))
                }
                pagePartiallySelected={
                  displayData.some((item) => isSelected(item)) &&
                  !displayData.every((item) => isSelected(item))
                }
                onSelect={handleBulkSelect}
              />
            }
            filters={
              <DataViewFilters
                aria-label="Event types filters"
                onChange={(_e, values) => {
                  if (values.filterEventFilterName !== filters.filterEventFilterName) {
                    debouncedFetchNotifications(
                      {
                        limit: perPage,
                        offset: (page - 1) * perPage,
                      },
                      values
                    );
                  } else if (
                    JSON.stringify(values.filterApplicationId) !==
                    JSON.stringify(filters.filterApplicationId)
                  ) {
                    fetchNotifications(
                      {
                        limit: perPage,
                        offset: (page - 1) * perPage,
                      },
                      values
                    );
                  }
                  // Severity filter is client-side, no need to refetch
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
                <DataViewCheckboxFilter
                  aria-label="Filter by severity"
                  filterId="filterSeverity"
                  title="Severity"
                  placeholder="Filter by severity"
                  options={SEVERITY_VALUES.map((sev) => ({
                    label: severityDisplayName[sev],
                    value: sev,
                  }))}
                />
              </DataViewFilters>
            }
            pagination={
              <Pagination
                aria-label="Event types top pagination"
                isCompact
                perPageOptions={perPageOptions}
                itemCount={
                  filters.filterSeverity && filters.filterSeverity.length > 0
                    ? displayData.length
                    : response.meta?.count
                }
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
              <SkeletonTableHead columns={['Event type', 'Service', 'Severity']} />
            ) : (
              <Thead aria-label="Event types table head">
                <Tr>
                  <Th screenReaderText="Row selection" />
                  <Th screenReaderText="Row expansion" />
                  <Th>Event type</Th>
                  <Th>Service</Th>
                  <Th>Severity</Th>
                </Tr>
              </Thead>
            )}
            {loading ? (
              <SkeletonTableBody rowsCount={5} columnsCount={3} />
            ) : (
              displayData.map((row: EventType, index) => (
                <Tbody key={index}>
                  <Tr aria-label={`Event type ${row.id}`} isContentExpanded={isEventExpanded(row)}>
                    <Td
                      aria-label={
                        row.description
                          ? `Expandable row - ${isEventExpanded(row) ? 'expanded' : 'collapsed'}`
                          : 'Non expandable row'
                      }
                      expand={
                        row.description
                          ? {
                              rowIndex: index,
                              isExpanded: isEventExpanded(row),
                              onToggle: () => setEventExpanded(row, !isEventExpanded(row)),
                              expandId: 'composable-expandable-example',
                            }
                          : undefined
                      }
                    />
                    <Td
                      aria-label={`Selectable row - ${
                        selected.find(({ id }) => id === row.id) ? 'selected' : 'not selected'
                      }`}
                      select={{
                        rowIndex: index,
                        onSelect: (_event, isSelecting) =>
                          setSelected(isSelecting, [row], selected),
                        isSelected: selected.find(({ id }) => id === row.id),
                      }}
                    />
                    <Td dataLabel="event-type">{row.eventTypeDisplayName}</Td>
                    <Td dataLabel="service">{row.applicationDisplayName}</Td>
                    <Td dataLabel="severity">{renderSeverityCell(row)}</Td>
                  </Tr>
                  {row.description ? (
                    <Tr aria-label="Event type description" isExpanded={isEventExpanded(row)}>
                      <Td dataLabel="Event type description" colSpan={5}>
                        <ExpandableRowContent>{row.description}</ExpandableRowContent>
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
                itemCount={
                  filters.filterSeverity && filters.filterSeverity.length > 0
                    ? displayData.length
                    : response.meta?.count
                }
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
