import { useEventTypesFilterBuilder } from './useEventTypesFilterBuilder';
import * as React from 'react';
import { SortDirection } from '../../../types/SortDirection';
import { NotificationsTableColumns } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { Direction, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { usePage } from '../../../hooks/usePage';
import Config from '../../../config/Config';
import { Facet } from '../../../types/Notification';
import { useNotificationFilter } from '../List/useNotificationFilter';

export const useEventTypesPage = (bundle: Facet, applications: ReadonlyArray<Facet>, useUrlState: boolean) => {
    const notificationsFilter = useNotificationFilter(applications.map(a => a.displayName.toString()), useUrlState);
    const filterBuilder = useEventTypesFilterBuilder(bundle, applications);

    const [ sorting, setSorting ] = React.useState<{
        sortDirection: SortDirection,
        sortBy: NotificationsTableColumns
    }>({
        sortDirection: SortDirection.DESC,
        sortBy: NotificationsTableColumns.APPLICATION
    });

    const onSort = React.useCallback((column: NotificationsTableColumns, direction: SortDirection) => {
        setSorting({
            sortBy: column,
            sortDirection: direction
        });
    }, [ setSorting ]);

    const sort: Sort = React.useMemo(() => {
        const direction = sorting.sortDirection.toUpperCase() as Direction;
        let column: string;
        switch (sorting.sortBy) {
            case NotificationsTableColumns.APPLICATION:
                column = 'e.application.displayName';
                break;
            case NotificationsTableColumns.EVENT:
                column = 'e.displayName';
                break;
            default:
                throw new Error(`Invalid sorting index: ${sorting.sortBy}`);
        }

        return Sort.by(column, direction);
    }, [ sorting ]);

    const notificationPage = usePage(Config.paging.defaultPerPage, filterBuilder, notificationsFilter.filters, sort);

    return {
        pageController: notificationPage,
        onSort,
        sortBy: sorting.sortBy,
        sortDirection: sorting.sortDirection,
        filters: notificationsFilter.filters,
        setFilters: notificationsFilter.setFilters,
        clearFilters: notificationsFilter.clearFilter
    };
};
