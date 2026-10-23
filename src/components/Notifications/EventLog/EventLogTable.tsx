import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Skeleton } from '@patternfly/react-core/dist/dynamic/components/Skeleton';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Button, ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  Label,
  LabelGroup,
  LabelProps,
} from '@patternfly/react-core/dist/dynamic/components/Label';
import { HelpIcon, InProgressIcon, UnknownIcon } from '@patternfly/react-icons';
import {
  IExtraColumnData,
  SortByDirection,
  Table as TableComposable,
  Tbody,
  Td,
  Th,
  ThProps,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import assertNever from 'assert-never';
import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';
import { NotificationEvent, NotificationEventStatus } from '../../../types/Event';
import {
  hasDisplayableSeverity,
  severityDescription,
  severityDisplayName,
  toSeverityLabelProps,
} from '../../../utils/severityUtils';
import { EmptyStateSearch } from '../../EmptyStateSearch';
import { ActionsHelpPopover } from './ActionsHelpPopover';
import { EventLogActionPopoverContent } from './EventLogActionPopoverContent';

const messages = defineMessages({
  eventType: {
    id: 'eventLog.table.eventType',
    defaultMessage: 'Event type',
  },
  service: {
    id: 'eventLog.table.service',
    defaultMessage: 'Service',
  },
  severity: {
    id: 'eventLog.table.severity',
    defaultMessage: 'Severity',
  },
  actionTaken: {
    id: 'eventLog.table.actionTaken',
    defaultMessage: 'Action taken',
  },
  dateAndTime: {
    id: 'eventLog.table.dateAndTime',
    defaultMessage: 'Date and time',
  },
  noActions: {
    id: 'eventLog.table.noActions',
    defaultMessage: 'No actions',
  },
  applicationBundle: {
    id: 'eventLog.table.applicationBundle',
    defaultMessage: '{application} - {bundle}',
  },
});

export type SortDirection = 'asc' | 'desc';

export interface EventLogTableProps {
  events: ReadonlyArray<NotificationEvent>;
  loading: boolean;
  showSeverity: boolean;
  onSort: (column: EventLogTableColumns, direction: SortDirection) => void;
  sortColumn: EventLogTableColumns;
  sortDirection: SortDirection;
}

export enum EventLogTableColumns {
  EVENT,
  SEVERITY,
  SERVICE,
  DATE,
}

const labelClassName = style({
  cursor: 'pointer',
});

// Re-export severity utilities from shared module for backward compatibility
export {
  eventLogSeverityLabelStyles,
  toSeverityLabelProps,
  severityDisplayName,
  severityDescription,
} from '../../../utils/severityUtils';

export const toLabelProps = (
  actionStatus: NotificationEventStatus
): Pick<LabelProps, 'status' | 'color' | 'icon'> => {
  switch (actionStatus.last) {
    case 'FAILED':
      return {
        status: 'danger',
      };
    case 'SENT':
    case 'SUCCESS':
      if (actionStatus.isDegraded) {
        return {
          status: 'warning',
        };
      }

      return {
        status: 'success',
      };
    case 'PROCESSING':
      return {
        color: 'grey',
        icon: <InProgressIcon />,
      };
    case 'UNKNOWN':
      return {
        color: 'grey',
        icon: <UnknownIcon />,
      };
    default:
      assertNever(actionStatus.last);
  }
};

export const EventLogTable: React.FunctionComponent<EventLogTableProps> = (props) => {
  const intl = useIntl();

  const onSort = React.useCallback(
    (
      _event: React.MouseEvent,
      columnIndex: number,
      sortByDirection: SortByDirection,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _extraData: IExtraColumnData
    ) => {
      const externalOnSort = props.onSort;
      externalOnSort(columnIndex, sortByDirection);
    },
    [props.onSort]
  );

  const sortOptions: Record<EventLogTableColumns, undefined | ThProps['sort']> = React.useMemo(
    () => ({
      [EventLogTableColumns.EVENT]: undefined,
      [EventLogTableColumns.SEVERITY]: undefined,
      [EventLogTableColumns.SERVICE]: undefined,
      [EventLogTableColumns.DATE]: {
        sortBy: {
          direction: props.sortDirection,
          index: props.sortColumn,
        },
        columnIndex: EventLogTableColumns.DATE,
        onSort,
      },
    }),
    [props.sortColumn, props.sortDirection, onSort]
  );

  const rows = React.useMemo(() => {
    const events = props.events;
    const { showSeverity } = props;
    if (props.loading) {
      return [...Array(10)].map((_, i) => (
        <Tr key={`loading-row-${i}`}>
          <Td>
            <Skeleton />
          </Td>
          <Td>
            <Skeleton />
          </Td>
          {showSeverity && (
            <Td>
              <Skeleton />
            </Td>
          )}
          <Td>
            <Skeleton />
          </Td>
          <Td>
            <Skeleton />
          </Td>
        </Tr>
      ));
    } else {
      return events.map((e) => (
        <Tr key={e.id}>
          <Td>{e.event}</Td>
          <Td>
            <FormattedMessage
              {...messages.applicationBundle}
              values={{ application: e.application, bundle: e.bundle }}
            />
          </Td>
          {showSeverity && (
            <Td>
              {hasDisplayableSeverity(e.severity) ? (
                <Tooltip content={severityDescription[e.severity]}>
                  <Label {...toSeverityLabelProps(e.severity)}>
                    {severityDisplayName[e.severity] ?? e.severity}
                  </Label>
                </Tooltip>
              ) : null}
            </Td>
          )}
          <Td>
            {e.actions.length > 0 ? (
              <LabelGroup>
                {e.actions.map((a) => (
                  <Popover
                    key={a.id}
                    hasAutoWidth
                    bodyContent={<EventLogActionPopoverContent action={a} />}
                  >
                    <Label className={labelClassName} variant="outline" {...toLabelProps(a.status)}>
                      {Config.integrations.types[a.endpointType].action}
                    </Label>
                  </Popover>
                ))}
              </LabelGroup>
            ) : (
              intl.formatMessage(messages.noActions)
            )}
          </Td>
          <Td>
            <DateFormat type="exact" date={e.date} />
          </Td>
        </Tr>
      ));
    }
  }, [props, intl]);

  if (rows.length === 0) {
    return (
      <EmptyStateSearch
        variant={EmptyStateVariant.full}
        title={Messages.components.eventLog.table.notFound.title}
        description={Messages.components.eventLog.table.notFound.description}
      />
    );
  }

  return (
    <TableComposable isStickyHeader={true}>
      <Thead>
        <Tr>
          <Th sort={sortOptions[EventLogTableColumns.EVENT]}>
            {intl.formatMessage(messages.eventType)}
          </Th>
          <Th sort={sortOptions[EventLogTableColumns.SERVICE]}>
            {intl.formatMessage(messages.service)}
          </Th>
          {props.showSeverity && (
            <Th sort={sortOptions[EventLogTableColumns.SEVERITY]}>
              {intl.formatMessage(messages.severity)}
            </Th>
          )}
          <Th>
            {intl.formatMessage(messages.actionTaken)}{' '}
            <ActionsHelpPopover>
              <Button icon={<HelpIcon />} variant={ButtonVariant.plain} />
            </ActionsHelpPopover>
          </Th>
          <Th sort={sortOptions[EventLogTableColumns.DATE]}>
            {intl.formatMessage(messages.dateAndTime)}
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </TableComposable>
  );
};
