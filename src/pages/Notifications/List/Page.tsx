import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useNotificationFilter } from './useNotificationFilter';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import { style } from 'typestyle';
import { NotificationsTable } from '../../../components/Notifications/Table';
import { Notification } from '../../../types/Notification';
import { GroupByEnum } from '../../../components/Notifications/Types';
import {
    ExporterType,
    getInsights,
    InsightsEnvDetector,
    RenderIfFalse
} from '@redhat-cloud-services/insights-common-typescript';
import { DefaultBehavior } from '../../../components/Notifications/DefaultBehavior';
import { EditNotificationPage } from '../Form/EditNotificationPage';
import {
    makeEditDefaultAction,
    makeEditNotificationAction,
    makeNoneAction,
    useFormModalReducer
} from './useFormModalReducer';
import { useDefaultNotificationBehavior } from '../../../services/useDefaultNotificationBehavior';
import { useListNotifications } from '../../../services/useListNotifications';
import { useNotificationRows } from './useNotificationRows';
import { stagingBetaAndProdBetaEnvironment } from '../../../types/Environments';
import { useAppContext } from '../../../app/AppContext';
import { useNotificationPage } from './useNotificationPage';

const displayInlineClassName = style({
    display: 'inline'
});

const tableTitleClassName = style({
    fontWeight: 600,
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    fontSize: '17px'
});

const emptyArray = [];

export const NotificationsListPage: React.FunctionComponent = () => {

    const defaultNotificationBehavior = useDefaultNotificationBehavior();
    const { applications } = useAppContext();

    const notificationsFilter = useNotificationFilter(applications.map(a => a.label.toString()));
    const [ groupBy, setGroupBy ] = React.useState<GroupByEnum>(GroupByEnum.Application);
    const groupBySelected = React.useCallback((selected: GroupByEnum) => {
        setGroupBy(selected);
    }, [ setGroupBy ]);

    const notificationPage = useNotificationPage(notificationsFilter.debouncedFilters, applications, 10);

    const useNotifications = useListNotifications(notificationPage.page);
    const {
        rows: notificationRows,
        onCollapse
    } = useNotificationRows(
        useNotifications.payload?.type === 'eventTypesArray' ? useNotifications.payload.value : emptyArray,
        groupBy
    );

    const [ modalIsOpenState, dispatchModalIsOpen ] = useFormModalReducer();

    const closeFormModal = React.useCallback((saved: boolean) => {
        const updateDefaultNotifications = defaultNotificationBehavior.query;
        const updateNotifications = useNotifications.query;
        if (saved && modalIsOpenState.isOpen) {
            if (modalIsOpenState.type === 'default') {
                updateDefaultNotifications();
            } else if (modalIsOpenState.type === 'notification') {
                updateNotifications();
            }
        }

        dispatchModalIsOpen(makeNoneAction());
    }, [ dispatchModalIsOpen, defaultNotificationBehavior.query, modalIsOpenState, useNotifications.query ]);

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
                <InsightsEnvDetector insights={ getInsights() } onEnvironment={ stagingBetaAndProdBetaEnvironment }>
                    <RenderIfFalse>
                        <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
                    </RenderIfFalse>
                </InsightsEnvDetector>
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
                        appFilterOptions={ applications }
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
