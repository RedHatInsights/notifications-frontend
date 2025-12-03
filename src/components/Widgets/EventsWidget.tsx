import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Pagination,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import {
  DataView,
  DataViewToolbar,
  useDataViewPagination,
} from '@patternfly/react-data-view';
import {
  DataViewTable,
  DataViewTh,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import {
  SkeletonTableBody,
  SkeletonTableHead,
} from '@patternfly/react-component-groups';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { useIntl } from 'react-intl';
import messages from '../../properties/DefinedMessages';
import { perPageOptions } from '../../config/Config';

import './EventsWidget.scss';

export type Notification = {
  id: string;
  event_type: string;
  description: string;
  read: boolean;
  application: string;
  bundle: string;
  created: string;
};

const EmptyStateBellIcon: React.FunctionComponent = () => (
  <svg
    height="1em"
    className="pf-c-empty-state__icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M439.4 362.3c-19.3-20.8-55.5-52-55.5-154.3 0-77.7-54.5-139.9-127.9-155.2V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v20.8C118.6 68.1 64.1 130.3 64.1 208c0 102.3-36.2 133.5-55.5 154.3-6 6.5-8.7 14.2-8.6 21.7 .1 16.4 13 32 32.1 32h383.8c19.1 0 32-15.6 32.1-32 .1-7.6-2.6-15.3-8.6-21.7zM67.5 368c21.2-28 44.4-74.3 44.5-159.4 0-.2-.1-.4-.1-.6 0-61.9 50.1-112 112-112s112 50.1 112 112c0 .2-.1 .4-.1 .6 .1 85.1 23.3 131.5 44.5 159.4H67.5zM224 512c35.3 0 64-28.7 64-64H160c0 35.4 28.7 64 64 64z" />
  </svg>
);

const EventsWidget: React.FunctionComponent = () => {
  const intl = useIntl();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { page, perPage, onSetPage, onPerPageSelect } = useDataViewPagination({
    perPage: 10,
  });

  const fetchNotifications = useCallback(
    async (currentPage: number, currentPerPage: number) => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * currentPerPage;
        const response = await fetch(
          `/api/notifications/v1.0/notifications/events?limit=${currentPerPage}&offset=${offset}`
        );
        const result = await response.json();
        setNotifications(result.data || []);
        setTotalCount(result.meta?.count || result.data?.length || 0);
      } catch (error) {
        console.error('Unable to get Notifications ', error);
        setNotifications([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotifications(page, perPage);
  }, [fetchNotifications, page, perPage]);

  const emptyState = useMemo(
    () => (
      <EmptyState
        titleText={
          <Title headingLevel="h4" size="lg">
            {intl.formatMessage(messages.noFiredEventsTitle)}
          </Title>
        }
        icon={EmptyStateBellIcon}
        variant={EmptyStateVariant.full}
      >
        <EmptyStateBody>
          <Stack>
            <StackItem>
              {intl.formatMessage(messages.noFiredEventsDescription)}
            </StackItem>
          </Stack>
        </EmptyStateBody>
        <Button
          component="a"
          variant={ButtonVariant.secondary}
          className="pf-v5-u-mt-lg"
          href="settings/notifications"
        >
          {intl.formatMessage(messages.manageEvents)}
        </Button>
      </EmptyState>
    ),
    [intl]
  );

  const columns: DataViewTh[] = useMemo(
    () => [
      intl.formatMessage(messages.event),
      intl.formatMessage(messages.service),
      intl.formatMessage(messages.date),
    ],
    [intl]
  );

  const rows = useMemo(
    () =>
      notifications.map((event) => [
        event.event_type,
        `${event.application} - ${event.bundle}`,
        <DateFormat key={event.id} date={event.created} />,
      ]),
    [notifications]
  );

  const loadingStateHeader = useMemo(
    () => <SkeletonTableHead columns={columns} />,
    [columns]
  );

  const loadingStateBody = useMemo(
    () => <SkeletonTableBody rowsCount={perPage} columnsCount={3} />,
    [perPage]
  );

  return (
    <DataView
      activeState={
        loading ? 'loading' : notifications.length === 0 ? 'empty' : undefined
      }
    >
      <DataViewTable
        aria-label="Events widget table"
        variant="compact"
        columns={columns}
        rows={rows}
        headStates={{ loading: loadingStateHeader }}
        bodyStates={{
          loading: loadingStateBody,
          empty: emptyState,
        }}
      />
      <DataViewToolbar
        ouiaId="EventsWidgetFooter"
        aria-label="Events widget footer"
        className="pf-v5-u-mt-sm"
        pagination={
          <Pagination
            aria-label="Events widget footer pagination"
            perPageOptions={perPageOptions}
            itemCount={totalCount}
            page={page}
            perPage={perPage}
            onSetPage={onSetPage}
            onPerPageSelect={onPerPageSelect}
          />
        }
      />
    </DataView>
  );
};

export default EventsWidget;
