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
    NotificationRow,
    NotificationRowGroupedByApplication,
    NotificationsTable
} from '../../../components/Notifications/Table';
import { ActionType, Notification } from '../../../types/Notification';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';

const displayInlineClassName = style({
    display: 'inline'
});

export const NotificationsListPage: React.FunctionComponent = () => {

    const notificationsFilter = useNotificationFilter();
    const [ groupBy, setGroupBy ] = React.useState<GroupByEnum>(GroupByEnum.Application);
    const groupBySelected = React.useCallback((selected: GroupByEnum) => {
        setGroupBy(selected);
    }, [ setGroupBy ]);

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
                        'Stakeholders'
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

    const notificationRows = React.useMemo<NotificationRow>(() => {

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
    }, [ notifications, groupBy ]);

    const pageHeaderTitleProps: PageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title
    };

    console.log(notificationRows);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle { ...pageHeaderTitleProps } />
                <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
            </PageHeader>
            <Main>
                <Section>
                    <NotificationsToolbar
                        filters={ notificationsFilter.filters }
                        setFilters={ notificationsFilter.setFilters }
                        clearFilter={ notificationsFilter.clearFilter }
                        groupBy={ groupBy }
                        onGroupBySelected={ groupBySelected }
                    >
                        <NotificationsTable
                            notifications={ notificationRows }
                        />
                    </NotificationsToolbar>
                </Section>
            </Main>
        </>
    );
};
