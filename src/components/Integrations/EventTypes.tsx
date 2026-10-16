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
import { useFlag } from '@unleash/proxy-client-react';
import { defineMessages, useIntl } from 'react-intl';
import DataViewFilters from '@patternfly/react-data-view/dist/cjs/DataViewFilters';
import { SkeletonTableBody, SkeletonTableHead } from '@patternfly/react-component-groups';
import { toNotifications } from '../../types/adapters/NotificationAdapter';
import { getEventTypes, paramsCreator } from '../../api/helpers/notifications/event-types-helper';
import { EventType, Facet } from '../../types/Notification';
import { debouncePromise } from '../../pages/Integrations/Create/nameValidator';
import { perPageOptions } from '../../config/Config';
import {
  hasDisplayableSeverity,
  severityDescription,
  severityDisplayName,
  toSeverityLabelProps,
} from '../../utils/severityUtils';

const messages = defineMessages({
  title: {
    id: 'integrations.eventTypes.title',
    defaultMessage: 'Associate event types',
  },
  description: {
    id: 'integrations.eventTypes.description',
    defaultMessage: 'Select event types you would like to assign this behavior group to.',
  },
  toolbarAria: {
    id: 'integrations.eventTypes.toolbarAria',
    defaultMessage: 'Events type top toolbar',
  },
  bulkSelectAria: {
    id: 'integrations.eventTypes.bulkSelectAria',
    defaultMessage: 'Event types bulk select',
  },
  filtersAria: {
    id: 'integrations.eventTypes.filtersAria',
    defaultMessage: 'Event types filters',
  },
  eventTypeFilterAria: {
    id: 'integrations.eventTypes.eventTypeFilterAria',
    defaultMessage: 'Filter by event type',
  },
  eventTypeFilterTitle: {
    id: 'integrations.eventTypes.eventTypeFilterTitle',
    defaultMessage: 'Event type',
  },
  eventTypeFilterPlaceholder: {
    id: 'integrations.eventTypes.eventTypeFilterPlaceholder',
    defaultMessage: 'Filter by event type',
  },
  serviceFilterAria: {
    id: 'integrations.eventTypes.serviceFilterAria',
    defaultMessage: 'Filter by event Service',
  },
  serviceFilterTitle: {
    id: 'integrations.eventTypes.serviceFilterTitle',
    defaultMessage: 'Service',
  },
  serviceFilterPlaceholder: {
    id: 'integrations.eventTypes.serviceFilterPlaceholder',
    defaultMessage: 'Filter by service',
  },
  topPaginationAria: {
    id: 'integrations.eventTypes.topPaginationAria',
    defaultMessage: 'Event types top pagination',
  },
  tableAria: {
    id: 'integrations.eventTypes.tableAria',
    defaultMessage: 'Event types table',
  },
  tableHeadAria: {
    id: 'integrations.eventTypes.tableHeadAria',
    defaultMessage: 'Event types table head',
  },
  eventTypeColumn: {
    id: 'integrations.eventTypes.eventTypeColumn',
    defaultMessage: 'Event type',
  },
  serviceColumn: {
    id: 'integrations.eventTypes.serviceColumn',
    defaultMessage: 'Service',
  },
  severityColumn: {
    id: 'integrations.eventTypes.severityColumn',
    defaultMessage: 'Severity',
  },
  rowSelectionSr: {
    id: 'integrations.eventTypes.rowSelectionSr',
    defaultMessage: 'Row selection',
  },
  rowExpansionSr: {
    id: 'integrations.eventTypes.rowExpansionSr',
    defaultMessage: 'Row expansion',
  },
  footerAria: {
    id: 'integrations.eventTypes.footerAria',
    defaultMessage: 'Event types footer',
  },
  eventTypeDescriptionAria: {
    id: 'integrations.eventTypes.eventTypeDescriptionAria',
    defaultMessage: 'Event type description',
  },
  footerPaginationAria: {
    id: 'integrations.eventTypes.footerPaginationAria',
    defaultMessage: 'Event types footer pagination',
  },
});

interface EventTypeFilters {
  filterEventFilterName?: string;
  filterApplicationId?: string[];
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
  const isSeverityEnabled = useFlag('platform.notifications.severity');
  const intl = useIntl();
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
    const pageData = response.data ?? [];
    value === BulkSelectValue.none && setSelected(false, selected, selected);
    value === BulkSelectValue.nonePage && setSelected(false, pageData, selected);
    value === BulkSelectValue.page && setSelected(true, pageData, selected);
    if (value === BulkSelectValue.all) {
      (async () => {
        const { data } = await getEventTypes(
          paramsCreator({
            limit: `${response.meta?.count}`,
            offset: '0',
            filterBundleId: currBundle.id,
            ...filters,
          })
        );
        const allData = toNotifications(data) ?? [];
        setSelected(true, allData, selected);
      })();
    }
  };

  const displayData = response.data ?? [];

  const renderSeverityCell = (event: EventType) => {
    const severity = event.defaultSeverity;
    if (!hasDisplayableSeverity(severity)) {
      return null;
    }

    return (
      <Tooltip content={severityDescription[severity]}>
        <Label {...toSeverityLabelProps(severity)}>
          {severityDisplayName[severity] ?? severity}
        </Label>
      </Tooltip>
    );
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h4" size="xl">
          {intl.formatMessage(messages.title)}
        </Title>
        <Content className="pf-v6-u-pt-sm">
          <Content component="p">{intl.formatMessage(messages.description)}</Content>
        </Content>
      </StackItem>
      <StackItem>
        <DataView
          selection={selection}
          activeState={loading ? 'loading' : displayData.length > 0 ? undefined : 'empty'}
        >
          <DataViewToolbar
            aria-label={intl.formatMessage(messages.toolbarAria)}
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
                aria-label={intl.formatMessage(messages.bulkSelectAria)}
                canSelectAll
                pageCount={displayData.length}
                totalCount={response.meta?.count}
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
                aria-label={intl.formatMessage(messages.filtersAria)}
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
                  onSetFilters(values);
                }}
                values={filters}
              >
                <DataViewTextFilter
                  aria-label={intl.formatMessage(messages.eventTypeFilterAria)}
                  filterId="filterEventFilterName"
                  title={intl.formatMessage(messages.eventTypeFilterTitle)}
                  placeholder={intl.formatMessage(messages.eventTypeFilterPlaceholder)}
                />
                <DataViewCheckboxFilter
                  aria-label={intl.formatMessage(messages.serviceFilterAria)}
                  filterId="filterApplicationId"
                  title={intl.formatMessage(messages.serviceFilterTitle)}
                  placeholder={intl.formatMessage(messages.serviceFilterPlaceholder)}
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
                aria-label={intl.formatMessage(messages.topPaginationAria)}
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
          <Table variant={'compact'} aria-label={intl.formatMessage(messages.tableAria)}>
            {loading ? (
              <SkeletonTableHead
                columns={
                  isSeverityEnabled
                    ? [
                        intl.formatMessage(messages.eventTypeColumn),
                        intl.formatMessage(messages.serviceColumn),
                        intl.formatMessage(messages.severityColumn),
                      ]
                    : [
                        intl.formatMessage(messages.eventTypeColumn),
                        intl.formatMessage(messages.serviceColumn),
                      ]
                }
              />
            ) : (
              <Thead aria-label={intl.formatMessage(messages.tableHeadAria)}>
                <Tr>
                  <Th screenReaderText={intl.formatMessage(messages.rowSelectionSr)} />
                  <Th screenReaderText={intl.formatMessage(messages.rowExpansionSr)} />
                  <Th>{intl.formatMessage(messages.eventTypeColumn)}</Th>
                  <Th>{intl.formatMessage(messages.serviceColumn)}</Th>
                  {isSeverityEnabled && <Th>{intl.formatMessage(messages.severityColumn)}</Th>}
                </Tr>
              </Thead>
            )}
            {loading ? (
              <SkeletonTableBody rowsCount={5} columnsCount={isSeverityEnabled ? 3 : 2} />
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
                        isSelected: !!selected.find(({ id }) => id === row.id),
                      }}
                    />
                    <Td dataLabel="event-type">{row.eventTypeDisplayName}</Td>
                    <Td dataLabel="service">{row.applicationDisplayName}</Td>
                    {isSeverityEnabled && <Td dataLabel="severity">{renderSeverityCell(row)}</Td>}
                  </Tr>
                  {row.description ? (
                    <Tr
                      aria-label={intl.formatMessage(messages.eventTypeDescriptionAria)}
                      isExpanded={isEventExpanded(row)}
                    >
                      <Td
                        dataLabel={intl.formatMessage(messages.eventTypeDescriptionAria)}
                        colSpan={isSeverityEnabled ? 5 : 4}
                      >
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
            aria-label={intl.formatMessage(messages.footerAria)}
            pagination={
              <Pagination
                aria-label={intl.formatMessage(messages.footerPaginationAria)}
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
