import { Filter, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UsePageReturn {
    page: Page;
    changePage: (page: number) => void;
    changeItemsPerPage: (perPage: number) => void;
}

export type FilterBuilder = (filters: unknown) => Filter | undefined;

export const usePage = (defaultPerPage: number, filterBuilder: FilterBuilder, filters?: unknown, sort?: Sort): UsePageReturn => {
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(defaultPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [ filters, setCurrentPage, itemsPerPage ]);

    const page = useMemo(() => {
        const filter = filterBuilder ? filterBuilder(filters) : undefined;
        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, filters, sort, filterBuilder ]);

    const changePage = useCallback((page: number) => {
        setCurrentPage(page);
    },  [ setCurrentPage ]);

    const changeItemsPerPage = useCallback((perPage: number) => {
        setItemsPerPage(perPage);
    }, [ setItemsPerPage ]);

    return {
        page,
        changePage,
        changeItemsPerPage
    };
};
