import produce from 'immer';
import React from 'react';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { areEqual } from '../../../utils/Arrays';
import {
  ClearEventLogFilters,
  EventLogFilterColumn,
  EventLogFilters,
  SetEventLogFilters,
} from './EventLogFilter';
import { EventLogTreeFilter } from './EventLogTreeFilter';
import {
  ColumnsMetada,
  usePrimaryToolbarFilterConfig,
} from '../../../utils/insights-common-typescript';

export interface EventLogCustomFilter {
  bundleId: string;
  category: string;
  chips: Array<{ name: string; value: string; isRead: boolean }>;
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
  const [customFilters, setCustomFilters] = React.useState(
    [] as EventLogCustomFilter[]
  );
  const toolbarConfig = usePrimaryToolbarFilterConfig(
    EventLogFilterColumn,
    filters,
    setFilters,
    clearFilter,
    metaData
  );

  const defaultDelete = React.useMemo(
    () => toolbarConfig.activeFiltersConfig.onDelete,
    [toolbarConfig.activeFiltersConfig.onDelete]
  );
  const customDelete = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: any, rawFilterConfigs: EventLogCustomFilter[]) => {
      const regularFilterConfigs: EventLogCustomFilter[] = [];
      const customFilterConfigs: EventLogCustomFilter[] = [];
      rawFilterConfigs.forEach((filterConfig) => {
        if (filterConfig.bundleId) {
          customFilterConfigs.push(filterConfig);
        } else {
          regularFilterConfigs.push(filterConfig);
        }
      });

      defaultDelete(_event, regularFilterConfigs);

      if (customFilterConfigs.length !== 0) {
        setCustomFilters(
          produce((prev) => {
            const idxToRemove: number[] = [];
            prev.forEach((activeFilter, idx) => {
              customFilterConfigs.some((deleteFilter) => {
                if (activeFilter.bundleId === deleteFilter.bundleId) {
                  const deletedChipValues = deleteFilter.chips.map(
                    (chip) => chip.value
                  );
                  activeFilter.chips = activeFilter.chips.filter(
                    (chip) => !deletedChipValues.includes(chip.value)
                  );

                  if (activeFilter.chips.length === 0) {
                    idxToRemove.push(idx);
                  }

                  return true;
                }

                return false;
              });
            });

            idxToRemove.forEach((idx, adjusted) => {
              prev.splice(idx - adjusted, 1);
            });
          })
        );
      }
    },
    [defaultDelete, setCustomFilters]
  );

  // Converts URL Query Params to Filter Obj
  const mapToEventLogCustomFilter = React.useCallback(
    (filters: EventLogFilters, bundles?: readonly Schemas.Facet[]) => {
      const createCustomFilterObj = (
        bundleName: string,
        bundle: Schemas.Facet | undefined,
        applications: Schemas.Facet[] | undefined | null
      ) => {
        const bundleDisplayName = bundle?.displayName;
        const applicationChips = !bundle?.children
          ? [
              {
                name: 'Loading',
                value: bundleName,
                isRead: true,
              },
            ]
          : applications?.length !== 0
          ? applications?.map((application) => ({
              name: application.displayName,
              value: application.name,
              isRead: true,
            }))
          : [
              {
                name: bundle.displayName,
                value: bundle.name,
                isRead: true,
              },
            ];

        return {
          bundleId: bundleName,
          category: bundleDisplayName || `${bundleName} Loading...`,
          chips: applicationChips,
        };
      };

      const applicationsByBundle: { [key: string]: string[] } = {};
      (filters.service as string[])?.forEach((queryParam) => {
        const nameSplit = queryParam.split('.');
        const bundleName = nameSplit[0];
        const service = nameSplit[1];

        if (!applicationsByBundle[bundleName]) {
          applicationsByBundle[bundleName] = [service];
        } else {
          applicationsByBundle[bundleName].push(service);
        }
      });

      const partialBundleFilters = Object.keys(applicationsByBundle).map(
        (bundleName) => {
          const bundle = bundles?.find((bundle) => bundle.name === bundleName);
          const applications = bundle?.children?.filter((application) =>
            applicationsByBundle[bundleName].includes(application.name)
          );
          return createCustomFilterObj(bundleName, bundle, applications);
        }
      );

      const completeBundleFilters =
        (filters.bundle as string[])?.map((queryParam) => {
          const bundle = bundles?.find((bundle) => bundle.name === queryParam);
          return createCustomFilterObj(queryParam, bundle, bundle?.children);
        }) || [];

      return completeBundleFilters.concat(
        partialBundleFilters
      ) as EventLogCustomFilter[];
    },
    []
  );

  // Run ONLY twice
  //     1st - setup loading placeholders for filters
  //     2nd - render actual filter bundles/applications
  React.useEffect(() => {
    setCustomFilters(
      mapToEventLogCustomFilter(
        filters,
        bundles.length !== 0 ? bundles : undefined
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundles, mapToEventLogCustomFilter]);

  const applicationFilter = React.useMemo(() => {
    return {
      label: 'Service',
      type: 'custom',
      filterValues: {
        children: (
          <EventLogTreeFilter
            groups={bundles}
            placeholder={'Filter by service'}
            filters={customFilters}
            updateFilters={setCustomFilters}
          />
        ),
      },
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [bundles, customFilters]);

  const activeFiltersConfig = React.useMemo(() => {
    const activeFilters = toolbarConfig.activeFiltersConfig
      .filters as EventLogCustomFilter[];
    const nonCustomFilters = activeFilters.filter(
      (activeFilter) =>
        activeFilter &&
        !activeFilter.bundleId &&
        activeFilter.category !== 'Service'
    );
    return nonCustomFilters.concat(customFilters);
  }, [customFilters, toolbarConfig.activeFiltersConfig.filters]);

  // Update URL Query Params for Bundles
  const bundleProducer = React.useMemo(() => {
    return produce(filters.bundle, (prev) => {
      if (bundles.length === 0) {
        return;
      }

      const currBundleFilters: string[] = [];
      bundles.forEach((bundle) => {
        const addToQueryParam = customFilters.some((bundleFilter) => {
          if (bundleFilter.bundleId === bundle.name) {
            // Edge case: Bundle has no children (but it gets a chip for UI reasons)
            if (
              bundle.children?.length === 0 &&
              bundleFilter.chips.length === 1
            ) {
              return true;
            }

            return bundle.children?.length === bundleFilter.chips.length;
          }

          return false;
        });

        if (addToQueryParam) {
          currBundleFilters.push(bundle.name);
        }
      });

      return areEqual(prev as string[], currBundleFilters, true)
        ? prev
        : currBundleFilters;
    });
  }, [bundles, filters.bundle, customFilters]);

  // Update URL Query Params for Applications
  const applicationProducer = React.useMemo(() => {
    return produce(filters.service, (prev) => {
      if (bundles.length === 0) {
        return;
      }

      const currApplicationFilters: string[] = [];
      customFilters.forEach((customFilter) => {
        const bundle = bundles.find(
          (bundle) => bundle.name === customFilter.bundleId
        ) as Schemas.Facet;
        const chipValues = customFilter.chips?.map((chip) => chip.value) as
          | string[]
          | undefined;

        // Only add applications to Query Params under 2 conditions
        //     1. Bundle has children
        //     2. Every application under the Bundle is not selected
        if (
          chipValues &&
          bundle.children?.some(
            (application) => !chipValues.includes(application.name)
          )
        ) {
          chipValues.forEach((chipValue) => {
            const applicationQueryParam = `${bundle.name}.${chipValue}`;
            currApplicationFilters.push(applicationQueryParam);
          });
        }
      });

      return areEqual(prev as string[], currApplicationFilters, true)
        ? prev
        : currApplicationFilters;
    });
  }, [bundles, filters.service, customFilters]);

  setFilters.bundle(bundleProducer);
  setFilters.service(applicationProducer);

  return produce(toolbarConfig, (prev) => {
    prev.filterConfig.items[1] = applicationFilter;

    prev.activeFiltersConfig.filters = activeFiltersConfig;
    prev.activeFiltersConfig.onDelete = customDelete;
  });
};
