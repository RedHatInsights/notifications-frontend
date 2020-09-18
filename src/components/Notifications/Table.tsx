import * as React from 'react';
import { ICell, Table, TableHeader, TableBody, IRow, RowWrapperProps } from '@patternfly/react-table';
import { Messages } from '../../properties/Messages';
import { joinClasses, OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Action, ActionType, Notification } from '../../types/Notification';
import { style } from 'typestyle';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';

const pfBorderBottomClassName = style({
    borderBottom: 'var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)'
});

const noBorderBottom = style({
    borderBottom: 'none !important'
});

const cellPaddingBottom = style({
    paddingBottom: '0 !important'
});

const cellPaddingTop = style({
    paddingTop: `8px !important`
});

const columns: Array<ICell> = [
    {
        title: Messages.components.notifications.table.columns.event,
        transforms: []
    },
    {
        title: Messages.components.notifications.table.columns.action,
        transforms: []
    },
    {
        title: Messages.components.notifications.table.columns.recipient,
        transforms: []
    }
];

export interface NotificationsTableProps extends OuiaComponentProps {
    notifications: Array<NotificationRow>;
}

export type NotificationRow = Notification;

interface EventCellProps {
    event: string;
    application: string;
}

const EventCell: React.FunctionComponent<EventCellProps> = (props) => (
    <>
        <div> { props.event } </div>
        <div> { props.application } </div>
    </>
);

interface ActionCellProps {
    actions: Array<Action>;
}

const getId = (action: Action): string => {
    if (action.type === ActionType.INTEGRATION) {
        return `${action.type} - ${action.integrationName}`;
    }

    return `${action.type}`;
};

const getRecipients = (action: Action): string => {
    if (action.type === ActionType.INTEGRATION) {
        return 'N/A';
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

const toTableRows = (notifications: Array<NotificationRow>): Array<IRow> => {
    return notifications.reduce((rows, notification) => {
        const rowSpan = Math.max(1, notification.actions.length);

        const firtAction = notification.actions.length > 0 ? notification.actions[0] : undefined;

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
                        className: pfBorderBottomClassName
                    }
                },
                {
                    title: <><span>{ firtAction && getId(firtAction) }</span></>,
                    props: {
                        className: cellPaddingBottom
                    }
                },
                {
                    title: <><span>{ firtAction && getRecipients(firtAction) }</span></>,
                    props: {
                        className: cellPaddingBottom
                    }
                }
            ],
            props: {
                className: noBorderBottom
            }
        });

        for (let i = 1; i < rowSpan; ++i) {
            const classNames = joinClasses(
                (i + 1 === rowSpan ? '' : cellPaddingBottom),
                cellPaddingTop
            );
            const id = `${notification.id}-action-${i}`;
            rows.push({
                id,
                key: id,
                cells: [
                    {
                        title: getId(notification.actions[i]),
                        props: {
                            className: classNames
                        }
                    },
                    {
                        title: getRecipients(notification.actions[i]),
                        props: {
                            className: classNames
                        }
                    }
                ],
                props: {
                    className: (i + 1 === rowSpan ? '' : noBorderBottom)
                }
            });
        }

        return rows;
    }, [] as Array<IRow>);
};

export const NotificationsTable: React.FunctionComponent<NotificationsTableProps> = (props) => {

    const rows = React.useMemo(() => {
        return toTableRows(props.notifications);
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
