import { useCallback, useMemo } from 'react';
import { useUrlState } from './useUrlState';

export const useUrlStateMultipleOptions = <T extends string>(
  name: string,
  options?: Array<T>,
  defaultValue?: Array<T>
) => {
  const lowerCaseOptions = useMemo(
    () => options?.map((o) => o.trim().toLowerCase()),
    [options]
  );

  const serializer = useCallback(
    (val: Array<T> | undefined) => {
      const value = val?.map((v) => v.toLowerCase());
      if (value) {
        if (lowerCaseOptions && options) {
          const result = value
            .map((v) => lowerCaseOptions.indexOf(v))
            .filter((i) => i !== -1)
            .map((i) => options[i]);
          if (result.length > 0) {
            return result.join(',');
          }
        } else {
          if (val && val.length > 0) {
            return val.join(',');
          }
        }
      }

      return undefined;
    },
    [lowerCaseOptions, options]
  );

  const deserializer = useCallback(
    (val: string | undefined) => {
      const value = val?.trim().split(',');
      if (value) {
        if (lowerCaseOptions && options) {
          return value
            .map((v) => lowerCaseOptions.indexOf(v.toLowerCase()))
            .filter((i) => i !== -1)
            .map((i) => options[i]);
        } else {
          return val ? (value as Array<T>) : [];
        }
      }

      return [];
    },
    [lowerCaseOptions, options]
  );

  return useUrlState<Array<T>>(name, serializer, deserializer, defaultValue);
};
