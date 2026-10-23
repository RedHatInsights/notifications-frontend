import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { TableHelpPopover } from '../../TableHelpPopover/TableHelpPopover';
import {
  NotificationStatusFailed,
  NotificationStatusProcessing,
  NotificationStatusSent,
  NotificationStatusSuccess,
  NotificationStatusWarning,
} from '../NotificationStatus';

const messages = defineMessages({
  title: {
    id: 'eventLog.actionsHelp.title',
    defaultMessage: 'Action status meaning',
  },
});

const tableData: ReadonlyArray<[React.ReactNode, React.ReactNode]> = [
  [
    <NotificationStatusSuccess key="status-success" />,
    'The notification was executed successfully',
  ],
  [
    <NotificationStatusSent key="status-sent" />,
    'The notification was sent for processing - but there is no way to assert if it was executed successfully',
  ],
  [
    <NotificationStatusWarning key="status-warning" />,
    'The notification was executed successfully after some retries',
  ],
  [
    <NotificationStatusProcessing key="status-processing" />,
    'The notification was sent for processing and is awaiting an outcome result',
  ],
  [
    <NotificationStatusFailed key="status-failed-externally" />,
    'An unexpected error occurred while processing the notification',
  ],
];

export const ActionsHelpPopover: React.FunctionComponent<React.PropsWithChildren> = (props) => {
  const intl = useIntl();
  return (
    <TableHelpPopover title={intl.formatMessage(messages.title)} tableBody={tableData}>
      <>{props.children}</>
    </TableHelpPopover>
  );
};
