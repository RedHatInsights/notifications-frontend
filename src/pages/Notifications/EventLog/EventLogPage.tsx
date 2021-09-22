import { Split, SplitItem, Text, TextContent } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Direction, Sort } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { style } from 'typestyle';

import { ButtonLink } from '../../../components/ButtonLink';
import { EventLogDateFilterValue } from '../../../components/Notifications/EventLog/EventLogDateFilter';
import { EventLogFilters } from '../../../components/Notifications/EventLog/EventLogFilter';
import {
    EventLogTable,
    EventLogTableColumns,
    SortDirection
} from '../../../components/Notifications/EventLog/EventLogTable';
import { EventLogToolbar } from '../../../components/Notifications/EventLog/EventLogToolbar';
import Config from '../../../config/Config';
import { usePage } from '../../../hooks/usePage';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { useGetEvents } from '../../../services/EventLog/GetNotificationEvents';
import { useGetApplications } from '../../../services/Notifications/GetApplications';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { EventPeriod } from '../../../types/Event';
import { useEventLogFilter } from './useEventLogFilter';
import { useFilterBuilder } from './useFilterBuilder';

const RETENTION_DAYS = 14;

const subtitleClassName = style({
    paddingTop: global_spacer_sm.value
});

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

    const [ sortDirection, setSortDirection ] = React.useState<SortDirection>('desc');
    const [ sortColumn, setSortColumn ] = React.useState<EventLogTableColumns>(EventLogTableColumns.DATE);

    const onSort = React.useCallback((column: EventLogTableColumns, direction: SortDirection) => {
        setSortDirection(direction);
        setSortColumn(column);
    }, [ setSortDirection, setSortColumn ]);

    const filterBuilder = useFilterBuilder(bundles, applications, dateFilter, period);

    const sort: Sort = React.useMemo(() => {
        const direction = sortDirection.toUpperCase() as Direction;
        let column: string;
        if (sortColumn === EventLogTableColumns.DATE) {
            column = 'created';
        } else {
            throw new Error(`Invalid sorting index: ${sortColumn}`);
        }

        return Sort.by(column, direction);
    }, [ sortColumn, sortDirection ]);

    const eventsPage = usePage<EventLogFilters>(Config.paging.defaultPerPage, filterBuilder, eventLogFilters.filters, sort);

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

    const eventNotificationPageUrl = React.useMemo(() => {
        const bundles = eventLogFilters.filters.bundle as Array<string> | undefined;
        if (bundles && bundles.length > 0) {
            return linkTo.notifications(bundles[0]);
        }

        return linkTo.notifications('');
    }, [ eventLogFilters.filters ]);

    return (
        <>
            <PageHeader>
                <Split>
                    <SplitItem isFilled>
                        <PageHeaderTitle title={ Messages.pages.notifications.eventLog.title } />
                        <TextContent className={ subtitleClassName }>
                            <Text>{ Messages.pages.notifications.eventLog.subtitle }</Text>
                        </TextContent>
                    </SplitItem>
                    <SplitItem>
                        <Link component={ ButtonLink } to={ eventNotificationPageUrl } >
                            { Messages.pages.notifications.eventLog.viewNotifications }
                        </Link>
                    </SplitItem>
                </Split>
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
                    <EventLogTable
                        events={ events.data }
                        loading={ eventsQuery.loading }
                        onSort={ onSort }
                        sortColumn={ sortColumn }
                        sortDirection={ sortDirection }
                    />
                </EventLogToolbar>
            </Main>
        </>
    );
};
