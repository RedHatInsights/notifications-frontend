import { ClearFilterElement, ColumnsMetada, usePrimaryToolbarFilterConfig } from '@redhat-cloud-services/insights-common-typescript';
import produce from 'immer';
import { filter, fromPairs } from 'lodash';
import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { useMount } from 'react-use';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { EventLogTreeFilter } from './EventLogTreeFilter';

export interface EventLogCustomFilter {
    bundleId: string,
    category: string,
    chips: Array<{ name: string, value: string, isRead: boolean }>
}

const initFiltersFromUrl = (
    bundles: readonly Schemas.Facet[], 
    applications: readonly Schemas.Facet[], 
    filters: EventLogFilters
): EventLogCustomFilter[] => {
    if(!filters.bundle) {
        return []
    }

    return (filters.bundle as []).map(filterBundle => {
        const bundleDisplayName = bundles.filter(bundle => bundle.name === filterBundle)[0].name
        return {
            bundleId: filterBundle,
            category: bundleDisplayName,
            chips: (filters.application as []).map(filterApplication => {
                const applicationDisplayName = applications.filter(application => application.name === filterApplication)[0].name
                return {
                    name: applicationDisplayName,
                    value: filterApplication,
                    isRead: true,
                }
            })
        }
    })
}

const onDelete = (
    defaultDelete: (_event: any, rawFilterConfigs: any[]) => void, 
    clearFilter: ClearEventLogFilters,
    customFilters: EventLogCustomFilter[], 
    setCustomFilters: React.Dispatch<React.SetStateAction<EventLogCustomFilter[]>>
) => {
    return (_event, rawFilterConfigs: any[]) => {
        try {
            defaultDelete(_event, rawFilterConfigs)
        }
        catch(e) {
            const toClear: ClearFilterElement<any> = {
                bundle: [],
                application: [],
            };
            
            // To remove a application, ensure no other bundle is using that application
            // To remove a bundle, all the applications must be cleared for that specific bundle
            const bundleIds: string[] = []
            const chips: any[][] = []
            rawFilterConfigs.forEach(filterConfig => {
                bundleIds.push(filterConfig.bundleId)
                chips.push(filterConfig.chips)
            })
            
            customFilters.forEach(customFilter => {
                const idx = bundleIds.findIndex(id => id === customFilter.bundleId)
                const removeBundle = customFilter.chips.every(chip => chips[idx].includes(chip))
                if(removeBundle) {
                    (toClear.bundle as string[]).push(customFilter.bundleId) 
                }
            })

            // use clearFilter and setCustomFilters
            clearFilter(toClear)
        }
    }
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
    //initFiltersFromUrl(bundles, applications, filters)
    const [ customFilters, setCustomFilters ] = React.useState([] as EventLogCustomFilter[]);

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
                    filters={filters}
                    updateFilter={ setCustomFilters }
                />
            }
        };
    }, [ bundles, applications ]);

    const activeFilters = React.useMemo(() => {
        const nonCustomFilters = toolbarConfig.activeFiltersConfig.filters.filter(activeFilter => !!activeFilter && !(activeFilter as EventLogCustomFilter).bundleId)
        return nonCustomFilters.concat(customFilters)
    }, [customFilters])

    const { activeBundles, activeApplications } = React.useMemo(() => {
        const activeBundles: string[] = []
        const activeApplications: string[] = []
        customFilters.forEach(customFilter => {
            activeBundles.push(customFilter.bundleId)

            customFilter.chips.forEach(chip => {
                if(!activeApplications.includes(chip.value)) {
                    activeApplications.push(chip.value)
                }
            })
        })

        return { activeBundles, activeApplications }
    }, [customFilters])

    setFilters.bundle(activeBundles)
    setFilters.application(activeApplications)

    toolbarConfig.filterConfig.items[1] = applicationFilterConfig as any;
    toolbarConfig.activeFiltersConfig.filters = activeFilters

    const defaultDelete = toolbarConfig.activeFiltersConfig.onDelete
    toolbarConfig.activeFiltersConfig.onDelete = onDelete(defaultDelete, clearFilter, customFilters, setCustomFilters)

    return toolbarConfig;
};
