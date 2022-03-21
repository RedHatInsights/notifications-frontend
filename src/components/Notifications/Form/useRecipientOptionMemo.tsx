import { SelectOption } from '@patternfly/react-core';
import assertNever from 'assert-never';
import * as React from 'react';

import { IntegrationRecipient, NotificationRecipient, Recipient } from '../../../types/Recipient';
import { RecipientOption } from './RecipientOption';
import { ReducerState } from './useTypeaheadReducer';

const mapper = (r: Recipient, existingIntegrations?: Set<string>) => {
    let isDisabled = false;
    let description: string | undefined = undefined;

    if (r instanceof NotificationRecipient) {
        description = r.description;
    }

    else if (r instanceof IntegrationRecipient) {
        isDisabled = !!existingIntegrations?.has(r.integration.id);
        description = isDisabled ? 'This integration has already been added' : description;
    }

    return <SelectOption key={ r.getKey() } value={ new RecipientOption(r) } description={ description } isDisabled={ isDisabled } />;
};

export const useRecipientOptionMemo = (state: ReducerState<Recipient>, existingIntegrations?: Set<string>) => {
    return React.useMemo(() => {
        if (state.show === 'default') {
            if (state.loadingDefault) {
                return [ <SelectOption
                    key="loading-option"
                    isNoResultsOption={ true }
                    value="Loading..."
                /> ];
            } else {
                return state.defaultValues.map(recipient => mapper(recipient, existingIntegrations));
            }
        } else if (state.show === 'filter') {
            if (state.loadingFilter) {
                return [ <SelectOption
                    key="loading-option"
                    isNoResultsOption={ true }
                    value="Loading..."
                /> ];
            } else {
                return state.filterValues.map(recipient => mapper(recipient, existingIntegrations));
            }
        }

        assertNever(state.show);
    }, [ state, existingIntegrations ]);
};
