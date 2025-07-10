import React, { useEffect, useState } from 'react';
import {
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { useIntl } from 'react-intl';
import messages from '../../properties/DefinedMessages';

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
  const MAX_ROWS = 5;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        '/api/notifications/v1.0/notifications/events?limit=5'
      );
      const { data } = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Unable to get Notifications ', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      {notifications.length === 0 ? (
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
            className="pf-v6-u-mt-lg"
            href="settings/notifications"
          >
            {intl.formatMessage(messages.manageEvents)}
          </Button>
        </EmptyState>
      ) : (
        <Table aria-label="Events widget table" variant={TableVariant.compact}>
          <Thead>
            <Tr>
              <Th>{intl.formatMessage(messages.event)}</Th>
              <Th>{intl.formatMessage(messages.service)}</Th>
              <Th>{intl.formatMessage(messages.date)}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notifications?.slice(0, MAX_ROWS).map((event) => (
              <Tr key={event.id}>
                <Td dataLabel={intl.formatMessage(messages.event)}>
                  {event.event_type}
                </Td>
                <Td dataLabel={intl.formatMessage(messages.service)}>
                  {event.application} - {event.bundle}
                </Td>
                <Td dataLabel={intl.formatMessage(messages.date)}>
                  <DateFormat date={event.created} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default EventsWidget;
