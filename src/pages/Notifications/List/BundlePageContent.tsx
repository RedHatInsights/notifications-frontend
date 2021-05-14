import { global_spacer_md } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { style } from 'typestyle';

import { AppContext } from '../../../app/AppContext';
import { DefaultBehavior } from '../../../components/Notifications/DefaultBehavior';
import { NotificationsTable } from '../../../components/Notifications/Table';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { useDefaultNotificationBehavior } from '../../../services/useDefaultNotificationBehavior';
import { useListNotifications } from '../../../services/useListNotifications';
import { Facet, Notification } from '../../../types/Notification';
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

const tableTitleClassName = style({
    fontWeight: 600,
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    fontSize: '17px'
});

const emptyArray = [];

interface BundlePageContentProps {
    applications: Array<Facet>;
    bundle: Facet;
}

export const BundlePageContent: React.FunctionComponent<BundlePageContentProps> = props => {

    const { rbac: { canWriteNotifications }} = useContext(AppContext);
    const defaultNotificationBehavior = useDefaultNotificationBehavior();

    const notificationsFilter = useNotificationFilter(props.applications.map(a => a.displayName.toString()));
    const [ groupBy, setGroupBy ] = React.useState<GroupByEnum>(GroupByEnum.Application);
    const groupBySelected = React.useCallback((selected: GroupByEnum) => {
        setGroupBy(selected);
    }, [ setGroupBy ]);

    const notificationPage = useNotificationPage(notificationsFilter.debouncedFilters, props.bundle, props.applications, 10);

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
        <Section>
            <DefaultBehavior
                loading={ defaultNotificationBehavior.loading }
                defaultBehavior={ defaultNotificationBehavior.payload?.type === 'DefaultNotificationBehavior' ?
                    defaultNotificationBehavior.payload.value :
                    undefined }
                onEdit={ canWriteNotifications ? onEditDefaultAction : undefined }
            />
            <div className={ tableTitleClassName }>Insights notifications event types and behavior</div>
            <NotificationsToolbar
                filters={ notificationsFilter.filters }
                setFilters={ notificationsFilter.setFilters }
                clearFilter={ notificationsFilter.clearFilter }
                appFilterOptions={ props.applications }
                groupBy={ groupBy }
                onGroupBySelected={ groupBySelected }
                onExport={ onExport }
            >
                <NotificationsTable
                    notifications={ notificationRows }
                    onCollapse={ onCollapse }
                    onEdit={ canWriteNotifications ? onEditNotification : undefined }
                />
            </NotificationsToolbar>
            { modalIsOpenState.isOpen && (
                <EditNotificationPage
                    onClose={ closeFormModal }
                    { ...modalIsOpenState }
                />
            ) }
        </Section>
    );
};
