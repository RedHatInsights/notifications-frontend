import { Skeleton } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as React from 'react';

import { NotificationEvent } from '../../../types/Event';
import { UtcDate } from '../../UtcDate';

export interface EventLogTableProps {
    events: ReadonlyArray<NotificationEvent>;
    loading: boolean;
}

export const EventLogTable: React.FunctionComponent<EventLogTableProps> = props => {
    let rows;
    if (props.loading) {
        rows = (
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
        rows = props.events.map(e => (
            <Tr key={ e.id }>
                <Td>{ e.event }</Td>
                <Td>{ e.application }</Td>
                <Td>{ e.bundle }</Td>
                <Td><UtcDate date={ e.date } /></Td>
            </Tr>
        ));
    }

    return (
        <TableComposable>
            <Thead>
                <Tr>
                    <Th>Event</Th>
                    <Th>Application</Th>
                    <Th>Bundle</Th>
                    <Th>Date and time</Th>
                </Tr>
            </Thead>
            <Tbody>
                { rows }
            </Tbody>
        </TableComposable>
    );
};
