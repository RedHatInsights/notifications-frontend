import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ClearNotificationFilters,
    NotificationFilterColumn,
    NotificationFilters,
    SetNotificationFilters
} from './Filter';
import {
    ColumnsMetada, ExporterType,
    OuiaComponentProps,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { GroupBy } from './Table/GroupBy';
import { GroupByEnum } from './Types';
import { useTableExportConfig } from '../../hooks/useTableExportConfig';

interface NotificationsToolbarProps extends OuiaComponentProps {
    filters: NotificationFilters;
    setFilters: SetNotificationFilters;
    clearFilter: ClearNotificationFilters;

    groupBy: GroupByEnum;
    onGroupBySelected: (selected: GroupByEnum) => void;

    onExport: (type: ExporterType) => void;
}

const filterMetadata: ColumnsMetada<typeof NotificationFilterColumn> = {
    [NotificationFilterColumn.NAME]: {
        label: 'Event',
        placeholder: 'Filter by event name'
    },
    [NotificationFilterColumn.APPLICATION]: {
        label: 'Application',
        placeholder: 'Filter by application'
    },
    [NotificationFilterColumn.ACTION]: {
        label: 'Action',
        placeholder: 'Filter by action'
    },
    [NotificationFilterColumn.RECIPIENT]: {
        label: 'Recipient',
        placeholder: 'Filter by recipient'
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

    const exportConfig = useTableExportConfig(props.onExport);

    return (
        <div { ...getOuiaProps('Notifications/DualToolbar', props) }>
            <PrimaryToolbar
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
                dedicatedAction={ <GroupBy selected={ props.groupBy } groupBy={ props.onGroupBySelected } /> }
                exportConfig={ exportConfig }
            />
            { props.children }
            <PrimaryToolbar/>
        </div>
    );
};
