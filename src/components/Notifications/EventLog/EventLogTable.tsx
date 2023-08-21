import { Button, ButtonVariant, EmptyStateVariant, Label, LabelGroup, LabelProps, Popover, Skeleton } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, HelpIcon, InProgressIcon, UnknownIcon } from '@patternfly/react-icons';
import { IExtraColumnData, SortByDirection, TableComposable, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import assertNever from 'assert-never';
import * as React from 'react';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';
import { NotificationEvent, NotificationEventStatus } from '../../../types/Event';
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
    SERVICE,
    DATE
}

const labelClassName = style({
    cursor: 'pointer'
});

export const toLabelProps = (actionStatus: NotificationEventStatus): Pick<LabelProps, 'color' | 'icon'> => {
    switch (actionStatus.last) {
        case 'FAILED':
            return {
                color: 'red',
                icon: <ExclamationCircleIcon />
            };
        case 'SENT':
        case 'SUCCESS':
            if (actionStatus.isDegraded) {
                return {
                    color: 'orange',
                    icon: <ExclamationTriangleIcon />
                };
            }

            return {
                color: 'green',
                icon: <CheckCircleIcon />
            };
        case 'PROCESSING':
            return {
                color: 'grey',
                icon: <InProgressIcon />
            };
        case 'UNKNOWN':
            return {
                color: 'grey',
                icon: <UnknownIcon />
            };
        default:
            assertNever(actionStatus.last);
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
        [EventLogTableColumns.SERVICE]: undefined,
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
                    <Td><DateFormat type="exact" date={ e.date } /></Td>
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
                        Event type
                    </Th>
                    <Th
                        sort={ sortOptions[EventLogTableColumns.SERVICE] }
                    >
                        Service
                    </Th>
                    <Th>
                        Action taken <ActionsHelpPopover>
                            <Button variant={ ButtonVariant.plain }>
                                <HelpIcon />
                            </Button>
                        </ActionsHelpPopover>
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
