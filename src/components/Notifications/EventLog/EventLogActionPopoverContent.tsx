import { Skeleton } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { important } from 'csx';
import * as React from 'react';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { IntegrationType } from '../../../types/Integration';
import { UUID } from '../../../types/Notification';

const actionLabelMap: Record<IntegrationType, string> = Config.integrationNames;
const headerClass = style({
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
                    <Th className={ headerClass }>Action</Th>
                    <Th>Recipient</Th>
                    <Th className={ headerClass }>Status</Th>
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
