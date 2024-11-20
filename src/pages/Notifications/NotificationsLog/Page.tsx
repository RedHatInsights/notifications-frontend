import { Card } from '@patternfly/react-core';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  Filter,
  Operator,
  toUtc,
} from '@redhat-cloud-services/insights-common-typescript';
import { format, sub, toDate } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { NotificationsLogDateFilterValue } from '../../../components/Notifications/NotificationsLog/NotificationsLogDateFilter';
import NotificationsLogTable, {
  DrawerType,
  PaginationType,
} from '../../../components/Notifications/NotificationsLog/NotificationsLogTable';
import NotificationsLogToolbar from '../../../components/Notifications/NotificationsLog/NotificationsLogToolbar';
import { PageHeader } from '../../../components/PageHeader';
import { Messages } from '../../../properties/Messages';

export type NotificationsPeriod = [Date | undefined, Date | undefined];

const sortMapper = {
  0: 'title',
  2: 'created',
};

const RETENTION_DAYS = 14;

const filterPeriodMapper = (dateFilter) => {
  const today = toUtc(new Date());
  const yesterday = sub(toDate(today), {
    days: 1,
  });
  return {
    [NotificationsLogDateFilterValue.LAST_14]: [
      sub(toDate(today), {
        days: 14,
      }),
      today,
    ],
    [NotificationsLogDateFilterValue.LAST_7]: [
      sub(toDate(today), {
        days: 7,
      }),
      today,
    ],
    [NotificationsLogDateFilterValue.TODAY]: [today, today],
    [NotificationsLogDateFilterValue.YESTERDAY]: [yesterday, yesterday],
  }[dateFilter];
};

const createFilter = (dateFilter, period) => {
  const filterPeriod = [undefined, undefined] as [
    Date | undefined,
    Date | undefined
  ];
  const DATE_FORMAT = 'yyyy-MM-dd';
  const filter = new Filter();

  filterPeriodMapper(dateFilter) || period;

  if (filterPeriod[0] && filterPeriod[1]) {
    filter.and('start', Operator.EQUAL, format(filterPeriod[0], DATE_FORMAT));
    filter.and('end', Operator.EQUAL, format(filterPeriod[1], DATE_FORMAT));
  }

  return {
    startDate: filterPeriod[0]
      ? format(filterPeriod[0], DATE_FORMAT)
      : undefined,
    endDate: filterPeriod[1] ? format(filterPeriod[1], DATE_FORMAT) : undefined,
  };
};

export const NotificationsLogPage: React.FunctionComponent = () => {
  const [data, setData] = useState<DrawerType>([]);
  const [period, setPeriod] = useState<NotificationsPeriod>([
    undefined,
    undefined,
  ]);
  const [dateFilter, setDateFilter] = useState<NotificationsLogDateFilterValue>(
    NotificationsLogDateFilterValue.LAST_14
  );
  const [pagination, setPagination] = useState<PaginationType>({
    offset: 0,
    limit: 20,
    count: 0,
  });
  const [sort, setSort] = useState<{
    columnIndex: number;
    direction: 'asc' | 'desc';
  }>({
    columnIndex: 2,
    direction: 'desc',
  });

  const filterBuilder = useMemo(
    () => createFilter(dateFilter, period),
    [dateFilter, period[0]?.toString(), period[1]?.toString()] // eslint-disable-line react-hooks/exhaustive-deps
  );

  //TODO: use new JS client instead of directly calling fetch
  const callApi = useCallback((pagination, sort, filterBuilder) => {
    const search = new URLSearchParams({
      offset: `${pagination.offset}`,
      limit: `${pagination.limit}`,
      sort_by: `${sortMapper[sort.columnIndex]}:${sort.direction}`,
    });

    if (filterBuilder.startDate) {
      search.append('startDate', filterBuilder.startDate + 'T00:00:00');
    }

    if (filterBuilder.endDate) {
      search.append('endDate', filterBuilder.endDate + 'T23:59:59');
    }

    fetch(`/api/notifications/v1/notifications/drawer?${search.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then((response) => {
        setData(response.data);
        setPagination((prevState) => ({
          ...prevState,
          count: response.meta.count,
        }));
      })
      .catch((error) => {
        console.error('Error while fetching data: ', error);
      });
  }, []);

  useEffect(() => {
    callApi(pagination, sort, filterBuilder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, period[0]?.toString(), period[1]?.toString()]);

  return (
    <React.Fragment>
      <PageHeader
        title={Messages.pages.notifications.notificationsLog.title}
        subtitle={Messages.pages.notifications.notificationsLog.subtitle}
      />
      <Main>
        <Card>
          <NotificationsLogToolbar
            pagination={pagination}
            onPagination={({ limit, offset }) => {
              setPagination((prevState) => ({ ...prevState, offset, limit }));
              callApi({ limit, offset }, sort, filterBuilder);
            }}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            retentionDays={RETENTION_DAYS}
            period={period}
            setPeriod={setPeriod}
          />
          <NotificationsLogTable
            isEmptyState={data.length === 0}
            sort={sort}
            onSort={(index, direction) => {
              setSort({
                columnIndex: index,
                direction,
              });
              callApi(
                pagination,
                {
                  columnIndex: index,
                  direction,
                },
                filterBuilder
              );
            }}
            drawer={data}
            pagination={pagination}
            onPagination={({ limit, offset }) => {
              setPagination((prevState) => ({ ...prevState, offset, limit }));
              callApi({ limit, offset }, sort, filterBuilder);
            }}
          />
        </Card>
      </Main>
    </React.Fragment>
  );
};
