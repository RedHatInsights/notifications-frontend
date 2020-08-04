import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useNotificationFilter } from './useNotificationFilter';

export const NotificationsListPage: React.FunctionComponent = () => {

    const notificationsFilter = useNotificationFilter();

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.notifications.list.title } />
            </PageHeader>
            <Main>
                <Section>
                    <NotificationsToolbar
                        filters={ notificationsFilter.filters }
                        setFilters={ notificationsFilter.setFilters }
                        clearFilter={ notificationsFilter.clearFilter }
                    >
                        <div/>
                    </NotificationsToolbar>
                </Section>
            </Main>
        </>
    );
};
