import { Button, ButtonVariant, Skeleton } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';
import {
    IExtraColumnData,
    SortByDirection,
    TableComposable,
    TableVariant,
    Tbody, Td, Th,
    Thead, ThProps, Tr
} from '@patternfly/react-table';
import { TdActionsType } from '@patternfly/react-table/dist/esm/components/Table/base';
import { global_active_color_100, global_disabled_color_100, global_palette_black_600 } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupNotificationRow } from '../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup, UUID } from '../../types/Notification';
import { SortDirection, sortDirectionFromString } from '../../types/SortDirection';
import { emptyImmutableArray } from '../../utils/Immutable';
import { ouia } from '../Ouia';
import { BehaviorGroupCell } from './Table/BehaviorGroupCell';

type OnNotificationIdHandler = (notificationId: UUID) => void;
export type OnBehaviorGroupLinkUpdated = (notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup, isLinked: boolean) => void;

// The value has to be the order on which the columns appear on the table
export enum NotificationsTableColumns {
    EVENT,
    APPLICATION,
    BEHAVIOR
}

export interface NotificationsBehaviorGroupTableProps {
    behaviorGroupContent: BehaviorGroupContent;
    notifications: Array<BehaviorGroupNotificationRow>;
    onBehaviorGroupLinkUpdated: OnBehaviorGroupLinkUpdated;
    onStartEditing?: OnNotificationIdHandler;
    onFinishEditing?: OnNotificationIdHandler;
    onCancelEditing?: OnNotificationIdHandler;
    sortBy: NotificationsTableColumns;
    sortDirection: SortDirection;

    onSort: (column: NotificationsTableColumns, direction: SortDirection) => void;
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

const HiddenActionsToggle = () => <React.Fragment />;

const getActions = (notification: BehaviorGroupNotificationRow, callbacks?: Callbacks): TdActionsType => {
    const isDisabled = notification.loadingActionStatus !== 'done';

    if (!notification.isEditMode) {
        return {
            actionsToggle: HiddenActionsToggle,
            items: [
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
            ]
        };
    }

    return {
        actionsToggle: HiddenActionsToggle,
        items: [
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
        ]
    };
};

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

    const onSort = React.useCallback((
        _event: React.MouseEvent,
        columnIndex: number,
        sortByDirection: SortByDirection,
        _extraData: IExtraColumnData) => {
        const externalOnSort = props.onSort;
        externalOnSort(columnIndex, sortDirectionFromString(sortByDirection));
    }, [ props.onSort ]);

    const sortOptions: Record<NotificationsTableColumns, undefined | ThProps['sort']> = React.useMemo(() => {
        const sortBy = {
            direction: props.sortDirection,
            index: props.sortBy
        };

        return {
            [NotificationsTableColumns.EVENT]: {
                sortBy,
                columnIndex: NotificationsTableColumns.EVENT,
                onSort
            },
            [NotificationsTableColumns.APPLICATION]: {
                sortBy,
                columnIndex: NotificationsTableColumns.APPLICATION,
                onSort
            },
            [NotificationsTableColumns.BEHAVIOR]: undefined
        };
    }, [ props.sortDirection, props.sortBy, onSort ]);

    const rows = React.useMemo(() => {
        const notifications = props.notifications;
        const behaviorGroupContent = props.behaviorGroupContent;
        return notifications.map(notification => {
            return (
                <Tr key={ notification.id }>
                    <Td>{notification.eventTypeDisplayName}</Td>
                    <Td>{notification.applicationDisplayName}</Td>
                    <Td>{notification.loadingActionStatus === 'loading' ? (
                        <Skeleton width="90%" />
                    ) : (
                        <BehaviorGroupCell
                            id={ `behavior-group-cell-${notification.id}` }
                            notification={ notification }
                            behaviorGroupContent={ behaviorGroupContent }
                            selected={ notification.behaviors ?? emptyImmutableArray }
                            onSelect={ callbacks?.onBehaviorGroupLinkUpdated }
                            isEditMode={ notification.isEditMode }
                        />
                    )}</Td>
                    <Td
                        actions={ getActions(notification, callbacks) }
                    />
                </Tr>
            );
        });
    }, [ props.notifications, props.behaviorGroupContent, callbacks ]);

    return (
        <TableComposable
            aria-label="Notifications"
            isStickyHeader={ true }
            variant={ TableVariant.compact }
        >
            <Thead>
                <Tr>
                    <Th
                        sort={ sortOptions[NotificationsTableColumns.EVENT] }
                    >
                        Event
                    </Th>
                    <Th
                        sort={ sortOptions[NotificationsTableColumns.APPLICATION] }
                    >
                        Application
                    </Th>
                    <Th
                        sort={ sortOptions[NotificationsTableColumns.BEHAVIOR] }
                        width={ 35 }
                    >
                        Behavior
                    </Th>
                    <Th />
                </Tr>
            </Thead>
            <Tbody>
                { rows }
            </Tbody>
        </TableComposable>
    );
}, 'Notifications/Table');
