import { Skeleton } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { SortByDirection } from '@patternfly/react-table/src/components/Table/SortColumn';
import { IExtraColumnData } from '@patternfly/react-table/src/components/Table/TableTypes';
import * as React from 'react';

import { NotificationEvent } from '../../../types/Event';
import { UtcDate } from '../../UtcDate';

export type SortDirection = 'asc' | 'desc';

export interface EventLogTableProps {
    events: ReadonlyArray<NotificationEvent>;
    loading: boolean;
    onSort: (column: EventLogTableColumns, direction: SortDirection) => void;
    sortColumn: EventLogTableColumns;
    sortDirection: SortDirection;
}

export enum EventLogTableColumns {
    EVENT,
    APPLICATION,
    DATE
}

export const EventLogTable: React.FunctionComponent<EventLogTableProps> = props => {
    let rows;

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

    if (props.loading) {
        rows = (
            [ ...Array(10) ].map((_, i) => (
                <Tr key={ `loading-row-${i}` }>
                    <Td><Skeleton /></Td>
                    <Td><Skeleton /></Td>
                    <Td><Skeleton /></Td>
                </Tr>
            ))
        );
    } else {
        rows = props.events.map(e => (
            <Tr key={ e.id }>
                <Td>{ e.event }</Td>
                <Td>{ e.application } - { e.bundle }</Td>
                <Td><UtcDate date={ e.date } /></Td>
            </Tr>
        ));
    }

    return (
        <TableComposable>
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
