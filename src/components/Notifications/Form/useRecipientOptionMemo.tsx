import * as React from 'react';
import { IntegrationRef } from '../../../types/Notification';
import { SelectOption } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';
import assertNever from 'assert-never';
import { ReducerState } from './useTypeaheadReducer';

const mapper = <T extends IntegrationRef>(r: T | string) => <SelectOption key={ typeof r === 'string' ? r : r.id } value={ new RecipientOption(r) }/>;

export const useRecipientOptionMemo = <T extends IntegrationRef>(state: ReducerState<T | string>) => {
    return React.useMemo(() => {
        if (state.show === 'default') {
            if (state.loadingDefault) {
                return [ <SelectOption
                    key="loading-option"
                    isNoResultsOption={ true }
                    value="Loading..."
                /> ];
            } else {
                return state.defaultValues.map(mapper);
            }
        } else if (state.show === 'filter') {
            if (state.loadingFilter) {
                return [ <SelectOption
                    key="loading-option"
                    isNoResultsOption={ true }
                    value="Loading..."
                /> ];
            } else {
                return state.filterValues.map(mapper);
            }
        }

        assertNever(state.show);
    }, [ state ]);
};
