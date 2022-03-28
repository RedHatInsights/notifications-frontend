import { SelectOption } from '@patternfly/react-core';
import assertNever from 'assert-never';
import * as React from 'react';

import { Recipient } from '../../../types/Recipient';
import { ReducerState } from './useTypeaheadReducer';

type Mapper<R> = (recipients: ReadonlyArray<R>) => React.ReactElement[];

const getOptions = <R extends Recipient>(values: ReadonlyArray<R>, mapper: Mapper<R>, isLoading: boolean) => {
    if (isLoading) {
        return [ <SelectOption
            key="loading-option"
            isNoResultsOption={ true }
            value="Loading..."
        /> ];
    }

    return mapper(values);
};

export const useRecipientOptionMemo = <R extends Recipient>(state: ReducerState<R>, mapper: Mapper<R>) => {
    return React.useMemo(() => {
        if (state.show === 'default') {
            return getOptions(
                state.defaultValues,
                mapper,
                state.loadingDefault
            );
        } else if (state.show === 'filter') {
            return getOptions(
                state.filterValues,
                mapper,
                state.loadingFilter
            );
        }

        assertNever(state.show);
    }, [ state, mapper ]);
};
