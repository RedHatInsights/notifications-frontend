import { useFlag } from '@unleash/proxy-client-react';
import assertNever from 'assert-never';
import * as React from 'react';
import { useParameterizedQuery } from 'react-fetching-library';

import { EventLogDateFilterValue } from '../../../components/Notifications/EventLog/EventLogDateFilter';
import { EventLogFilters } from '../../../components/Notifications/EventLog/EventLogFilter';
import {
  EventLogTable,
  EventLogTableColumns,
  SortDirection,
} from '../../../components/Notifications/EventLog/EventLogTable';
import { EventLogToolbar } from '../../../components/Notifications/EventLog/EventLogToolbar';
import { PageHeader } from '../../../components/PageHeader';
import Config from '../../../config/Config';
import { Schemas } from '../../../generated/OpenapiIntegrations';
import { usePage } from '../../../hooks/usePage';
import { Messages } from '../../../properties/Messages';
import { useGetEvents } from '../../../services/EventLog/GetNotificationEvents';
import { getEndpointAction } from '../../../services/Integrations/GetEndpoint';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { EventPeriod } from '../../../types/Event';
import { UUID } from '../../../types/Notification';
import { useEventLogFilter } from '../EventLog/useEventLogFilter';
import { useFilterBuilder } from '../EventLog/useFilterBuilder';
import { Direction, Sort } from '../../../utils/insights-common-typescript';

const RETENTION_DAYS = 14;

export const NotificationsLogPage: React.FunctionComponent = () => {
  const isEventLogSeverityEnabled = useFlag('platform.notifications.severity');
  const getEndpoint = useParameterizedQuery(getEndpointAction);

  const getBundles = useGetBundles(true);
  const bundles = React.useMemo(() => {
    const payload = getBundles.payload;
    if (payload?.status === 200) {
      return payload.value;
    }

    return [];
  }, [getBundles.payload]);

  const [dateFilter, setDateFilter] = React.useState<EventLogDateFilterValue>(
    EventLogDateFilterValue.LAST_14
  );

  const eventLogFilters = useEventLogFilter();

  const [period, setPeriod] = React.useState<EventPeriod>([undefined, undefined]);

  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [sortColumn, setSortColumn] = React.useState<EventLogTableColumns>(
    EventLogTableColumns.DATE
  );

  const onSort = React.useCallback(
    (column: EventLogTableColumns, direction: SortDirection) => {
      setSortDirection(direction);
      setSortColumn(column);
    },
    [setSortDirection, setSortColumn]
  );

  const filterBuilder = useFilterBuilder(bundles, dateFilter, period);

  const sort: Sort = React.useMemo(() => {
    const direction = sortDirection.toUpperCase() as Direction;
    let column: string;
    switch (sortColumn) {
      case EventLogTableColumns.DATE:
        column = 'created';
        break;
      default:
        column = 'created';
        break;
    }

    return Sort.by(column, direction);
  }, [sortColumn, sortDirection]);

  const eventsPage = usePage<EventLogFilters>(
    Config.paging.defaultPerPage,
    filterBuilder,
    eventLogFilters.filters,
    sort
  );
  const eventsQuery = useGetEvents(eventsPage.page);

  const events = React.useMemo(() => {
    if (eventsQuery.payload?.status === 200) {
      const allData = eventsQuery.payload.value.data;
      const withActions = allData.filter((e) => e.actions.length > 0);
      return {
        data: withActions,
        count: eventsQuery.payload.value.meta.count,
      };
    }

    return {
      data: [],
      count: 0,
    };
  }, [eventsQuery]);

  const getIntegrationRecipient = React.useCallback(
    async (id: UUID) => {
      const query = getEndpoint.query;
      const endpoint = await query(id);
      if (endpoint.payload?.type === 'Endpoint') {
        const type = endpoint.payload.value.type;
        switch (type) {
          case 'camel':
          case 'webhook':
          case 'ansible':
          case 'pagerduty':
            return endpoint.payload.value.name;
          case 'email_subscription':
          case 'drawer': {
            const properties = endpoint.payload.value
              .properties as Schemas.SystemSubscriptionProperties;
            if (properties.only_admins) {
              return 'Users: Admin';
            }

            return 'Users: All';
          }
          default:
            assertNever(type);
        }
      }

      return 'Error while loading';
    },
    [getEndpoint.query]
  );

  return (
    <>
      <PageHeader
        title={Messages.pages.notifications.notificationsLog.title}
        subtitle={Messages.pages.notifications.notificationsLog.subtitle}
      />
      <EventLogToolbar
        {...eventLogFilters}
        bundleOptions={bundles}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        count={events.count}
        perPageChanged={eventsPage.changeItemsPerPage}
        pageChanged={eventsPage.changePage}
        perPage={eventsPage.page.size}
        page={eventsPage.page.index}
        pageCount={events.data.length}
        retentionDays={RETENTION_DAYS}
        period={period}
        setPeriod={setPeriod}
      >
        <EventLogTable
          events={events.data}
          loading={eventsQuery.loading}
          showSeverity={isEventLogSeverityEnabled}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          getIntegrationRecipient={getIntegrationRecipient}
          actionColumnHeader="Type"
        />
      </EventLogToolbar>
    </>
  );
};
