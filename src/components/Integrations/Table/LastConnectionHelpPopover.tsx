import { Popover, Text, TextContent } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { important } from 'csx';
import * as React from 'react';
import { style } from 'typestyle';

import { StatusCreationFailure, StatusEventFailure, StatusProcessing, StatusReady, StatusSuccess } from './Status';

const removeBorderBottomClass = style({
    borderBottom: important('none')
});

export const LastConnectionHelpPopover: React.FunctionComponent<unknown> = props => {
    return <Popover
        hasAutoWidth
        headerContent={ <TextContent>
            <Text component="h6">
                Last connection attempt status meanings
            </Text>
        </TextContent> }
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
                <Tr>
                    <Td><StatusSuccess /></Td>
                    <Td>The last connection attempt succeeded</Td>
                </Tr>
                <Tr>
                    <Td><StatusEventFailure /></Td>
                    <Td>The last connection attempt failed</Td>
                </Tr>
                <Tr>
                    <Td><StatusCreationFailure /></Td>
                    <Td>Integration creation failed. Configuration error</Td>
                </Tr>
                <Tr>
                    <Td><StatusReady /></Td>
                    <Td>Your integration configuration was successful</Td>
                </Tr>
                <Tr>
                    <Td><StatusProcessing /></Td>
                    <Td>Integration configuration processing</Td>
                </Tr>
            </Tbody>
        </TableComposable> }
    >
        <>{ props.children }</>
    </Popover>;
};
