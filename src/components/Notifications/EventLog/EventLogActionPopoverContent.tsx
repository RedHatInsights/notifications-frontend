import { Skeleton } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { important } from 'csx';
import * as React from 'react';
import { useAsync } from 'react-use';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { GetIntegrationRecipient, IntegrationType } from '../../../types/Integration';
import { UUID } from '../../../types/Notification';

const actionLabelMap: Record<IntegrationType, string> = Config.integrationNames;
const headerClass = style({
    minWidth: important('90px')
});

interface EventLogActionPopoverContentProps {
    id: UUID;
    type: IntegrationType;
    success: boolean;
    getIntegrationRecipient: GetIntegrationRecipient;
}

export const EventLogActionPopoverContent: React.FunctionComponent<EventLogActionPopoverContentProps> = props => {

    const { id, getIntegrationRecipient } = props;
    const recipient = useAsync(async () => getIntegrationRecipient(id), [ id, getIntegrationRecipient ]);

    return (
        <TableComposable
            borders={ false }
            variant={ TableVariant.compact }
        >
            <Thead>
                <Tr>
                    <Th className={ headerClass }>Action</Th>
                    <Th className={ headerClass }>Recipient</Th>
                    <Th className={ headerClass }>Status</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>{ actionLabelMap[props.type] }</Td>
                    <Td>
                        { recipient.loading ?  <Skeleton width="150px"  /> : recipient.value }
                    </Td>
                    <Td>{ props.success ? <>Success</> : <> Failure</> }</Td>
                </Tr>
            </Tbody>
        </TableComposable>
    );
};
