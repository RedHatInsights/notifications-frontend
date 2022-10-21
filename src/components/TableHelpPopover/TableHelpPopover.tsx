import { Popover, Text, TextContent } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { important } from 'csx';
import * as React from 'react';
import { style } from 'typestyle';

const removeBorderBottomClass = style({
    borderBottom: important('none')
});

export interface TableHelpPopoverProps {
    title: string | React.ReactNode;
    tableBody: ReadonlyArray<[React.ReactNode, React.ReactNode]>;
}

const getHeaderContent = (title: string | React.ReactNode): React.ReactNode => {
    if (typeof title === 'string') {
        return <TextContent>
            <Text component="h6">
                { title }
            </Text>
        </TextContent>;
    }

    return title;
};

export const TableHelpPopover: React.FunctionComponent<TableHelpPopoverProps> = props => {
    return <Popover
        hasAutoWidth
        headerContent={ getHeaderContent(props.title) }
        bodyContent={ <TableComposable
            variant={ TableVariant.compact }
            borders={ false }
        >
            <Thead>
                <Tr className={ removeBorderBottomClass }>
                    <Th>Status</Th>
                    <Th>Meaning</Th>
                </Tr>
            </Thead>
            <Tbody>
                { props.tableBody.map((tb, index) => (
                    <Tr key={ index }>
                        <Td>{tb[0]}</Td>
                        <Td>{tb[1]}</Td>
                    </Tr>
                )) }
            </Tbody>
        </TableComposable> }
    >
        <>{ props.children }</>
    </Popover>;
};
