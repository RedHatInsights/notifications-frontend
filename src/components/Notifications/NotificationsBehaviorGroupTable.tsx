import { Button, ButtonVariant, Skeleton } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { ICell, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../types/Notification';
import { emptyImmutableArray } from '../../utils/Immutable';
import { ouia } from '../Ouia';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';

export type OnEditNotification = (isLinked: boolean, notification: NotificationBehaviorGroup, behaviorGroup?: BehaviorGroup) => void;

export interface NotificationsBehaviorGroupTableProps {
    behaviorGroupContent: BehaviorGroupContent;
    notifications: Array<BehaviorGroupNotificationRow>;
    onEdit?: OnEditNotification;
}

const buttonCellClassName = style({
    width: '10px !important'
});

const toTableRows = (notifications: Array<BehaviorGroupNotificationRow>, behaviorGroupContent: BehaviorGroupContent, onEdit?: OnEditNotification) => {
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
                title: notification.loadingActionStatus === 'loading' ?
                    <Skeleton width="180px" /> :
                    <span>
                        <BehaviorGroupCell
                            id={ `behavior-group-cell-${notification.id}` }
                            notification={ notification }
                            behaviorGroupContent={ behaviorGroupContent }
                            selected={ notification.behaviors ?? emptyImmutableArray }
                            isMuted={ false }
                            onSelect={ onEdit }
                        />
                    </span>
            },
            {
                title: <Button variant={ ButtonVariant.plain }>
                    <PencilAltIcon />
                </Button>,
                props: {
                    className: buttonCellClassName
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

    const rows = React.useMemo(() => toTableRows(props.notifications, props.behaviorGroupContent, props.onEdit),
        [ props.notifications, props.behaviorGroupContent, props.onEdit ]);

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
