import { Button, ButtonVariant } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import {
    ExporterType,
    getInsights,
    InsightsEnvDetector,
    RenderIfFalse
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { style } from 'typestyle';

import { AppContext, useAppContext } from '../../../app/AppContext';
import { DefaultBehavior } from '../../../components/Notifications/DefaultBehavior';
import { NotificationsTable } from '../../../components/Notifications/Table';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { Messages } from '../../../properties/Messages';
import { useDefaultNotificationBehavior } from '../../../services/useDefaultNotificationBehavior';
import { useListNotifications } from '../../../services/useListNotifications';
import { stagingBetaAndProdBetaEnvironment } from '../../../types/Environments';
import { Notification } from '../../../types/Notification';
import { EditNotificationPage } from '../Form/EditNotificationPage';
import {
    makeEditDefaultAction,
    makeEditNotificationAction,
    makeNoneAction,
    useFormModalReducer
} from './useFormModalReducer';
import { useNotificationFilter } from './useNotificationFilter';
import { useNotificationPage } from './useNotificationPage';
import { useNotificationRows } from './useNotificationRows';

const displayInlineClassName = style({
    display: 'inline'
});

const tableTitleClassName = style({
    fontWeight: 600,
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    fontSize: '17px'
});

const noPaddingTopClassName = style({
    paddingTop: 0
});

const emptyArray = [];

export const NotificationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);
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
            <Main className={ noPaddingTopClassName }>
                <Section>
                    <DefaultBehavior
                        loading={ defaultNotificationBehavior.loading }
                        defaultBehavior={ defaultNotificationBehavior.payload?.type === 'DefaultNotificationBehavior' ?
                            defaultNotificationBehavior.payload.value :
                            undefined }
                        onEdit={ canWriteAll ? onEditDefaultAction : undefined }
                    />
                    <div className={ tableTitleClassName }>Insights notifications event types and behavior</div>
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
                            onEdit={ canWriteAll ? onEditNotification : undefined }
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
