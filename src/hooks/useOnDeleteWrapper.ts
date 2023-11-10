import { useCallback } from 'react';

import { OnDelete } from '../types/Callbacks';

export const useOnDeleteWrapper = <T>(onDelete: OnDelete<T>, toDelete: T) => {
  return useCallback(() => {
    return onDelete(toDelete);
  }, [onDelete, toDelete]);
};
