import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useListNotifications } from '../../../services/useListNotifications';
import { BehaviorGroup, Facet, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import { useEventTypesPage } from '../hooks/useEventTypesPage';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupContent } from './useBehaviorGroupContent';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';

interface BundlePageBehaviorGroupContentProps {
    applications: Array<Facet>;
    bundle: Facet;
}

const behaviorGroupSectionClassName = style({
    marginBottom: global_spacer_xl.var
});

const noEvents = [];

export const BundlePageBehaviorGroupContent: React.FunctionComponent<BundlePageBehaviorGroupContentProps> = props => {
    const behaviorGroupContent = useBehaviorGroupContent(props.bundle.id);

    const { rbac } = useAppContext();

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

    const eventTypePage = useEventTypesPage(props.bundle, props.applications, true);

    const useNotifications = useListNotifications(eventTypePage.pageController.page);

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
                    bundle={ props.bundle }
                    applications={ props.applications }
                    behaviorGroupContent={ behaviorGroupContent }
                />
            </div>
            <NotificationsToolbar
                filters={ eventTypePage.filters }
                setFilters={ eventTypePage.setFilters }
                clearFilter={ eventTypePage.clearFilters }
                appFilterOptions={ props.applications }
                onExport={ onExport }
                count={ count }
                pageAdapter={ eventTypePage.pageController }
            >
                <NotificationsBehaviorGroupTable
                    notifications={ notificationRows }
                    behaviorGroupContent={ behaviorGroupContent }
                    onBehaviorGroupLinkUpdated={ onBehaviorGroupLinkUpdated }
                    onStartEditing={ rbac.canWriteNotifications ? onStartEditing : undefined }
                    onFinishEditing={ rbac.canWriteNotifications ? onFinishEditing : undefined }
                    onCancelEditing={ rbac.canWriteNotifications ? onCancelEditing : undefined }
                    onSort={ eventTypePage.onSort }
                    sortBy={ eventTypePage.sortBy }
                    sortDirection={ eventTypePage.sortDirection }
                />
            </NotificationsToolbar>
        </Section>
    );
};
