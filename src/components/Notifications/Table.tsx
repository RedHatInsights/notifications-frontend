import * as React from 'react';
import {
    expandable,
    ICell,
    IRow,
    IRowData,
    RowWrapperProps,
    Table,
    TableBody,
    TableHeader
} from '@patternfly/react-table';
import { Messages } from '../../properties/Messages';
import { assertNever, joinClasses, OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Action, NotificationType, Notification } from '../../types/Notification';
import { style } from 'typestyle';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import { ActionComponent } from './ActionComponent';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { GroupByEnum } from './Types';

import './Table.scss';

const pfBorderBottomClassName = style({
    borderBottom: 'var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)'
});

const noBorderBottom = style({
    borderBottom: 'none !important'
});

const cellPaddingBottom = style({
    paddingBottom: '0 !important'
});

const firstNestedCellInExpandedPaddingLeft = style({
    paddingLeft: '16px !important'
});

const cellPaddingBottomStyle = {
    '--pf-c-table__expandable-row-content--PaddingBottom': '0'
} as any;

const cellPaddingTop = style({
    paddingTop: `8px !important`
} as any);

const cellPaddingTopStyle = {
    '--pf-c-table__expandable-row-content--PaddingTop': '0'
} as any;

const grayFontClassName = style({
    color: '#888'
});

const noExpandableBorderClassName = style({
    $nest: {
        '&:after': {
            borderLeft: 'none !important',
            paddingBottom: '0 !important'
        }
    }
});

const applicationGroupClassName = style({
    fontWeight: 600
});

const columns: Array<ICell> = [
    {
        title: Messages.components.notifications.table.columns.event,
        transforms: [ ],
        cellFormatters: [ expandable ]
    },
    {
        title: Messages.components.notifications.table.columns.action,
        transforms: []
    },
    {
        title: Messages.components.notifications.table.columns.recipient,
        transforms: []
    },
    {
        title: ''
    }
];

export interface NotificationsTableProps extends OuiaComponentProps {
    notifications: NotificationRows;
    onCollapse: (index: number, isOpen: boolean) => void;
    onEdit: OnEditNotification;
}

export type NotificationRowGroupedByNone = Notification;

export interface NotificationRowGroupedByApplication {
    application: string;
    notifications: Array<NotificationRowGroupedByNone>;
    isOpen: boolean;
}

export type NotificationRows = {
    grouped: GroupByEnum.Application;
    data: Array<NotificationRowGroupedByApplication>;
} | {
    grouped: GroupByEnum.None;
    data: Array<NotificationRowGroupedByNone>;
}

export type OnEditNotification = (notification: Notification) => void;

interface EventCellProps {
    event: string;
    application: string;
}

const EventCell: React.FunctionComponent<EventCellProps> = (props) => (
    <>
        <div> { props.event } </div>
        <div className={ grayFontClassName }> { props.application } </div>
    </>
);

const getRecipients = (action: Action) => {
    if (action.type === NotificationType.INTEGRATION) {
        return <span>{ action.integration.name }</span>;
    }

    if (action.recipient.length === 0) {
        return <span>Default user access</span>;
    }

    return <span>{ action.recipient.join(', ') }</span>;
};

const RowWrapper: React.FunctionComponent<RowWrapperProps> = (props) => {
    const { trRef, className, rowProps, row, ...rest } = props;
    if (!row) {
        return <></>;
    }

    const rowClassName = (row as any).props?.className ? (row as any).props.className : '';

    return (
        <tr
            { ...rest }
            ref={ trRef as any }
            className={ css(
                className,
                row.isExpanded !== undefined && styles.tableExpandableRow,
                row.isExpanded && styles.modifiers.expanded,
                rowClassName
            ) }
            hidden={ row?.isExpanded !== undefined && !row.isExpanded }
        >
            { props.children }
        </tr>
    );
};

const toTableRowsGroupedByNone = (notifications: Array<NotificationRowGroupedByNone>, onEdit: OnEditNotification, parent?: number) => {
    return notifications.reduce((rows, notification) => {
        const rowSpan = Math.max(1, notification.useDefault ? 1 : notification.actions.length);
        const firstAction = notification.actions.length > 0 ? notification.actions[0] : undefined;

        rows.push({
            id: notification.id,
            key: notification.id,
            cells: [
                {
                    title: <EventCell
                        application={ notification.application }
                        event={ notification.event }
                    />,
                    props: {
                        rowSpan,
                        className: joinClasses(
                            noExpandableBorderClassName,
                            pfBorderBottomClassName
                        ),
                        colSpan: parent === undefined ? 1 : 1 // Todo: Change this to `? 1 : 2` once the PF bug is fixed
                        // https://github.com/patternfly/patternfly-react/issues/4858
                    }
                },
                {
                    title: <><span><ActionComponent isDefault={ !!notification.useDefault } action={ firstAction }/></span></>,
                    props: {
                        className: cellPaddingBottom,
                        style: cellPaddingBottomStyle
                    }
                },
                {
                    title: <><span>{ firstAction && getRecipients(firstAction) }</span></>,
                    props: {
                        className: cellPaddingBottom,
                        style: cellPaddingBottomStyle
                    }
                },
                {
                    title: <><Button onClick={ () => onEdit(notification) } variant={ ButtonVariant.link }>Edit</Button></>,
                    props: {
                        className: cellPaddingBottom,
                        style: cellPaddingBottomStyle
                    }
                }
            ],
            props: {
                className: notification.actions.length > 1 ? noBorderBottom : ''
            }
        });

        if (parent !== undefined) {
            rows[rows.length - 1].parent = parent;
            // rows[rows.length - 1].useAllCellInExpandedContent = true;
            rows[rows.length - 1].fullWidth = true;
        }

        for (let i = 1; i < rowSpan; ++i) {
            const classNames = joinClasses(
                (i + 1 === rowSpan ? '' : cellPaddingBottom),
                cellPaddingTop
            );
            const id = `${notification.id}-action-${i}`;
            const cssStyle = {
                ...cellPaddingTopStyle,
                ...(i + 1 === rowSpan ? {} : cellPaddingBottomStyle)
            };
            rows.push({
                id,
                key: id,
                cells: [
                    {
                        title: <ActionComponent isDefault={ !!notification.useDefault } action={ notification.actions[i] } />,
                        props: {
                            className: joinClasses(
                                noExpandableBorderClassName,
                                classNames,
                                parent === undefined ? '' : firstNestedCellInExpandedPaddingLeft
                            ),
                            style: cssStyle
                        }
                    },
                    {
                        title: getRecipients(notification.actions[i]),
                        props: {
                            className: classNames,
                            style: cssStyle
                        }
                    },
                    {
                        props: {
                            className: classNames,
                            style: cssStyle
                        }
                    }
                ],
                props: {
                    className: (i + 1 === rowSpan ? '' : noBorderBottom)
                }
            });

            if (parent !== undefined) {
                rows[rows.length - 1].parent = parent;
                // rows[rows.length - 1].useAllCellInExpandedContent = true;
                rows[rows.length - 1].fullWidth = true;
            }
        }

        return rows;
    }, [] as Array<IRow>);
};

const toTableRowsGroupedByApplication = (applicationGroups: Array<NotificationRowGroupedByApplication>, onEdit: OnEditNotification): Array<IRow> => {
    return applicationGroups.reduce((rows, applicationGroup) => {
        rows.push({
            id: applicationGroup.application,
            key: applicationGroup.application,
            cells: [
                {
                    title: <span className={ applicationGroupClassName }> Application: { applicationGroup.application }</span>,
                    props: {
                        className: noExpandableBorderClassName
                    }
                },
                {
                    title: '',
                    props: {
                        colSpan: columns.length - 1
                    }
                }
            ],
            isOpen: applicationGroup.isOpen
        });

        rows.push(...toTableRowsGroupedByNone(applicationGroup.notifications, onEdit, rows.length - 1));

        return rows;
    }, [] as Array<IRow>);
};

export const NotificationsTable: React.FunctionComponent<NotificationsTableProps> = (props) => {

    const rows = React.useMemo(() => {
        const notifications = props.notifications;
        switch (notifications.grouped) {
            case GroupByEnum.Application:
                return toTableRowsGroupedByApplication(notifications.data, props.onEdit);
            case GroupByEnum.None:
                return toTableRowsGroupedByNone(notifications.data, props.onEdit);
            default:
                assertNever(notifications);
        }

    }, [ props.notifications, props.onEdit ]);

    const onCollapseHandler = React.useCallback((_event, _index: number, isOpen: boolean, data: IRowData) => {
        const notifications = props.notifications;
        const onCollapse = props.onCollapse;

        if (notifications.grouped === GroupByEnum.None) {
            throw new Error('Invalid group None for CollapseHandler');
        }

        const index = notifications.data.findIndex(n => n.application === data.id);
        if (onCollapse && index !== undefined && index !== -1) {
            onCollapse(index, isOpen);
        }

    }, [ props.onCollapse, props.notifications ]);

    return (
        <div { ...getOuiaProps('Notifications/Table', props) } className="notification-table">
            <Table
                aria-label={ Messages.components.notifications.table.title }
                rows={ rows }
                cells={ columns }
                onCollapse={ onCollapseHandler }
                rowWrapper={ RowWrapper as (props: RowWrapperProps) => JSX.Element }
            >
                <TableHeader/>
                <TableBody/>
            </Table>
        </div>
    );
};
