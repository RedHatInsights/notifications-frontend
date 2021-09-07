import { Text, TextContent } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { EventLogDateFilterValue } from '../../../components/Notifications/EventLog/EventLogDateFilter';
import { EventLogTable } from '../../../components/Notifications/EventLog/EventLogTable';
import { EventLogToolbar } from '../../../components/Notifications/EventLog/EventLogToolbar';
import { Messages } from '../../../properties/Messages';
import { useGetApplications } from '../../../services/Notifications/GetApplications';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { EventPeriod } from '../../../types/Event';
import { useEventLogFilter } from './useEventLogFilter';
import { useGetEvents } from '../../../services/EventLog/GetNotificationEvents';
import { usePage } from '../../../hooks/usePage';
import { EventLogFilters } from '../../../components/Notifications/EventLog/EventLogFilter';
import { Filter, Operator, toUtc } from '@redhat-cloud-services/insights-common-typescript';
import { format, sub, toDate } from 'date-fns';

const RETENTION_DAYS = 14;
const DATE_FORMAT = 'yyyy-MM-dd';

export const EventLogPage: React.FunctionComponent = () => {

    const getBundles = useGetBundles();
    const bundles = React.useMemo(() => {
        const payload = getBundles.payload;
        if (payload?.status === 200) {
            return payload.value;
        }

        return [];
    }, [ getBundles.payload ]);

    const getApplications = useGetApplications();
    const applications = React.useMemo(() => {
        const payload = getApplications.payload;
        if (payload?.status === 200) {
            return payload.value;
        }

        return [];
    }, [ getApplications.payload ]);

    const [ dateFilter, setDateFilter ] = React.useState<EventLogDateFilterValue>(EventLogDateFilterValue.LAST_14);

    const eventLogFilters = useEventLogFilter();

    const [ period, setPeriod ] = React.useState<EventPeriod>([ undefined, undefined ]);

    const filterBuilder = React.useCallback((filters?: EventLogFilters) => {
        const filter = new Filter();
        if (filters?.bundle) {
            const selectedBundleNames = filters?.bundle;
            const selectedBundles = bundles.filter(b => selectedBundleNames.includes(b.name)).map(b => b.id);
            filter.and('bundleIds', Operator.EQUAL, selectedBundles);
        }

        if (filters?.application) {
            const selectedAppNames = filters?.application;
            const selectedApps = applications.filter(a => selectedAppNames.includes(a.name)).map(a => a.id);
            filter.and('appIds', Operator.EQUAL, selectedApps);
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
                filterPeriod = [ sub(toDate(today), {
                    days: 1
                }), today ];
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
    }, [ bundles, applications, dateFilter, period ]);

    const eventsPage = usePage<EventLogFilters>(10, filterBuilder, eventLogFilters.filters);

    const eventsQuery = useGetEvents(eventsPage.page);

    const events = React.useMemo(() => {
        if (eventsQuery.payload?.status === 200) {
            return {
                data: eventsQuery.payload.value.data,
                count: eventsQuery.payload.value.meta.count
            };
        }

        return {
            data: [],
            count: 0
        };
    }, [ eventsQuery ]);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.notifications.eventLog.title } />
                <TextContent>
                    <Text>{ Messages.pages.notifications.eventLog.subtitle }</Text>
                </TextContent>
            </PageHeader>
            <Main>
                <EventLogToolbar
                    { ...eventLogFilters }
                    bundleOptions={ bundles }
                    applicationOptions={ applications }
                    dateFilter={ dateFilter }
                    setDateFilter={ setDateFilter }
                    count={ events.count }
                    perPageChanged={ eventsPage.changeItemsPerPage }
                    pageChanged={ eventsPage.changePage }
                    perPage={ eventsPage.page.size }
                    page={ eventsPage.page.index }
                    pageCount={ events.data.length }
                    retentionDays={ RETENTION_DAYS }
                    period={ period }
                    setPeriod={ setPeriod }
                >
                    <EventLogTable events={ events.data } loading={ eventsQuery.loading } />
                </EventLogToolbar>
            </Main>
        </>
    );
};
