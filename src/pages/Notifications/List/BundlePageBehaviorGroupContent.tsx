import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { ExporterType, Filter } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useListNotifications } from '../../../services/useListNotifications';
import { BehaviorGroup, Facet, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupContent } from './useBehaviorGroupContent';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';
import { useNotificationFilter } from './useNotificationFilter';
import { useNotificationPage } from './useNotificationPage';
import { usePage } from '../../../hooks/usePage';
import { NotificationFilters } from '../../../components/Notifications/Filter';
import Config from '../../../config/Config';
import { useCallback } from 'react';
import { EventLogTableColumns, SortDirection } from '../../../components/Notifications/EventLog/EventLogTable';

interface BundlePageBehaviorGroupContentProps {
    applications: Array<Facet>;
    bundle: Facet;
}

const behaviorGroupSectionClassName = style({
    marginBottom: global_spacer_xl.var
});

const noEvents = [];

const useFilterBuilder = (bundle: Facet, appFilterOptions: Array<Facet>) => {
    return useCallback((filters?: NotificationFilters) => {
        const filter = new Filter();
        return filter;
    }, [ bundle, appFilterOptions ]);
};

export const BundlePageBehaviorGroupContent: React.FunctionComponent<BundlePageBehaviorGroupContentProps> = props => {

    const notificationsFilter = useNotificationFilter(props.applications.map(a => a.displayName.toString()));
    const behaviorGroupContent = useBehaviorGroupContent(props.bundle.id);

    const { rbac } = useAppContext();

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

    const filterBuilder = useFilterBuilder(props.bundle, props.applications);
    // sort
    const [ sortDirection, setSortDirection ] = React.useState<SortDirection>('desc');
    const [ sortColumn, setSortColumn ] = React.useState<EventLogTableColumns>(EventLogTableColumns.DATE);

    const notificationsPage = usePage(Config.paging.defaultPerPage, filterBuilder, notificationsFilter, )

    const notificationPage = useNotificationPage(notificationsFilter.debouncedFilters, props.bundle, props.applications, 10);
    const useNotifications = useListNotifications(notificationPage.page);

    const notificationsPageData = React.useMemo(() => {
        const payload = useNotifications.payload;
        if (payload) {

        }

        return emptyPage;
    }, [ useNotifications.payload ]);

    const {
        rows: notificationRows,
        updateBehaviorGroupLink,
        startEditMode,
        finishEditMode,
        cancelEditMode,
        updateBehaviorGroups
    } = useBehaviorGroupNotificationRows(
        useNotifications.payload?.type === 'eventTypesArray' ? useNotifications.payload.value.data : noEvents
    );

    const behaviorGroups = !behaviorGroupContent.isLoading && !behaviorGroupContent.hasError ? behaviorGroupContent.content : undefined;

    React.useEffect(() => {
        if (behaviorGroups) {
            updateBehaviorGroups(behaviorGroups);
        }
    }, [ behaviorGroups, updateBehaviorGroups ]);

    const onBehaviorGroupLinkUpdated = React.useCallback((
        notification: NotificationBehaviorGroup,
        behaviorGroup: BehaviorGroup,
        isLinked: boolean) => {
        if (behaviorGroup) {
            updateBehaviorGroupLink(notification.id, behaviorGroup, isLinked);
        }
    }, [ updateBehaviorGroupLink ]);

    const onStartEditing = React.useCallback((notificationId: UUID) => {
        startEditMode(notificationId);
    }, [ startEditMode ]);

    const onFinishEditing = React.useCallback((notificationId: UUID) => {
        finishEditMode(notificationId);
    }, [ finishEditMode ]);

    const onCancelEditing = React.useCallback((notificationId: UUID) => {
        cancelEditMode(notificationId);
    }, [ cancelEditMode ]);

    return (
        <Section>
            <div className={ behaviorGroupSectionClassName }>
                <BehaviorGroupsSection
                    bundleId={ props.bundle.id }
                    behaviorGroupContent={ behaviorGroupContent }
                />
            </div>
            <NotificationsToolbar
                filters={ notificationsFilter.filters }
                setFilters={ notificationsFilter.setFilters }
                clearFilter={ notificationsFilter.clearFilter }
                appFilterOptions={ props.applications }
                onExport={ onExport }
            >
                <NotificationsBehaviorGroupTable
                    notifications={ notificationRows }
                    behaviorGroupContent={ behaviorGroupContent }
                    onBehaviorGroupLinkUpdated={ onBehaviorGroupLinkUpdated }
                    onStartEditing={ rbac.canWriteNotifications ? onStartEditing : undefined }
                    onFinishEditing={ rbac.canWriteNotifications ? onFinishEditing : undefined }
                    onCancelEditing={ rbac.canWriteNotifications ? onCancelEditing : undefined }
                />
            </NotificationsToolbar>
        </Section>
    );
};
