import { Skeleton } from '@patternfly/react-core';
import { cellWidth, ICell, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../types/Notification';
import { emptyImmutableArray } from '../../utils/Immutable';
import { ouia } from '../Ouia';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';
import { BehaviorGroupCellControl, OnNotificationIdHandler } from './Table/BehaviorGroupCellControl';

export type OnBehaviorGroupLinkUpdated = (notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup, isLinked: boolean) => void;

export interface NotificationsBehaviorGroupTableProps {
    behaviorGroupContent: BehaviorGroupContent;
    notifications: Array<BehaviorGroupNotificationRow>;
    onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
    onStartEditing?: OnNotificationIdHandler;
    onFinishEditing?: OnNotificationIdHandler;
    onCancelEditing?: OnNotificationIdHandler;
}

const buttonCellClassName = style({
    width: '10px !important'
});

type Callbacks = {
    onStartEditing: OnNotificationIdHandler;
    onFinishEditing:  OnNotificationIdHandler;
    onCancelEditing: OnNotificationIdHandler;
    onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
};

const toTableRows = (
    notifications: Array<BehaviorGroupNotificationRow>,
    behaviorGroupContent: BehaviorGroupContent,
    callbacks?: Callbacks) => {
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
                    <Skeleton width="90%" /> :
                    <span>
                        <BehaviorGroupCell
                            id={ `behavior-group-cell-${notification.id}` }
                            notification={ notification }
                            behaviorGroupContent={ behaviorGroupContent }
                            selected={ notification.behaviors ?? emptyImmutableArray }
                            onSelect={ callbacks?.onBehaviorGroupLinkUpdated }
                            isEditMode={ notification.isEditMode }
                        />
                    </span>
            },
            {
                title: <BehaviorGroupCellControl
                    notificationId={ notification.id }
                    isEditMode={ notification.isEditMode }
                    onStartEditing={ callbacks?.onStartEditing }
                    onCancelEditMode={ callbacks?.onCancelEditing }
                    onFinishEditing={ callbacks?.onFinishEditing }
                    isDisabled={ notification.loadingActionStatus !== 'done' }
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
        transforms: [ cellWidth(35) ]
    },
    {
        title: ''
    }
];

export const NotificationsBehaviorGroupTable = ouia<NotificationsBehaviorGroupTableProps>(props => {

    const callbacks: Callbacks | undefined = React.useMemo(() => {

        if (props.onStartEditing && props.onFinishEditing && props.onCancelEditing) {
            return {
                onStartEditing: props.onStartEditing,
                onFinishEditing: props.onFinishEditing,
                onCancelEditing: props.onCancelEditing,
                onBehaviorGroupLinkUpdated: props.onBehaviorGroupLinkUpdated
            };
        }

        return undefined;
    }, [ props.onStartEditing, props.onFinishEditing, props.onCancelEditing, props.onBehaviorGroupLinkUpdated ]);

    const rows = React.useMemo(() => {
        return toTableRows(props.notifications, props.behaviorGroupContent, callbacks);
    }, [ props.notifications, props.behaviorGroupContent, callbacks ]);

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
}, 'Notifications/Table');
