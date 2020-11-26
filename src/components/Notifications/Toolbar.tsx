import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ClearNotificationFilters,
    NotificationFilterColumn,
    NotificationFilters,
    SetNotificationFilters
} from './Filter';
import {
    ColumnsMetada, ExporterType, getInsights,
    OuiaComponentProps, useInsightsEnvironmentFlag,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { GroupBy } from './Table/GroupBy';
import { GroupByEnum } from './Types';
import { useTableExportConfig } from '../../hooks/useTableExportConfig';
import { stagingBetaAndProdBetaEnvironment } from '../../types/Environments';
import { useCallback } from 'react';

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

    const exportConfigInternal = useTableExportConfig(props.onExport);

    const filterConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingBetaAndProdBetaEnvironment,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.filterConfig, [ primaryToolbarFilterConfig ])
    );

    const activeFiltersConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingBetaAndProdBetaEnvironment,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.activeFiltersConfig, [ primaryToolbarFilterConfig ])
    );

    const exportConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingBetaAndProdBetaEnvironment,
        undefined,
        useCallback(() => exportConfigInternal, [ exportConfigInternal ])
    );

    return (
        <div { ...getOuiaProps('Notifications/DualToolbar', props) }>
            <PrimaryToolbar
                filterConfig={ filterConfig }
                activeFiltersConfig={ activeFiltersConfig }
                dedicatedAction={ <GroupBy selected={ props.groupBy } groupBy={ props.onGroupBySelected } /> }
                exportConfig={ exportConfig }
            />
            { props.children }
            <PrimaryToolbar/>
        </div>
    );
};
