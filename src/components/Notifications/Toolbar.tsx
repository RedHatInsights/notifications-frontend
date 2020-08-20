import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ClearNotificationFilters,
    NotificationFilterColumn,
    NotificationFilters,
    SetNotificationFilters
} from './Filter';
import {
    ColumnsMetada,
    OuiaComponentProps,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';

interface NotificationsToolbarProps extends OuiaComponentProps {
    filters: NotificationFilters;
    setFilters: SetNotificationFilters;
    clearFilter: ClearNotificationFilters;
}

const filterMetadata: ColumnsMetada<typeof NotificationFilterColumn> = {
    [NotificationFilterColumn.NAME]: {
        label: 'Name',
        placeholder: 'Filter by name'
    }
};

export const NotificationsToolbar: React.FunctionComponent<NotificationsToolbarProps> = (props) => {
    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        NotificationFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata
    );

    return (
        <div { ...getOuiaProps('Notifications/DualToolbar', props) }>
            <PrimaryToolbar
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
            />
            { props.children }
            <PrimaryToolbar/>
        </div>
    );
};
