import { NotificationFilterColumn, NotificationFilters } from '../../../components/Notifications/Filter';
import {
    arrayValue,
    Filter,
    Operator,
    Page,
    Sort
} from '@redhat-cloud-services/insights-common-typescript';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Schemas } from '../../../generated/OpenapiIntegrations';
import ApplicationFacet = Schemas.ApplicationFacet;

export interface UseNotificationPageReturn {
    page: Page;
    changePage: (page: number) => void;
    changeItemsPerPage: (perPage: number) =>  void;
}

export const useNotificationPage = (
    filters: NotificationFilters,
    appFilterOptions: Array<ApplicationFacet>,
    defaultPerPage: number,
    sort?: Sort): UseNotificationPageReturn => {
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = useState<number>(defaultPerPage);

    useEffect(() => setCurrentPage(1), [ setCurrentPage, filters ]);

    const page = useMemo(() => {
        const filter = new Filter();

        const appFilter = filters[NotificationFilterColumn.APPLICATION];

        if (appFilter) {
            const appIds: Array<string> = [];
            for (const appName of arrayValue(appFilter)) {
                const filterOption = appFilterOptions.find(a => a.label === appName);
                if (filterOption) {
                    appIds.push(filterOption.value);
                }
            }

            filter.and('applicationId', Operator.EQUAL, appIds);
        }

        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, sort, filters, appFilterOptions ]);

    const changePage = useCallback((page: number) => setCurrentPage(page), [ setCurrentPage ]);
    const changeItemsPerPage = useCallback((perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
    }, [ setCurrentPage ]);

    return {
        page,
        changePage,
        changeItemsPerPage
    };
};
