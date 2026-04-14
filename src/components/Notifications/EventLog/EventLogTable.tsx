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
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  HelpIcon,
  InProgressIcon,
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
  SeverityUndefinedIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
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
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';
import { EventSeverity, NotificationEvent, NotificationEventStatus } from '../../../types/Event';
import { GetIntegrationRecipient } from '../../../types/Integration';
import { EmptyStateSearch } from '../../EmptyStateSearch';
import { ActionsHelpPopover } from './ActionsHelpPopover';
import { EventLogActionPopoverContent } from './EventLogActionPopoverContent';

export type SortDirection = 'asc' | 'desc';

export interface EventLogTableProps {
  events: ReadonlyArray<NotificationEvent>;
  loading: boolean;
  onSort: (column: EventLogTableColumns, direction: SortDirection) => void;
  sortColumn: EventLogTableColumns;
  sortDirection: SortDirection;
  getIntegrationRecipient: GetIntegrationRecipient;
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

/**
 * Filled label backgrounds use PatternFly global **severity** surface tokens
 * (`--pf-t--global--color--severity--*-100`), aligned with the severity palette in
 * https://www.patternfly.org/patterns/status-and-severity/#severity-icons
 *
 * Variables are set via inline `style` on `Label` so they are not overridden by
 * PatternFly stylesheet order (a prior class-only approach left all chips grey).
 *
 * Foreground uses white/black for contrast. Icons are severity-shaped, not status icons.
 */
const severityLabelFgOnDark = 'var(--pf-t--color--white)';
const severityLabelFgOnLight = 'var(--pf-t--color--black)';

/** Inline Label `style` so PF label CSS does not override single-class typestyle rules (load order). */
const severityLabelVars = (vars: Record<string, string>): React.CSSProperties =>
  vars as React.CSSProperties;

export const eventLogSeverityLabelStyles: Record<EventSeverity, React.CSSProperties> = {
  CRITICAL: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--critical--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  IMPORTANT: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--important--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  MODERATE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--moderate--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
  LOW: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--minor--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
  NONE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--none--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  UNDEFINED: severityLabelVars({
    '--pf-v6-c-label--BorderColor': 'var(--pf-t--global--color--severity--undefined--200)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
};

export const toSeverityLabelProps = (
  severity?: EventSeverity
): Pick<LabelProps, 'color' | 'icon' | 'style' | 'status' | 'variant'> => {
  switch (severity) {
    case 'CRITICAL':
      return {
        style: eventLogSeverityLabelStyles.CRITICAL,
        icon: <SeverityCriticalIcon />,
      };
    case 'IMPORTANT':
      return {
        style: eventLogSeverityLabelStyles.IMPORTANT,
        icon: <SeverityImportantIcon />,
      };
    case 'MODERATE':
      return {
        style: eventLogSeverityLabelStyles.MODERATE,
        icon: <SeverityModerateIcon />,
      };
    case 'LOW':
      return {
        style: eventLogSeverityLabelStyles.LOW,
        icon: <SeverityMinorIcon />,
      };
    case 'NONE':
      return {
        style: eventLogSeverityLabelStyles.NONE,
        icon: <SeverityNoneIcon />,
      };
    case 'UNDEFINED':
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        color: 'grey',
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
    case undefined:
    default:
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        color: 'grey',
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
  }
};

const severityDisplayName: Record<EventSeverity, string> = {
  CRITICAL: 'Critical',
  IMPORTANT: 'Important',
  MODERATE: 'Moderate',
  LOW: 'Low',
  NONE: 'None',
  UNDEFINED: 'Undefined',
};

export const severityDescription: Record<EventSeverity, string> = {
  CRITICAL: 'Urgent notification about an event with impact to your systems',
  IMPORTANT: 'Errors or other events that may impact your systems',
  MODERATE: 'Warning',
  LOW: 'Information only',
  NONE: 'Debug or informative updates',
  UNDEFINED: 'Severity level has not been defined for this event',
};

export const toLabelProps = (
  actionStatus: NotificationEventStatus
): Pick<LabelProps, 'color' | 'icon'> => {
  switch (actionStatus.last) {
    case 'FAILED':
      return {
        color: 'red',
        icon: <ExclamationCircleIcon />,
      };
    case 'SENT':
    case 'SUCCESS':
      if (actionStatus.isDegraded) {
        return {
          color: 'orange',
          icon: <ExclamationTriangleIcon />,
        };
      }

      return {
        color: 'green',
        icon: <CheckCircleIcon />,
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
    if (props.loading) {
      return [...Array(10)].map((_, i) => (
        <Tr key={`loading-row-${i}`}>
          <Td>
            <Skeleton />
          </Td>
          <Td>
            <Skeleton />
          </Td>
          <Td>
            <Skeleton />
          </Td>
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
            {e.application} - {e.bundle}
          </Td>
          <Td>
            {e.severity ? (
              <Tooltip content={severityDescription[e.severity]}>
                <Label {...toSeverityLabelProps(e.severity)}>
                  {severityDisplayName[e.severity] ?? e.severity}
                </Label>
              </Tooltip>
            ) : (
              <Tooltip content={severityDescription.UNDEFINED}>
                <Label {...toSeverityLabelProps(undefined)}>{'— Undefined'}</Label>
              </Tooltip>
            )}
          </Td>
          <Td>
            {e.actions.length > 0 ? (
              <LabelGroup>
                {e.actions.map((a) => (
                  <Popover
                    key={a.id}
                    hasAutoWidth
                    bodyContent={
                      <EventLogActionPopoverContent
                        action={a}
                        getIntegrationRecipient={props.getIntegrationRecipient}
                      />
                    }
                  >
                    <Label className={labelClassName} {...toLabelProps(a.status)}>
                      {Config.integrations.types[a.endpointType].action}
                    </Label>
                  </Popover>
                ))}
              </LabelGroup>
            ) : (
              'No actions'
            )}
          </Td>
          <Td>
            <DateFormat type="exact" date={e.date} />
          </Td>
        </Tr>
      ));
    }
  }, [props.loading, props.events, props.getIntegrationRecipient]);

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
          <Th sort={sortOptions[EventLogTableColumns.EVENT]}>Event type</Th>
          <Th sort={sortOptions[EventLogTableColumns.SERVICE]}>Service</Th>
          <Th sort={sortOptions[EventLogTableColumns.SEVERITY]}>Severity</Th>
          <Th>
            Action taken{' '}
            <ActionsHelpPopover>
              <Button icon={<HelpIcon />} variant={ButtonVariant.plain} />
            </ActionsHelpPopover>
          </Th>
          <Th sort={sortOptions[EventLogTableColumns.DATE]}>Date and time</Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </TableComposable>
  );
};
