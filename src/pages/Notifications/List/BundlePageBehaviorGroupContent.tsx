import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { arrayValue, Direction, ExporterType, Filter, Operator, Sort, stringValue } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useCallback } from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { NotificationFilterColumn, NotificationFilters } from '../../../components/Notifications/Filter';
import { NotificationsBehaviorGroupTable, NotificationsTableColumns } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import Config from '../../../config/Config';
import { usePage } from '../../../hooks/usePage';
import { useListNotifications } from '../../../services/useListNotifications';
import { BehaviorGroup, Facet, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import { SortDirection } from '../../../types/SortDirection';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupContent } from './useBehaviorGroupContent';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';
import { useNotificationFilter } from './useNotificationFilter';

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

        const appFilter = filters && filters[NotificationFilterColumn.APPLICATION];

        if (appFilter) {
            const appIds: Array<string> = [];
            for (const appName of arrayValue(appFilter)) {
                const filterOption = appFilterOptions.find(a => a.displayName === appName);
                if (filterOption) {
                    appIds.push(filterOption.id);
                }
            }

            filter.and('applicationId', Operator.EQUAL, appIds);
        }

        filter.and('bundleId', Operator.EQUAL, bundle.id);

        const eventTypeFilter = filters && filters[NotificationFilterColumn.NAME];
        if (eventTypeFilter) {
            const eventTypeFilterName = stringValue(eventTypeFilter);
            filter.and('eventFilterName', Operator.EQUAL, eventTypeFilterName);
        }

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

    const [ sorting, setSorting ] = React.useState<{
        sortDirection: SortDirection,
        sortBy: NotificationsTableColumns
    }>({
        sortDirection: SortDirection.DESC,
        sortBy: NotificationsTableColumns.APPLICATION
    });

    const onSort = React.useCallback((column: NotificationsTableColumns, direction: SortDirection) => {
        setSorting({
            sortBy: column,
            sortDirection: direction
        });
    }, [ setSorting ]);

    const sort: Sort = React.useMemo(() => {
        // Todo: Unify this sorting mess into a less verbose stuff
        const direction = sorting.sortDirection.toUpperCase() as Direction;
        let column: string;
        switch (sorting.sortBy) {
            case NotificationsTableColumns.APPLICATION:
                column = 'e.application.displayName';
                break;
            case NotificationsTableColumns.EVENT:
                column = 'e.displayName';
                break;
            default:
                throw new Error(`Invalid sorting index: ${sorting.sortBy}`);
        }

        return Sort.by(column, direction);
    }, [ sorting ]);

    const notificationPage = usePage(Config.paging.defaultPerPage, filterBuilder, notificationsFilter.filters, sort);

    const useNotifications = useListNotifications(notificationPage.page);

    const count = React.useMemo(() => {
        const payload = useNotifications.payload;
        if (payload?.status === 200) {
            return payload.value.meta.count;
        }

        return 0;
    }, [ useNotifications.payload ]);

    const {
        rows: notificationRows,
        updateBehaviorGroupLink,
        startEditMode,
        finishEditMode,
        cancelEditMode,
        updateBehaviorGroups
    } = useBehaviorGroupNotificationRows(
        !useNotifications.loading && useNotifications.payload?.type === 'eventTypesArray' ? useNotifications.payload.value.data : noEvents
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
                count={ count }
                pageAdapter={ notificationPage }
            >
                <NotificationsBehaviorGroupTable
                    notifications={ notificationRows }
                    behaviorGroupContent={ behaviorGroupContent }
                    onBehaviorGroupLinkUpdated={ onBehaviorGroupLinkUpdated }
                    onStartEditing={ rbac.canWriteNotifications ? onStartEditing : undefined }
                    onFinishEditing={ rbac.canWriteNotifications ? onFinishEditing : undefined }
                    onCancelEditing={ rbac.canWriteNotifications ? onCancelEditing : undefined }
                    onSort={ onSort }
                    sortBy={ sorting.sortBy }
                    sortDirection={ sorting.sortDirection }
                />
            </NotificationsToolbar>
        </Section>
    );
};
