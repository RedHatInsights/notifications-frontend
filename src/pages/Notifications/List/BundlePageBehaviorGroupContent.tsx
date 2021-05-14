import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useListNotifications } from '../../../services/useListNotifications';
import { Facet } from '../../../types/Notification';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';
import { useNotificationFilter } from './useNotificationFilter';
import { useNotificationPage } from './useNotificationPage';

interface BundlePageBehaviorGroupContentProps {
    applications: Array<Facet>;
    bundle: Facet;
}

const behaviorGroupSectionClassName = style({
    marginBottom: global_spacer_xl.var
});

const emptyArray = [];

export const BundlePageBehaviorGroupContent: React.FunctionComponent<BundlePageBehaviorGroupContentProps> = props => {

    const notificationsFilter = useNotificationFilter(props.applications.map(a => a.displayName.toString()));

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

    const notificationPage = useNotificationPage(notificationsFilter.debouncedFilters, props.bundle, props.applications, 10);
    const useNotifications = useListNotifications(notificationPage.page);
    const {
        rows: notificationRows
    } = useBehaviorGroupNotificationRows(
        useNotifications.payload?.type === 'eventTypesArray' ? useNotifications.payload.value : emptyArray
    );

    return (
        <Section>
            <div className={ behaviorGroupSectionClassName }>
                <BehaviorGroupsSection bundleId={ props.bundle.id } />
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
                />
            </NotificationsToolbar>
        </Section>
    );
};
