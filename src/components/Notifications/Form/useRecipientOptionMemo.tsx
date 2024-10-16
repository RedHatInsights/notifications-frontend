import { Skeleton } from '@patternfly/react-core';
import { SelectOption } from '@patternfly/react-core/deprecated';
import assertNever from 'assert-never';
import * as React from 'react';

import { Recipient } from '../../../types/Recipient';
import { ReducerState } from './useTypeaheadReducer';

type Mapper<R> = (recipients: ReadonlyArray<R>) => React.ReactElement[];
type LoadingMapper = () => React.ReactElement[];

const getOptions = <R extends Recipient>(
  values: ReadonlyArray<R>,
  mapper: Mapper<R>,
  isLoading: boolean,
  loadingMapper?: LoadingMapper
) => {
  if (isLoading) {
    return loadingMapper
      ? loadingMapper()
      : [
          <SelectOption key="loading-option" isNoResultsOption={true}>
            <Skeleton width="100%" />
          </SelectOption>,
        ];
  }

  return mapper(values);
};

export const useRecipientOptionMemo = <R extends Recipient>(
  state: ReducerState<R>,
  mapper: Mapper<R>,
  loadingMapper?: LoadingMapper
) => {
  return React.useMemo(() => {
    if (state.show === 'default') {
      return getOptions(
        state.defaultValues,
        mapper,
        state.loadingDefault,
        loadingMapper
      );
    } else if (state.show === 'filter') {
      return getOptions(
        state.filterValues,
        mapper,
        state.loadingFilter,
        loadingMapper
      );
    }

    assertNever(state.show);
  }, [state, mapper, loadingMapper]);
};
