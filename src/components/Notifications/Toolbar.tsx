import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ExporterType,
    getInsights,
    OptionalColumnsMetada,
    OuiaComponentProps,
    useInsightsEnvironmentFlag,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useCallback, useMemo } from 'react';

import { PageAdapter } from '../../hooks/usePage';
import { useTableExportConfig } from '../../hooks/useTableExportConfig';
import { isStagingOrProd, stagingAndProd } from '../../types/Environments';
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
    pageAdapter: PageAdapter;
    count: number;

    onExport: (type: ExporterType) => void;
}

export const NotificationsToolbar: React.FunctionComponent<NotificationsToolbarProps> = (props) => {

    const insights = getInsights();
    const filterMetadata = useMemo<OptionalColumnsMetada<typeof NotificationFilterColumn>>(() => {

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
            [NotificationFilterColumn.ACTION]: isStagingOrProd(insights) ? undefined : {
                label: 'Action',
                placeholder: 'Filter by action'
            }
        };
    }, [ props.appFilterOptions, insights ]);

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        NotificationFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilter,
        filterMetadata
    );

    const exportConfigInternal = useTableExportConfig(props.onExport);

    const filterConfig = primaryToolbarFilterConfig.filterConfig;
    const activeFiltersConfig = primaryToolbarFilterConfig.activeFiltersConfig;

    const exportConfig = useInsightsEnvironmentFlag(
        getInsights(),
        stagingAndProd,
        undefined,
        useCallback(() => exportConfigInternal, [ exportConfigInternal ])
    );

    const pageChanged = React.useCallback((_event: unknown, page: number) => {
        const inner = props.pageAdapter.changePage;
        inner(page);
    }, [ props.pageAdapter ]);

    const perPageChanged = React.useCallback((_event: unknown, perPage: number) => {
        const inner = props.pageAdapter.changeItemsPerPage;
        inner(perPage);
    }, [ props.pageAdapter ]);

    const topPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count,
        page: props.pageAdapter.page.index,
        perPage: props.pageAdapter.page.size,
        isCompact: true,
        variant: PaginationVariant.top,
        onSetPage: pageChanged,
        onFirstClick: pageChanged,
        onPreviousClick: pageChanged,
        onNextClick: pageChanged,
        onLastClick: pageChanged,
        onPageInput: pageChanged,
        onPerPageSelect: perPageChanged
    }), [ props.count, props.pageAdapter, pageChanged, perPageChanged ]);

    const bottomPaginationProps = React.useMemo<PaginationProps>(() => ({
        ...topPaginationProps,
        isCompact: false,
        variant: PaginationVariant.bottom
    }), [ topPaginationProps ]);

    return (
        <div { ...getOuiaProps('Notifications/DualToolbar', props) }>
            <PrimaryToolbar
                filterConfig={ filterConfig }
                activeFiltersConfig={ activeFiltersConfig }
                dedicatedAction={ (props.groupBy && props.onGroupBySelected) ?
                    <GroupBy selected={ props.groupBy } groupBy={ props.onGroupBySelected } /> :
                    undefined }
                exportConfig={ exportConfig }
                pagination={ topPaginationProps }
            />
            { props.children }
            <PrimaryToolbar
                pagination={ bottomPaginationProps }
            />
        </div>
    );
};
