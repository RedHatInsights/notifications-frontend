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
  const filterValues = filters ? Object.values(filters) : [];

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...filterValues, setCurrentPage, itemsPerPage, category]);

  const page = useMemo(() => {
    const filter = filterBuilder?.(filters);
    return Page.of(currentPage, itemsPerPage, filter, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, ...filterValues, sort, filterBuilder]);

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
