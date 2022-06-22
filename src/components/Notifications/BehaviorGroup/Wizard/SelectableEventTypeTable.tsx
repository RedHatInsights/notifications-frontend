import { Skeleton } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as React from 'react';

const skeletonRows = 10;

export interface SelectableEventTypeRow {
    id: string;
    eventType: string;
    application: string;
    isSelected: boolean;
}

interface SelectableEventTypeTableBaseProps {
    onSelect?: (isSelected: boolean, eventId: string) => void;
    selectionDisabled?: boolean;
}

interface SelectableEventTypeTableImplProps extends SelectableEventTypeTableBaseProps {
    events: ReadonlyArray<SelectableEventTypeRow>;
}

export interface SelectableEventTypeTableProps extends SelectableEventTypeTableBaseProps {
    events?: ReadonlyArray<SelectableEventTypeRow>;
}

const SelectableEventTypeTableLayout: React.FunctionComponent = props => {
    return (
        <TableComposable variant={ TableVariant.compact }>
            <Thead>
                <Tr>
                    <Th />
                    <Th>Event type</Th>
                    <Th>Application</Th>
                </Tr>
            </Thead>
            <Tbody>
                { props.children }
            </Tbody>
        </TableComposable>
    );
};

const SelectableEventTypeTableSkeleton: React.FunctionComponent = () => {
    return (
        <SelectableEventTypeTableLayout>
            { [ ...Array(skeletonRows) ].map((_unused, index) => (
                <Tr key={ index }>
                    <Td
                        select={ {
                            isSelected: false,
                            rowIndex: index,
                            disable: true
                        } }
                    />
                    <Td>
                        <Skeleton width="80%" />
                    </Td>
                    <Td>
                        <Skeleton width="80%" />
                    </Td>
                </Tr>
            )) }
        </SelectableEventTypeTableLayout>
    );
};

const SelectableEventTypeTableImpl: React.FunctionComponent<SelectableEventTypeTableImplProps> = props => {
    return (
        <SelectableEventTypeTableLayout>
            { props.events.map((event, rowIndex) => (
                <Tr key={ event.id }>
                    <Td select={ {
                        rowIndex,
                        onSelect: (_event, isSelected) => props.onSelect && props.onSelect(
                            isSelected,
                            event.id
                        ),
                        isSelected: event.isSelected,
                        disable: props.selectionDisabled
                    } } />
                    <Td>{ event.eventType }</Td>
                    <Td>{ event.application }</Td>
                </Tr>
            )) }
        </SelectableEventTypeTableLayout>
    );
};

export const SelectableEventTypeTable: React.FunctionComponent<SelectableEventTypeTableProps> = props => {
    if (props.events) {
        return <SelectableEventTypeTableImpl
            { ...props }
            events={ props.events }
        />;
    }

    return <SelectableEventTypeTableSkeleton />;
};
