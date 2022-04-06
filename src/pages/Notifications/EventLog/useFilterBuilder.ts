import { Filter, Operator, toUtc } from '@redhat-cloud-services/insights-common-typescript';
import { format, sub, toDate } from 'date-fns';
import { useCallback } from 'react';

import { EventLogDateFilterValue } from '../../../components/Notifications/EventLog/EventLogDateFilter';
import { EventLogFilters } from '../../../components/Notifications/EventLog/EventLogFilter';
import { EventPeriod } from '../../../types/Event';
import { Facet } from '../../../types/Notification';

const DATE_FORMAT = 'yyyy-MM-dd';

export const useFilterBuilder = (
    bundles: ReadonlyArray<Facet>,
    dateFilter: EventLogDateFilterValue,
    period: EventPeriod) => {
    return useCallback((filters?: EventLogFilters) => {
        const filter = new Filter();
        if (filters?.bundle) {
            const selectedBundleNames = filters?.bundle;
            const queryParams = bundles.filter(b => selectedBundleNames.includes(b.name)).map(b => b.id);
            filter.and('bundleIds', Operator.EQUAL, queryParams);
        }

        if (filters?.application) {
            const selectedAppNames = filters.application as string[];

            const queryParams: string[] = [];
            selectedAppNames.forEach(appName => {
                const nameSplit = appName.split('.');
                const bundleName = nameSplit[0];
                const applicationName = nameSplit[1];

                const bundle = bundles.find(bundle => bundle.name === bundleName);
                if (bundle) {
                    const application = bundle.children?.find(application => application.name === applicationName);
                    if (application) {
                        queryParams.push(application.id);
                    }
                }
            });

            filter.and('appIds', Operator.EQUAL, queryParams);
        }

        if (filters?.event) {
            filter.and('event', Operator.EQUAL, filters.event);
        }

        let filterPeriod = [ undefined, undefined ] as [ Date | undefined, Date | undefined ];
        const today = toUtc(new Date());

        switch (dateFilter) {
            case EventLogDateFilterValue.LAST_14:
                filterPeriod = [ sub(toDate(today), {
                    days: 14
                }), today ];
                break;
            case EventLogDateFilterValue.LAST_7:
                filterPeriod = [ sub(toDate(today), {
                    days: 7
                }), today ];
                break;
            case EventLogDateFilterValue.TODAY:
                filterPeriod = [ today, today ];
                break;
            case EventLogDateFilterValue.YESTERDAY:
                const yesterday = sub(toDate(today), {
                    days: 1
                });
                filterPeriod = [ yesterday, yesterday ];
                break;
            case EventLogDateFilterValue.CUSTOM:
                filterPeriod = period;
                break;
        }

        if (filterPeriod[0] && filterPeriod[1]) {
            filter.and('start', Operator.EQUAL, format(filterPeriod[0], DATE_FORMAT));
            filter.and('end', Operator.EQUAL, format(filterPeriod[1], DATE_FORMAT));
        }

        return filter;
    }, [ bundles, dateFilter, period ]);
};
