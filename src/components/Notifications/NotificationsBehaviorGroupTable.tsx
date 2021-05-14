import { Button, ButtonVariant } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { ICell, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import * as React from 'react';
import { style } from 'typestyle';

import { NotificationBehaviorGroup } from '../../types/Notification';
import { ouia } from '../Ouia';

export type OnEditNotification = (notification: NotificationBehaviorGroup) => void;

export interface BehaviorGroupNotificationRow extends NotificationBehaviorGroup {
    loadingActionStatus: 'loading' | 'done' | 'error';
}

export interface NotificationsBehaviorGroupTableProps {
    notifications: Array<BehaviorGroupNotificationRow>;
    onEdit?: OnEditNotification;
}

const buttonRowClassName = style({
    width: '10px !important'
});

const toTableRows = (notifications: Array<BehaviorGroupNotificationRow>, _onEdit?: OnEditNotification) => {
    return notifications.map((notification => ({
        id: notification.id,
        key: notification.id,
        cells: [
            {
                title: <span>{ notification.eventTypeDisplayName }</span>
            },
            {
                title: <span>{ notification.applicationDisplayName }</span>
            },
            {
                title: <span>{ notification.behaviors?.map(b => b.displayName).join(', ') }</span>
            },
            {
                title: <Button variant={ ButtonVariant.plain }>
                    <PencilAltIcon />
                </Button>,
                props: {
                    className: buttonRowClassName
                }
            }
        ]
    })));
};

const cells: Array<ICell> = [
    {
        title: 'Event',
        transforms: [],
        cellFormatters: []
    },
    {
        title: 'Application',
        transforms: []
    },
    {
        title: 'Behavior',
        transforms: []
    },
    {
        title: ''
    }
];

export const NotificationsBehaviorGroupTable = ouia<NotificationsBehaviorGroupTableProps>(props => {

    const rows = React.useMemo(() => toTableRows(props.notifications, props.onEdit), [ props.notifications, props.onEdit ]);

    return (
        <Table
            aria-label="Notifications"
            rows={ rows }
            cells={ cells }
            variant={ TableVariant.compact }
        >
            <TableHeader />
            <TableBody />
        </Table>
    );
}, 'Notifications/BehaviorGroupTable');
