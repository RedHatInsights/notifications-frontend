import { ColumnsMetada, usePrimaryToolbarFilterConfig } from '@redhat-cloud-services/insights-common-typescript';
import React from 'react';
import { useMemo } from 'react';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { EventLogTreeFilter } from './EventLogTreeFilter';

export interface EventLogCustomFilter {
    category: string,
    chips: Array<{ name: string, value: string, isRead: boolean }>
}

// Wrapper hook that gets the PrimaryToolbarFilterConfig and adds a custom conditional filter using Dropdown/Tree components
// usePrimaryToolbarFilterConfig only supports 3 filter types: checkbox, radio, and text, so this extends that
export const usePrimaryToolbarFilterConfigWrapper = (
    bundles: readonly Schemas.Facet[],
    applications: readonly Schemas.Facet[],
    filters: EventLogFilters,
    setFilters: SetEventLogFilters,
    clearFilter: ClearEventLogFilters,
    metaData: ColumnsMetada<typeof EventLogFilterColumn>
) => {
    const [ customFilter, setCustomFilter ] = React.useState({} as EventLogCustomFilter);

    const toolbarConfig = usePrimaryToolbarFilterConfig(
        EventLogFilterColumn,
        filters,
        setFilters,
        clearFilter,
        metaData
    );

    const applicationFilterConfig = useMemo(() => {
        return {
            label: 'Application',
            type: 'custom',
            filterValues: {
                children: <EventLogTreeFilter
                    groups={ bundles }
                    items={ applications }
                    placeholder={ 'Filter by Application' }
                    updateFilter={ setCustomFilter }
                />
            }
        };
    }, [ bundles, applications ]);

    toolbarConfig.filterConfig.items[1] = applicationFilterConfig as any;
    console.log(customFilter);

    return toolbarConfig;
};
