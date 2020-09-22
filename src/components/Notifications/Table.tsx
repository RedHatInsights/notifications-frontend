import * as React from 'react';
import { expandable, ICell, IRow, RowWrapperProps, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Messages } from '../../properties/Messages';
import { assertNever, joinClasses, OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Action, ActionType, Notification } from '../../types/Notification';
import { style } from 'typestyle';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import { ActionComponent } from './ActionComponent';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { GroupByEnum } from './Types';

const pfBorderBottomClassName = style({
    borderBottom: 'var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)'
});

const noBorderBottom = style({
    borderBottom: 'none !important'
});

const cellPaddingBottom = style({
    paddingBottom: '0 !important'
} as any);

const cellPaddingBottomStyle = {
    '--pf-c-table__expandable-row-content--PaddingBottom': '0'
} as any;

const cellPaddingTop = style({
    paddingTop: `8px !important`
} as any);

const cellPaddingTopStyle = {
    '--pf-c-table__expandable-row-content--PaddingTop': '0'
} as any;

const applicationClassName = style({
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
    notifications: NotificationRow;
}

export type NotificationRowGroupedByNone = Notification;

export interface NotificationRowGroupedByApplication {
    application: string;
    notifications: Array<NotificationRowGroupedByNone>;
    isOpen: boolean;
}

export type NotificationRow = {
    grouped: GroupByEnum.Application;
    data: Array<NotificationRowGroupedByApplication>;
} | {
    grouped: GroupByEnum.None;
    data: Array<NotificationRowGroupedByNone>;
}

interface EventCellProps {
    event: string;
    application: string;
}

const EventCell: React.FunctionComponent<EventCellProps> = (props) => (
    <>
        <div> { props.event } </div>
        <div className={ applicationClassName }> { props.application } </div>
    </>
);

interface ActionCellProps {
    actions: Array<Action>;
}

const getRecipients = (action: Action): string => {
    if (action.type === ActionType.INTEGRATION) {
        return 'N/A';
    }

    if (action.recipient.length === 0) {
        return 'Default user access';
    }

    return action.recipient.join(', ');
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

const toTableRowsGroupedByNone = (notifications: Array<NotificationRowGroupedByNone>, parent?: number) => {
    return notifications.reduce((rows, notification) => {
        const rowSpan = Math.max(1, notification.actions.length);
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
                        className: joinClasses(noExpandableBorderClassName, pfBorderBottomClassName)
                    }
                },
                {
                    title: <><span>{ firstAction ? <ActionComponent action={ firstAction } /> : 'Default behavior' }</span></>,
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
                    title: <><Button variant={ ButtonVariant.link }>Edit</Button></>,
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
                        title: <ActionComponent action={ notification.actions[i] } />,
                        props: {
                            className: joinClasses(noExpandableBorderClassName, classNames),
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
            }
        }

        return rows;
    }, [] as Array<IRow>);
};

const toTableRowsGroupedByApplication = (applicationGroups: Array<NotificationRowGroupedByApplication>): Array<IRow> => {
    return applicationGroups.reduce((rows, applicationGroup) => {
        rows.push({
            id: applicationGroup.application,
            key: applicationGroup.application,
            cells: [
                {
                    title: <span className={ applicationGroupClassName }> Application: { applicationGroup.application }</span>,
                    props: {
                        colSpan: columns.length,
                        className: noExpandableBorderClassName
                    }
                }
            ],
            isOpen: applicationGroup.isOpen
        });

        rows.push(...toTableRowsGroupedByNone(applicationGroup.notifications, rows.length - 1));

        return rows;
    }, [] as Array<IRow>);
};

export const NotificationsTable: React.FunctionComponent<NotificationsTableProps> = (props) => {

    const rows = React.useMemo(() => {
        const notifications = props.notifications;
        switch (notifications.grouped) {
            case GroupByEnum.Application:
                return toTableRowsGroupedByApplication(notifications.data);
            case GroupByEnum.None:
                return toTableRowsGroupedByNone(notifications.data);
            default:
                assertNever(notifications);
        }

    }, [ props.notifications ]);

    console.log(rows);

    return (
        <div { ...getOuiaProps('Notifications/Table', props) }>
            <Table
                aria-label={ Messages.components.notifications.table.title }
                rows={ rows }
                cells={ columns }
                rowWrapper={ RowWrapper as (props: RowWrapperProps) => JSX.Element }
            >
                <TableHeader/>
                <TableBody/>
            </Table>
        </div>
    );
};
