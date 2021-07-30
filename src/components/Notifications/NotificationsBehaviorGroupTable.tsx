import { Button, ButtonVariant, Skeleton } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';
import { cellWidth, IActions, ICell, IRowData, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { global_active_color_100, global_disabled_color_100, global_palette_black_600 } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup, UUID } from '../../types/Notification';
import { emptyImmutableArray } from '../../utils/Immutable';
import { ouia } from '../Ouia';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';

type OnNotificationIdHandler = (notificationId: UUID) => void;
export type OnBehaviorGroupLinkUpdated = (notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup, isLinked: boolean) => void;

export interface NotificationsBehaviorGroupTableProps {
    behaviorGroupContent: BehaviorGroupContent;
    notifications: Array<BehaviorGroupNotificationRow>;
    onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
    onStartEditing?: OnNotificationIdHandler;
    onFinishEditing?: OnNotificationIdHandler;
    onCancelEditing?: OnNotificationIdHandler;
}

const actionButtonClassName = style({
    float: 'right'
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
        notification,
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
    }
];

// This will actually silence lots of warning we are having in the console about unwanted elements.
const EmptySpan: React.FunctionComponent<any> = _props => <span />;
const emptySpanProducer = () => <EmptySpan />;

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

    const actionResolver = React.useCallback((rowData: IRowData): IActions => {
        const notification: BehaviorGroupNotificationRow = rowData.notification;

        const isDisabled = notification.loadingActionStatus !== 'done';

        if (!notification.isEditMode) {
            return [
                {
                    key: 'edit',
                    className: actionButtonClassName,
                    title: <Button aria-label="edit" variant={ ButtonVariant.plain } isDisabled={ isDisabled }>
                        <PencilAltIcon />
                    </Button>,
                    isOutsideDropdown: true,
                    onClick: () => callbacks?.onStartEditing(notification.id),
                    isDisabled: isDisabled || !callbacks
                }
            ];
        }

        return [
            {
                key: 'done',
                className: actionButtonClassName,
                title: <Button aria-label="done" variant={ ButtonVariant.plain } isDisabled={ isDisabled }>
                    <CheckIcon color={ isDisabled ? global_disabled_color_100.value : global_active_color_100.value } />
                </Button>,
                isOutsideDropdown: true,
                onClick: () => callbacks?.onFinishEditing(notification.id),
                isDisabled: isDisabled || !callbacks
            },
            {
                key: 'cancel',
                className: actionButtonClassName,
                title: <Button aria-label="cancel" variant={ ButtonVariant.plain } isDisabled={ isDisabled }>
                    <CloseIcon color={ isDisabled ? global_disabled_color_100.value : global_palette_black_600.value } />
                </Button>,
                isOutsideDropdown: true,
                onClick: () => callbacks?.onCancelEditing(notification.id),
                isDisabled: isDisabled || !callbacks
            }
        ];
    }, [ callbacks ]);

    return (
        <Table
            aria-label="Notifications"
            rows={ rows }
            cells={ cells }
            variant={ TableVariant.compact }
            actionResolver={ actionResolver }
            actionsToggle={ emptySpanProducer as any }
        >
            <TableHeader />
            <TableBody />
        </Table>
    );
}, 'Notifications/Table');
