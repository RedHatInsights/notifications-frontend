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
import { NotificationsTable } from '../../../components/Notifications/Table';
import { ActionType, Notification } from '../../../types/Notification';

const displayInlineClassName = style({
    display: 'inline'
});

export const NotificationsListPage: React.FunctionComponent = () => {

    const notificationsFilter = useNotificationFilter();

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
        }
    ];

    const props: PageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title
    };

    return (
        <>
            <PageHeader>
                <PageHeaderTitle { ...props } />
                <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
            </PageHeader>
            <Main>
                <Section>
                    <NotificationsToolbar
                        filters={ notificationsFilter.filters }
                        setFilters={ notificationsFilter.setFilters }
                        clearFilter={ notificationsFilter.clearFilter }
                    >
                        <NotificationsTable notifications={ notifications }/>
                    </NotificationsToolbar>
                </Section>
            </Main>
        </>
    );
};
