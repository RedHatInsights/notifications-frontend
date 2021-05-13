import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    ExporterType,
    getInsights,
    OuiaComponentProps,
    useInsightsEnvironmentFlag,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useCallback, useMemo } from 'react';

import { useTableExportConfig } from '../../hooks/useTableExportConfig';
import { stagingAndProd } from '../../types/Environments';
import { Facet } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import {
    ClearNotificationFilters,
    NotificationFilterColumn,
    NotificationFilters,
    SetNotificationFilters
} from './Filter';
import { GroupBy } from './Table/GroupBy';
import { GroupByEnum } from './Types';

interface NotificationsToolbarProps extends OuiaComponentProps {
    filters: NotificationFilters;
    setFilters: SetNotificationFilters;
    clearFilter: ClearNotificationFilters;

    appFilterOptions: Array<Facet>;

    groupBy?: GroupByEnum;
    onGroupBySelected?: (selected: GroupByEnum) => void;

    onExport: (type: ExporterType) => void;
}

export const NotificationsToolbar: React.FunctionComponent<NotificationsToolbarProps> = (props) => {

    const filterMetadata = useMemo<ColumnsMetada<typeof NotificationFilterColumn>>(() => {

        const appFilterItems = props.appFilterOptions.map(a => ({
            value: a.displayName,
            label: <> {a.displayName}</>
        }));

        return {
            [NotificationFilterColumn.NAME]: {
                label: 'Event type',
                placeholder: 'Filter by event type'
            },
            [NotificationFilterColumn.APPLICATION]: {
                label: 'Application',
                placeholder: 'Filter by application',
                options: {
                    exclusive: false,
                    default: [] as any,
                    items: appFilterItems
                }
            },
            [NotificationFilterColumn.ACTION]: {
                label: 'Action',
                placeholder: 'Filter by action'
            }
        };
    }, [ props.appFilterOptions ]);

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
        stagingAndProd,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.filterConfig, [ primaryToolbarFilterConfig ])
    );

    const activeFiltersConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingAndProd,
        undefined,
        useCallback(() => primaryToolbarFilterConfig.activeFiltersConfig, [ primaryToolbarFilterConfig ])
    );

    const exportConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingAndProd,
        undefined,
        useCallback(() => exportConfigInternal, [ exportConfigInternal ])
    );

    return (
        <div { ...getOuiaProps('Notifications/DualToolbar', props) }>
            <PrimaryToolbar
                filterConfig={ filterConfig }
                activeFiltersConfig={ activeFiltersConfig }
                dedicatedAction={ (props.groupBy && props.onGroupBySelected) ?
                    <GroupBy selected={ props.groupBy } groupBy={ props.onGroupBySelected } /> :
                    undefined }
                exportConfig={ exportConfig }
            />
            { props.children }
            <PrimaryToolbar />
        </div>
    );
};
