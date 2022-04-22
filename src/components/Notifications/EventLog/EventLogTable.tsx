import { EmptyStateVariant, Label, LabelGroup, LabelProps, Popover, Skeleton } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { IExtraColumnData, SortByDirection, TableComposable, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { c_alert_m_warning__icon_Color } from '@patternfly/react-tokens';
import assertNever from 'assert-never';
import * as React from 'react';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';
import { NotificationEvent, NotificationEventStatus } from '../../../types/Event';
import { GetIntegrationRecipient } from '../../../types/Integration';
import { EmptyStateSearch } from '../../EmptyStateSearch';
import { UtcDate } from '../../UtcDate';
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
    APPLICATION,
    DATE
}

const labelClassName = style({
    cursor: 'pointer'
});

export const toLabelProps = (actionStatus: NotificationEventStatus): Pick<LabelProps, 'color' | 'icon'> => {
    switch (actionStatus) {
        case NotificationEventStatus.SUCCESS:
            return {
                color: 'green',
                icon: <CheckCircleIcon />
            };
        case NotificationEventStatus.ERROR:
            return {
                color: 'red',
                icon: <ExclamationCircleIcon />
            };
        case NotificationEventStatus.WARNING:
            return {
                color: undefined,
                icon: <ExclamationTriangleIcon color={ c_alert_m_warning__icon_Color.value } />
            };
        default:
            assertNever(actionStatus);
    }
};

export const EventLogTable: React.FunctionComponent<EventLogTableProps> = props => {
    const onSort = React.useCallback((
        _event: React.MouseEvent,
        columnIndex: number,
        sortByDirection: SortByDirection,
        _extraData: IExtraColumnData) => {
        const externalOnSort = props.onSort;
        externalOnSort(columnIndex, sortByDirection);
    }, [ props.onSort ]);

    const sortOptions: Record<EventLogTableColumns, undefined | ThProps['sort']> = React.useMemo(() => ({
        [EventLogTableColumns.EVENT]: undefined,
        [EventLogTableColumns.APPLICATION]: undefined,
        [EventLogTableColumns.DATE]: {
            sortBy: {
                direction: props.sortDirection,
                index: props.sortColumn
            },
            columnIndex: EventLogTableColumns.DATE,
            onSort
        }
    }), [ props.sortColumn, props.sortDirection, onSort ]);

    const rows = React.useMemo(() => {
        const events = props.events;
        if (props.loading) {
            return (
                [ ...Array(10) ].map((_, i) => (
                    <Tr key={ `loading-row-${i}` }>
                        <Td><Skeleton /></Td>
                        <Td><Skeleton /></Td>
                        <Td><Skeleton /></Td>
                        <Td><Skeleton /></Td>
                    </Tr>
                ))
            );
        } else {
            return events.map(e => (
                <Tr key={ e.id }>
                    <Td>{ e.event }</Td>
                    <Td>{ e.application } - { e.bundle }</Td>
                    <Td>
                        { e.actions.length > 0 ? (
                            <LabelGroup>
                                { e.actions.map(a => (<Popover
                                    key={ a.id }
                                    hasAutoWidth
                                    bodyContent={ <EventLogActionPopoverContent
                                        action={ a }
                                        getIntegrationRecipient={ props.getIntegrationRecipient }
                                    /> }
                                >
                                    <Label
                                        className={ labelClassName }
                                        { ...toLabelProps(a.status) }
                                    >
                                        { Config.integrations.types[a.endpointType].action }
                                    </Label>
                                </Popover>))}
                            </LabelGroup>
                        ) : ('No actions')}

                    </Td>
                    <Td><UtcDate date={ e.date } /></Td>
                </Tr>
            ));
        }
    }, [ props.loading, props.events, props.getIntegrationRecipient ]);

    if (rows.length === 0) {
        return (
            <EmptyStateSearch
                variant={ EmptyStateVariant.full }
                title={ Messages.components.eventLog.table.notFound.title }
                description={ Messages.components.eventLog.table.notFound.description }
            />
        );
    }

    return (
        <TableComposable
            isStickyHeader={ true }
        >
            <Thead>
                <Tr>
                    <Th
                        sort={ sortOptions[EventLogTableColumns.EVENT] }
                    >
                        Event
                    </Th>
                    <Th
                        sort={ sortOptions[EventLogTableColumns.APPLICATION] }
                    >
                        Application
                    </Th>
                    <Th>
                        Actions
                    </Th>
                    <Th
                        sort={ sortOptions[EventLogTableColumns.DATE] }
                    >
                        Date and time
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                { rows }
            </Tbody>
        </TableComposable>
    );
};
