import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { Facet } from '../../../types/Notification';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useNotificationFilter } from './useNotificationFilter';

interface BundlePageBehaviorGroupContentProps {
    applications: Array<Facet>;
    bundle: Facet;
}

const behaviorGroupSectionClassName = style({
    marginBottom: global_spacer_xl.var
});

export const BundlePageBehaviorGroupContent: React.FunctionComponent<BundlePageBehaviorGroupContentProps> = props => {

    const notificationsFilter = useNotificationFilter(props.applications.map(a => a.displayName.toString()));

    const onExport = React.useCallback((type: ExporterType) => {
        console.log('Export to', type);
    }, []);

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
                Table goes here
            </NotificationsToolbar>
        </Section>
    );
};
