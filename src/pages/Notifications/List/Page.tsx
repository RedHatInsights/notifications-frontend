import * as React from 'react';
import {
    Main,
    PageHeader,
    PageHeaderTitle,
    Section
} from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useNotificationFilter } from './useNotificationFilter';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import { style } from 'typestyle';
import {
    NotificationRowGroupedByApplication,
    NotificationRows,
    NotificationsTable
} from '../../../components/Notifications/Table';
import { Notification } from '../../../types/Notification';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { DefaultBehavior } from '../../../components/Notifications/DefaultBehavior';
import { EditNotificationPage } from '../Form/EditNotificationPage';
import {
    makeEditDefaultAction,
    makeEditNotificationAction,
    makeNoneAction,
    useFormModalReducer
} from './useFormModalReducer';
import { assertNever } from 'assert-never';
import { useDefaultNotificationBehavior } from '../../../services/useDefaultNotificationBehavior';
import { useListNotifications } from '../../../services/useListNotifications';

const displayInlineClassName = style({
    display: 'inline'
});

const tableTitleClassName = style({
    fontWeight: 600,
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    fontSize: '17px'
});

const toNotificationRow = (notifications: Array<Notification>, groupBy: GroupByEnum): NotificationRows => {
    switch (groupBy) {
        case GroupByEnum.None:
            return {
                grouped: GroupByEnum.None,
                data: notifications
            };
        case GroupByEnum.Application:
            const grouped = notifications.reduce((groups, notification) => {
                if (!groups[notification.application]) {
                    groups[notification.application] = {
                        application: notification.application,
                        isOpen: true,
                        notifications: []
                    };
                }

                groups[notification.application].notifications.push(notification);
                return groups;
            }, {} as Record<string, NotificationRowGroupedByApplication>);

            return {
                grouped: GroupByEnum.Application,
                data: Object.values(grouped)
            };
        default:
            assertNever(groupBy);
    }
};

export const NotificationsListPage: React.FunctionComponent = () => {

    const defaultNotificationBehavior = useDefaultNotificationBehavior();

    const notificationsFilter = useNotificationFilter();
    const [ groupBy, setGroupBy ] = React.useState<GroupByEnum>(GroupByEnum.Application);
    const groupBySelected = React.useCallback((selected: GroupByEnum) => {
        setGroupBy(selected);
    }, [ setGroupBy ]);

    const [ notificationRows, setNotificationRows ] = React.useState<NotificationRows>({
        data: [],
        grouped: groupBy
    });

    const useNotifications = useListNotifications();

    React.useEffect(() => {
        const payload = useNotifications.payload;
        if (payload?.type === 'eventTypesArray') {
            setNotificationRows(toNotificationRow(payload.value, groupBy));
        } else {
            setNotificationRows(prev => ({ ...prev, data: []}));
        }

    }, [ groupBy, useNotifications.payload ]);

    const [ modalIsOpenState, dispatchModalIsOpen ] = useFormModalReducer();

    const closeFormModal = React.useCallback((saved: boolean) => {
        const updateDefaultNotifications = defaultNotificationBehavior.query;
        if (saved && modalIsOpenState.isOpen) {
            if (modalIsOpenState.type === 'default') {
                updateDefaultNotifications();
            }
        }

        dispatchModalIsOpen(makeNoneAction());
    }, [ dispatchModalIsOpen, defaultNotificationBehavior.query, modalIsOpenState ]);

    const onCollapse = React.useCallback((index: number, isOpen: boolean) => {
        setNotificationRows(prevRows => {
            switch (prevRows.grouped) {
                case GroupByEnum.None:
                    throw new Error('On collapse is not valid for group: None');
                case GroupByEnum.Application:
                    const data = [
                        ...prevRows.data
                    ];

                    data[index] = {
                        ...data[index],
                        isOpen
                    };

                    return {
                        ...prevRows,
                        data
                    };
                default:
                    assertNever(prevRows);
            }
        });
    }, [ setNotificationRows ]);

    const pageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title
    };

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

    const onEditDefaultAction = React.useCallback(() => {
        const payload = defaultNotificationBehavior.payload;
        if (payload?.type === 'DefaultNotificationBehavior') {
            dispatchModalIsOpen(makeEditDefaultAction(payload.value));
        }
    }, [ dispatchModalIsOpen, defaultNotificationBehavior.payload ]);

    const onEditNotification = React.useCallback((notification: Notification) => {
        dispatchModalIsOpen(makeEditNotificationAction(notification));
    }, [ dispatchModalIsOpen ]);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle { ...pageHeaderTitleProps } />
                <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
            </PageHeader>
            <Main>
                <Section>
                    <DefaultBehavior
                        loading={ defaultNotificationBehavior.loading }
                        defaultBehavior={ defaultNotificationBehavior.payload?.type === 'DefaultNotificationBehavior' ?
                            defaultNotificationBehavior.payload.value :
                            undefined }
                        onEdit={ onEditDefaultAction }
                    />
                    <div className={ tableTitleClassName }>Insights notifications types and behavior</div>
                    <NotificationsToolbar
                        filters={ notificationsFilter.filters }
                        setFilters={ notificationsFilter.setFilters }
                        clearFilter={ notificationsFilter.clearFilter }
                        groupBy={ groupBy }
                        onGroupBySelected={ groupBySelected }
                        onExport={ onExport }
                    >
                        <NotificationsTable
                            notifications={ notificationRows }
                            onCollapse={ onCollapse }
                            onEdit={ onEditNotification }
                        />
                    </NotificationsToolbar>
                    { modalIsOpenState.isOpen && (
                        <EditNotificationPage
                            onClose={ closeFormModal }
                            { ...modalIsOpenState }
                        />
                    ) }
                </Section>
            </Main>
        </>
    );
};
