import * as React from 'react';
import { NotificationBehaviorGroup } from '../../types/Notification';
import { ouia } from '../Ouia';
import { expandable, ICell, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { Messages } from '../../properties/Messages';
import { Button } from '@patternfly/react-core';

export type OnEditNotification = (notification: NotificationBehaviorGroup) => void;

export interface BehaviorGroupNotificationRows extends NotificationBehaviorGroup {
    loadingActionStatus: 'loading' | 'done' | 'error';
}

export interface NotificationsBehaviorGroupTableProps {
    notifications: Array<BehaviorGroupNotificationRows>;
    onEdit?: OnEditNotification;
}

const toTableRows = (notifications: Array<BehaviorGroupNotificationRows>, onEdit?: OnEditNotification) => {
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
                title: <Button>Edit</Button>
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
