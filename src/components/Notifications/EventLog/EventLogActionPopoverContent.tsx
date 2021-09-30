import { Skeleton } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import * as React from 'react';

import Config from '../../../config/Config';
import { IntegrationType } from '../../../types/Integration';
import { UUID } from '../../../types/Notification';
import { style } from 'typestyle';
import { important } from 'csx';

const actionLabelMap: Record<IntegrationType, string> = Config.integrationNames;
const statusHeaderClass = style({
    minWidth: important('90px')
});

interface EventLogActionPopoverContentProps {
    id: UUID;
    type: IntegrationType;
    success: boolean;
}

export const EventLogActionPopoverContent: React.FunctionComponent<EventLogActionPopoverContentProps> = props => {
    return (
        <TableComposable
            borders={ false }
            variant={ TableVariant.compact }
        >
            <Thead>
                <Tr>
                    <Th>Action</Th>
                    <Th>Recipient</Th>
                    <Th className={ statusHeaderClass }>Status</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>{ actionLabelMap[props.type] }</Td>
                    <Td>
                        <Skeleton width="150px"  />
                    </Td>
                    <Td>{ props.success ? <>Success</> : <> Failure</> }</Td>
                </Tr>
            </Tbody>
        </TableComposable>
    );
};
