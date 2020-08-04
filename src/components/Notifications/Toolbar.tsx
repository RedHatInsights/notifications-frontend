import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ClearNotificationFilters,
    NotificationFilterColumn,
    NotificationFilters,
    SetNotificationFilters
} from './Filter';
import { ColumnsMetada, usePrimaryToolbarFilterConfig } from '../../hooks/usePrimaryToolbarFilterConfig';

interface NotificationsToolbarProps {
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
        <>
            <PrimaryToolbar
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFilterConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
            />
            { props.children }
            <PrimaryToolbar/>
        </>
    );
};
