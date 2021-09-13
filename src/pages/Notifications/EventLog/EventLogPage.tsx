import { Text, TextContent } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { EventLogDateFilterValue } from '../../../components/Notifications/EventLog/EventLogDateFilter';
import { EventLogFilters } from '../../../components/Notifications/EventLog/EventLogFilter';
import { EventLogTable } from '../../../components/Notifications/EventLog/EventLogTable';
import { EventLogToolbar } from '../../../components/Notifications/EventLog/EventLogToolbar';
import { usePage } from '../../../hooks/usePage';
import { Messages } from '../../../properties/Messages';
import { useGetEvents } from '../../../services/EventLog/GetNotificationEvents';
import { useGetApplications } from '../../../services/Notifications/GetApplications';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { EventPeriod } from '../../../types/Event';
import { useEventLogFilter } from './useEventLogFilter';
import { useFilterBuilder } from './useFilterBuilder';

const RETENTION_DAYS = 14;

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

    const filterBuilder = useFilterBuilder(bundles, applications, dateFilter, period);
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
