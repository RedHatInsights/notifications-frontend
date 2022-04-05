import { ColumnsMetada, usePrimaryToolbarFilterConfig } from '@redhat-cloud-services/insights-common-typescript';
import produce from 'immer';
import React from 'react';
import { useMemo } from 'react';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from './EventLogFilter';
import { EventLogTreeFilter } from './EventLogTreeFilter';

export interface EventLogCustomFilter {
    bundleId: string,
    category: string,
    chips: Array<{ name: string, value: string, isRead: boolean }>
}

// Wrapper hook that gets the PrimaryToolbarFilterConfig and adds a custom conditional filter using Dropdown/Tree components
// usePrimaryToolbarFilterConfig only supports 3 filter types: checkbox, radio, and text, so this extends that
export const usePrimaryToolbarFilterConfigWrapper = (
    bundles: readonly Schemas.Facet[],
    filters: EventLogFilters,
    setFilters: SetEventLogFilters,
    clearFilter: ClearEventLogFilters,
    metaData: ColumnsMetada<typeof EventLogFilterColumn>
) => {
    const [ customFilters, setCustomFilters ] = React.useState([] as EventLogCustomFilter[]);
    const toolbarConfig = usePrimaryToolbarFilterConfig(
        EventLogFilterColumn,
        filters,
        setFilters,
        clearFilter,
        metaData
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const defaultDelete = React.useMemo(() => toolbarConfig.activeFiltersConfig.onDelete, []);
    toolbarConfig.activeFiltersConfig.onDelete = React.useCallback((
        _event: any,
        rawFilterConfigs: any[]
    ) => {
        try {
            defaultDelete(_event, rawFilterConfigs);
        }
        catch (e) {
            setCustomFilters(produce(prev => {
                const idxToRemove: number[] = [];
                prev.forEach((activeFilter, idx) => {
                    rawFilterConfigs.some(deleteFilter => {
                        if (activeFilter.bundleId === deleteFilter.bundleId) {
                            const deletedChipValues = deleteFilter.chips.map(chip => chip.value);
                            activeFilter.chips = activeFilter.chips.filter(chip => !deletedChipValues.includes(chip.value));

                            if (activeFilter.chips.length === 0) {
                                idxToRemove.push(idx);
                            }

                            return true;
                        }

                        return false;
                    });
                });

                idxToRemove.forEach((indexRemove, idx) => {
                    prev.splice(indexRemove - idx, 1);
                });
            }));
        }
    }, [ defaultDelete, setCustomFilters ]);

    const mapToEventLogCustomFilter = React.useCallback((
        filters: EventLogFilters,
        bundles?: readonly Schemas.Facet[]
    ) => {
        const eventLogCustomFilters = (filters.bundle as string[])?.map(filterBundle => {
            const indexOfBundle = bundles?.findIndex(bundle => bundle.name === filterBundle);
            const bundle = indexOfBundle !== -1 && indexOfBundle !== undefined ? (bundles as Schemas.Facet[])[indexOfBundle] : undefined;

            const bundleDisplayName = bundle?.displayName;
            const applicationChips = (!bundle?.children ?
                [
                    {
                        name: 'Loading',
                        value: filterBundle,
                        isRead: true
                    }
                ]
                :
                (bundle.children.length !== 0 ?
                    bundle?.children?.map(application => ({
                        name: application.displayName,
                        value: application.name,
                        isRead: true
                    }))
                    :
                    [
                        {
                            name: bundle.displayName,
                            value: bundle.name,
                            isRead: true
                        }
                    ]
                )
            );

            return {
                bundleId: filterBundle,
                category: bundleDisplayName || `${filterBundle} Loading...`,
                chips: (filters.application as string[])?.map(filterApplication => {
                    const appDisplayName = bundle?.children?.find(application => application.name === filterApplication)?.displayName;
                    return {
                        name: appDisplayName as string,
                        value: filterApplication,
                        isRead: true
                    };
                }) || applicationChips
            };
        }) || [];

        return eventLogCustomFilters;
    }, []);

    React.useEffect(() => {
        setCustomFilters(mapToEventLogCustomFilter(filters, bundles.length !== 0 ? bundles : undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ bundles, mapToEventLogCustomFilter ]);

    toolbarConfig.filterConfig.items[1] = useMemo(() => {
        return {
            label: 'Application',
            type: 'custom',
            filterValues: {
                children: <EventLogTreeFilter
                    groups={ bundles }
                    placeholder={ 'Filter by Application' }
                    filters={ customFilters }
                    updateFilters={ setCustomFilters }
                />
            }
        } as any;
    }, [ bundles, customFilters ]);

    toolbarConfig.activeFiltersConfig.filters = React.useMemo(() => {
        const activeFilters = toolbarConfig.activeFiltersConfig.filters;
        const nonCustomFilters = activeFilters.filter(activeFilter => !!activeFilter && !(activeFilter as EventLogCustomFilter).bundleId);
        return nonCustomFilters.concat(customFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ filters, customFilters ]);

    const { activeBundles, activeApplications } = React.useMemo(() => {
        // While bundles are empty, assume network request is still pending
        if (bundles.length === 0) {
            return { activeBundles: filters.bundle, activeApplications: filters.application };
        }

        const activeBundles: string[] = [];
        const activeApplications: string[] = [];
        customFilters.forEach(customFilter => {
            activeBundles.push(customFilter.bundleId);

            const bundle = bundles.find(bundle => bundle.name === customFilter.bundleId) as Schemas.Facet;
            const chipValues = customFilter.chips?.map(chip => chip.value) as string[] | undefined;

            if (chipValues && bundle.children?.some(application => !chipValues.includes(application.name))) {
                chipValues.forEach(chipValue => {
                    if (!activeApplications.includes(chipValue)) {
                        activeApplications.push(chipValue);
                    }
                });
            }
        });

        return { activeBundles, activeApplications };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ bundles, customFilters ]);

    setFilters.bundle(activeBundles);
    setFilters.application(activeApplications);

    return toolbarConfig;
};
