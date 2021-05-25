import { Skeleton } from '@patternfly/react-core';
import { ICell, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup, UUID } from '../../types/Notification';
import { emptyImmutableArray } from '../../utils/Immutable';
import { ouia } from '../Ouia';
import { BehaviorGroupCellControl, OnNotificationIdHandler } from './Table/BehaviorGroupCellControl';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';

export type OnEditNotification = (isLinked: boolean, notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup) => void;
type OnSetEditMode = (notificationId: UUID, isReadOnly: boolean) => void;

export interface NotificationsBehaviorGroupTableProps {
    behaviorGroupContent: BehaviorGroupContent;
    notifications: Array<BehaviorGroupNotificationRow>;
    onEdit?: OnEditNotification;
    onSetEditMode: OnSetEditMode
}

const buttonCellClassName = style({
    width: '10px !important'
});

type Callbacks = {
    onStartEditing: OnNotificationIdHandler;
    onFinishEditing:  OnNotificationIdHandler;
    onCancelEditing: OnNotificationIdHandler;
};

const toTableRows = (
    notifications: Array<BehaviorGroupNotificationRow>,
    behaviorGroupContent: BehaviorGroupContent,
    onSetEditMode: OnNotificationIdHandler,
    onEdit?: OnEditNotification) => {
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
                            onSelect={ onEdit }
                            isReadOnly={ notification.isReadOnly }
                        />
                    </span>
            },
            {
                title: <BehaviorGroupCellControl
                    notificationId={ notification.id }
                    isReadOnly={ notification.isReadOnly }
                    onStartEditing={ onSetEditMode }
                    onCancelEditMode={ onSetEditMode }
                    onFinishEditing={ onSetEditMode }
                />,
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

    const rows = React.useMemo(() => {
        const onSetEditMode = props.onSetEditMode;
        const onSetEditModeCallBack = (notificationId: UUID) => {
            onSetEditMode(notificationId, false);
        };

        return toTableRows(props.notifications, props.behaviorGroupContent, onSetEditModeCallBack, props.onEdit);
    }, [ props.notifications, props.behaviorGroupContent, props.onEdit, props.onSetEditMode ]);

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
