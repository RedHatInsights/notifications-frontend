import { Skeleton, Tooltip } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { c_alert_m_warning__icon_Color, global_palette_black_700, global_spacer_xs } from '@patternfly/react-tokens';
import assertNever from 'assert-never';
import { important } from 'csx';
import * as React from 'react';
import { useAsync } from 'react-use';
import { style } from 'typestyle';

import Config from '../../../config/Config';
import { NotificationEventAction, NotificationEventStatus } from '../../../types/Event';
import { GetIntegrationRecipient, IntegrationType } from '../../../types/Integration';

const headerClass = style({
    minWidth: important('90px')
});

const grayFontClassName = style({
    color: global_palette_black_700.value
});

const leftMargin = style({
    marginLeft: global_spacer_xs.value
});

interface EventLogActionPopoverContentProps {
    action: NotificationEventAction;
    getIntegrationRecipient: GetIntegrationRecipient;
}

const toDisplayStatus = (status: NotificationEventStatus) => {
    switch (status) {
        case NotificationEventStatus.ERROR:
            return <> <ExclamationCircleIcon color="red" /> <span className={ leftMargin }>Failure</span></>;
        case NotificationEventStatus.SUCCESS:
            return <> <CheckCircleIcon color="green" /> <span className={ leftMargin }>Success</span></>;
        case NotificationEventStatus.WARNING:
            return <> <ExclamationTriangleIcon color={ c_alert_m_warning__icon_Color.value } /> <span className={ leftMargin }>Warning</span></>;
        default:
            assertNever(status);
    }
};

const succeeded = (action: NotificationEventAction) => {
    if (action.endpointType === IntegrationType.EMAIL_SUBSCRIPTION) {
        return 'emails sent';
    }

    return 'succeeded';
};

const failed = (action: NotificationEventAction) => {
    if (action.endpointType === IntegrationType.EMAIL_SUBSCRIPTION) {
        return 'emails failed';
    }

    return 'failed';
};

export const EventLogActionPopoverContent: React.FunctionComponent<EventLogActionPopoverContentProps> = props => {

    const { action: { id }, getIntegrationRecipient } = props;
    const recipient = useAsync(async () => id && getIntegrationRecipient(id), [ id, getIntegrationRecipient ]);

    return (
        <TableComposable
            borders={ false }
            variant={ TableVariant.compact }
            isStickyHeader={ true }
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
                    <Td>{ Config.integrations.types[props.action.endpointType].action }</Td>
                    <Td>
                        { id ? recipient.loading ?  <Skeleton width="150px"  /> : recipient.value : (
                            <Tooltip content="The integration no longer exists, it could have been deleted.">
                                <span>Unknown integration</span>
                            </Tooltip>
                        ) }
                    </Td>
                    <Td>
                        <div>{ toDisplayStatus(props.action.status) }</div>
                        { props.action.successCount > 1 && (
                            <div className={ grayFontClassName }>{ props.action.successCount } { succeeded(props.action) } </div>
                        ) }
                        { props.action.errorCount > 1 && (
                            <div className={ grayFontClassName }>{ props.action.errorCount } { failed(props.action) } </div>
                        ) }
                    </Td>
                </Tr>
            </Tbody>
        </TableComposable>
    );
};
