import * as React from 'react';
import { Direction, OnSortHandlerType, Sort } from './Page';

export interface UseSortReturn {
  sortBy: Sort | undefined;
  onSort: OnSortHandlerType;
}

export const useSort = (defaultSort?: Sort): UseSortReturn => {
  const [sortBy, setSortBy] = React.useState<Sort | undefined>(defaultSort);

  const onSort = React.useCallback<OnSortHandlerType>(
    (index: number, column: string, direction: Direction) => {
      setSortBy(Sort.by(column, direction));
    },
    [setSortBy]
  );

  return {
    sortBy,
    onSort,
  };
};
