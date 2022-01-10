import { SelectOption } from '@patternfly/react-core';
import assertNever from 'assert-never';
import * as React from 'react';

import { NotificationRecipient, Recipient } from '../../../types/Recipient';
import { RecipientOption } from './RecipientOption';
import { ReducerState } from './useTypeaheadReducer';

const mapper = (r: Recipient) => {
    let description;
    if (r instanceof NotificationRecipient) {
        description = r.description;
    }

    return <SelectOption key={ r.getKey() } value={ new RecipientOption(r) } description={ description } />;
};

export const useRecipientOptionMemo = (state: ReducerState<Recipient>) => {
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
