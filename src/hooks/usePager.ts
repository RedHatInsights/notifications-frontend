import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';

type ChangePage = (page: number) => void;
type ChangeItemsPerPage = (page: number) => void;

export interface Pager {
    page: Page;
    changePage: ChangePage;
    changeItemsPerPage: ChangeItemsPerPage;
}

const INITIAL_PAGE = 0;

export const usePager = (defaultPerPage: number, filter?: Filter, sort?: Sort): Pager => {
    const [ currentPage, setCurrentPage ] = useState<number>(INITIAL_PAGE);
    const [ itemsPerPage, setItemsPerPage ] = useState<number>(defaultPerPage);

    useEffect(() => {
        setCurrentPage(INITIAL_PAGE);
    }, [ setCurrentPage, filter ]);

    const page = useMemo(() => {
        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, filter, sort ]);

    const changePage: ChangePage = useCallback((page) => {
        setCurrentPage(page);
    }, [ setCurrentPage ]);

    const changeItemsPerPage: ChangeItemsPerPage = useCallback((perPage) => {
        setCurrentPage(INITIAL_PAGE);
        setItemsPerPage(perPage);
    }, [ setCurrentPage, setItemsPerPage ]);

    return {
        page,
        changePage,
        changeItemsPerPage
    };
};
