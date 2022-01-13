import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { usePrevious } from 'react-use';

import { NotificationRecipient, Recipient } from '../../../types/Recipient';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';

export interface RecipientTypeaheadProps extends OuiaComponentProps {
    selected: ReadonlyArray<NotificationRecipient>;
    onSelected: (value: RecipientOption) => void;
    isDisabled?: boolean;
    onClear: () => void;
    onOpenChange?: (isOpen: boolean) => void;
    error?: boolean;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);
    const [ state, dispatchers ] = useTypeaheadReducer<Recipient>();
    const prevOpen = usePrevious(isOpen);
    const { getNotificationRecipients } = useRecipientContext();

    React.useEffect(() => {
        getNotificationRecipients('').then(recipients => dispatchers.setDefaults(recipients));
    }, [ getNotificationRecipients, dispatchers ]);

    React.useEffect(() => {
        if (state.loadingFilter) {
            getNotificationRecipients(state.lastSearch).then(recipients => dispatchers.setFilterValue(
                state.lastSearch,
                recipients
            ));
        }
    }, [ getNotificationRecipients, state.loadingFilter, state.lastSearch, dispatchers ]);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    React.useEffect(() => {
        const onOpenChange = props.onOpenChange;
        if (prevOpen !== undefined && prevOpen !== isOpen) {
            onOpenChange && onOpenChange(isOpen);
        }
    }, [ prevOpen, isOpen, props.onOpenChange ]);

    const options = useRecipientOptionMemo(state);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement> | null) => {
        // Ignore filter calls with null event
        if (e === null) {
            return options;
        }

        const search = e.target.value?.trim();
        if (search === '') {
            dispatchers.useDefaults();
        } else {
            dispatchers.loadFilterValue(search);
        }

        return options;
    }, [ dispatchers, options ]);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined) {
            return undefined;
        }

        return (sel as ReadonlyArray<NotificationRecipient>).map(s => new RecipientOption(s));

    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const onSelected = props.onSelected;
        if (value instanceof RecipientOption) {
            onSelected(value);
        }

    }, [ props.onSelected ]);

    return (
        <div { ...getOuiaProps('RecipientTypeahead', props) }>
            <Select
                variant={ SelectVariant.typeaheadMulti }
                typeAheadAriaLabel="Select the recipients"
                selections={ selection }
                onSelect={ onSelect }
                onToggle={ toggle }
                isOpen={ isOpen }
                onFilter={ onFilter }
                menuAppendTo={ document.body }
                isDisabled={ props.isDisabled }
                onClear={ props.onClear }
                validated={ props.error ? 'error' : undefined  }
            >
                { options }
            </Select>
        </div>
    );
};
