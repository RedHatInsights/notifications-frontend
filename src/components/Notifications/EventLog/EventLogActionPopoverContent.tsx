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
  return (
    <TableComposable borders={false} variant={TableVariant.compact} isStickyHeader={true}>
      <Thead>
        <Tr>
          <Th className={headerClass}>Action</Th>
          <Th className={headerClass}>Recipients</Th>
          <Th className={headerClass}>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{Config.integrations.types[props.action.endpointType].action}</Td>
          <Td>{props.action.recipientsCount !== undefined ? props.action.recipientsCount : '-'}</Td>
          <Td>
            <div>{toDisplayStatus(props.action.status)}</div>
            {props.action.errorCount > 1 && (
              <div className="pf-v6-u-text-color-subtle">{props.action.errorCount} failed</div>
            )}
          </Td>
        </Tr>
      </Tbody>
    </TableComposable>
  );
};
