import * as React from 'react';
import {
    Main,
    PageHeader,
    PageHeaderTitle,
    PageHeaderTitleProps,
    Section
} from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useNotificationFilter } from './useNotificationFilter';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { style } from 'typestyle';
import {
    NotificationRowGroupedByApplication,
    NotificationRows,
    NotificationsTable
} from '../../../components/Notifications/Table';
import { Action, ActionType, Notification } from '../../../types/Notification';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { assertNever, ExporterType, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { DefaultBehavior } from '../../../components/Notifications/DefaultBehavior';

const displayInlineClassName = style({
    display: 'inline'
});

const tableTitleClassName = style({
    fontWeight: 600,
    paddingTop: Spacer.MD,
    paddingBottom: Spacer.MD,
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

const notifications: Array<Notification> = [
    {
        id: 'advisor-new-recommendation-critical',
        event: 'New recommendation - Critical',
        application: 'Advisor',
        actions: [
            {
                type: ActionType.EMAIL,
                recipient: [
                    'Admin', 'Security'
                ]
            },
            {
                type: ActionType.DRAWER,
                recipient: [
                    'Admin'
                ]
            },
            {
                type: ActionType.INTEGRATION,
                integrationName: 'PagerDuty'
            }
        ]
    },
    {
        id: 'advisor-new-recommendation-high',
        event: 'New recommendation - High',
        application: 'Advisor',
        actions: []
    },
    {
        id: 'advisor-new-recommendation-medium',
        event: 'New recommendation - Medium',
        application: 'Advisor',
        actions: []
    },
    {
        id: 'advisor-new-recommendation-low',
        event: 'New recommendation - Low',
        application: 'Advisor',
        actions: [
            {
                type: ActionType.PLATFORM_ALERT,
                recipient: []
            }
        ]
    },
    {
        id: 'vulnerability-new-cve-detected-critical',
        event: 'New CVE detected - Critical',
        application: 'Vulnerability',
        actions: [
            {
                type: ActionType.EMAIL,
                recipient: [
                    'Security admin',
                    'Stakeholders',
                    'Another one',
                    'Another one'
                ]
            },
            {
                type: ActionType.DRAWER,
                recipient: []
            },
            {
                type: ActionType.INTEGRATION,
                integrationName: 'Slack'
            }
        ]
    },
    {
        id: 'vulnerability-new-cve-detected-high',
        event: 'New CVE detected - High',
        application: 'Vulnerability',
        actions: [
            {
                type: ActionType.EMAIL,
                recipient: [
                    'Security admin'
                ]
            },
            {
                type: ActionType.DRAWER,
                recipient: [ 'Admin' ]
            },
            {
                type: ActionType.INTEGRATION,
                integrationName: 'Slack'
            }
        ]
    }
];

const defaultActions: Array<Action> = [
    {
        type: ActionType.EMAIL,
        recipient: [
            'Admin',
            'Security admin'
        ]
    },
    {
        type: ActionType.DRAWER,
        recipient: [
            'Admin'
        ]
    },
    {
        type: ActionType.INTEGRATION,
        integrationName: 'PagerDuty'
    }
];

export const NotificationsListPage: React.FunctionComponent = () => {

    const notificationsFilter = useNotificationFilter();
    const [ groupBy, setGroupBy ] = React.useState<GroupByEnum>(GroupByEnum.Application);
    const groupBySelected = React.useCallback((selected: GroupByEnum) => {
        setGroupBy(selected);
    }, [ setGroupBy ]);

    const [ notificationRows, setNotificationRows ] = React.useState<NotificationRows>({
        data: [],
        grouped: GroupByEnum.Application
    });

    React.useEffect(() => {
        setNotificationRows(toNotificationRow(notifications, groupBy));
    }, [ groupBy ]);

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

    const pageHeaderTitleProps: PageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title
    };

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle { ...pageHeaderTitleProps } />
                <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
            </PageHeader>
            <Main>
                <Section>
                    <DefaultBehavior
                        actions={ defaultActions }
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
                        />
                    </NotificationsToolbar>
                </Section>
            </Main>
        </>
    );
};
