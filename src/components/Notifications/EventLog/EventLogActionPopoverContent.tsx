import {
  Table as TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import assertNever from 'assert-never';
import { important } from 'csx';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { NotificationEventAction, NotificationEventStatus } from '../../../types/Event';
import {
  NotificationStatusFailed,
  NotificationStatusProcessing,
  NotificationStatusSent,
  NotificationStatusSuccess,
  NotificationStatusUnknown,
  NotificationStatusWarning,
} from '../NotificationStatus';

const messages = defineMessages({
  action: {
    id: 'eventLog.actionPopover.action',
    defaultMessage: 'Action',
  },
  recipients: {
    id: 'eventLog.actionPopover.recipients',
    defaultMessage: 'Recipients',
  },
  status: {
    id: 'eventLog.actionPopover.status',
    defaultMessage: 'Status',
  },
  failedCount: {
    id: 'eventLog.actionPopover.failedCount',
    defaultMessage: '{count} failed',
  },
});

const NO_VALUE = '-';

const headerClass = style({
  minWidth: important('90px'),
});

interface EventLogActionPopoverContentProps {
  action: NotificationEventAction;
}

const toDisplayStatus = (status: NotificationEventStatus) => {
  switch (status.last) {
    case 'SUCCESS':
      if (status.isDegraded) {
        return <NotificationStatusWarning />;
      }

      return <NotificationStatusSuccess />;
    case 'SENT':
      return <NotificationStatusSent />;
    case 'PROCESSING':
      return <NotificationStatusProcessing />;
    case 'FAILED':
      return <NotificationStatusFailed />;
    case 'UNKNOWN':
      return <NotificationStatusUnknown />;
    default:
      assertNever(status.last);
  }
};

export const EventLogActionPopoverContent: React.FunctionComponent<
  EventLogActionPopoverContentProps
> = (props) => {
  const intl = useIntl();
  return (
    <TableComposable borders={false} variant={TableVariant.compact} isStickyHeader={true}>
      <Thead>
        <Tr>
          <Th className={headerClass}>{intl.formatMessage(messages.action)}</Th>
          <Th className={headerClass}>{intl.formatMessage(messages.recipients)}</Th>
          <Th className={headerClass}>{intl.formatMessage(messages.status)}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{Config.integrations.types[props.action.endpointType].action}</Td>
          <Td>
            {props.action.recipientsCount !== undefined ? props.action.recipientsCount : NO_VALUE}
          </Td>
          <Td>
            <div>{toDisplayStatus(props.action.status)}</div>
            {props.action.errorCount > 1 && (
              <div className="pf-v6-u-text-color-subtle">
                {intl.formatMessage(messages.failedCount, { count: props.action.errorCount })}
              </div>
            )}
          </Td>
        </Tr>
      </Tbody>
    </TableComposable>
  );
};
