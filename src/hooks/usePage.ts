import { useCallback, useEffect, useMemo, useState } from 'react';
import { IntegrationCategory } from '../types/Integration';
import { Filter, Page, Sort } from '../utils/insights-common-typescript';

export interface PageAdapter {
  page: Page;
  changePage: (page: number) => void;
  changeItemsPerPage: (perPage: number) => void;
}

export type FilterBuilder<T> = (filters: T | undefined) => Filter | undefined;

export const usePage = <T>(
  defaultPerPage: number,
  filterBuilder: FilterBuilder<T>,
  filters?: T,
  sort?: Sort,
  category?: IntegrationCategory
): PageAdapter => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, setCurrentPage, itemsPerPage, category]);

  const page = useMemo(() => {
    const filter = filterBuilder ? filterBuilder(filters) : undefined;
    return Page.of(currentPage, itemsPerPage, filter, sort);
  }, [currentPage, itemsPerPage, filters, sort, filterBuilder]);

  const changePage = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const changeItemsPerPage = useCallback(
    (perPage: number) => {
      setItemsPerPage(perPage);
    },
    [setItemsPerPage]
  );

  return {
    page,
    changePage,
    changeItemsPerPage,
  };
};
