import { Skeleton, Tooltip } from '@patternfly/react-core';
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
import { useAsync } from 'react-use';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import {
  NotificationEventAction,
  NotificationEventStatus,
} from '../../../types/Event';
import {
  GetIntegrationRecipient,
  IntegrationType,
} from '../../../types/Integration';
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
  getIntegrationRecipient: GetIntegrationRecipient;
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

const succeeded = (action: NotificationEventAction) => {
  if (action.endpointType === IntegrationType.EMAIL_SUBSCRIPTION) {
    return 'emails sent';
  }

  return 'succeeded';
};

const failed = (action: NotificationEventAction) => {
  if (action.endpointType === IntegrationType.EMAIL_SUBSCRIPTION) {
    return 'emails failed';
  }

  return 'failed';
};

export const EventLogActionPopoverContent: React.FunctionComponent<
  EventLogActionPopoverContentProps
> = (props) => {
  const {
    action: { id },
    getIntegrationRecipient,
  } = props;
  const recipient = useAsync(
    async () => id && getIntegrationRecipient(id),
    [id, getIntegrationRecipient]
  );

  return (
    <TableComposable
      borders={false}
      variant={TableVariant.compact}
      isStickyHeader={true}
    >
      <Thead>
        <Tr>
          <Th className={headerClass}>Action</Th>
          <Th className={headerClass}>Recipient</Th>
          <Th className={headerClass}>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{Config.integrations.types[props.action.endpointType].action}</Td>
          <Td>
            {id ? (
              recipient.loading ? (
                <Skeleton width="150px" />
              ) : (
                recipient.value
              )
            ) : (
              <Tooltip content="The integration no longer exists, it could have been deleted.">
                <span>Unknown integration</span>
              </Tooltip>
            )}
          </Td>
          <Td>
            <div>{toDisplayStatus(props.action.status)}</div>
            {props.action.successCount > 1 && (
              <div className="pf-v5-u-color-300">
                {props.action.successCount} {succeeded(props.action)}{' '}
              </div>
            )}
            {props.action.errorCount > 1 && (
              <div className="pf-v5-u-color-300">
                {props.action.errorCount} {failed(props.action)}{' '}
              </div>
            )}
          </Td>
        </Tr>
      </Tbody>
    </TableComposable>
  );
};
