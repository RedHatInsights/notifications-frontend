import * as React from 'react';
import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';
import { useTypeaheadReducer } from './useTypeaheadReducer';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';

export interface RecipientTypeaheadProps {
    selected: Array<string> | undefined;
    onSelected: (value: RecipientOption) => void;
    getRecipients: (search: string) => Promise<Array<string>>;
    isDisabled?: boolean;
    onClear: () => void;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);
    const [ state, dispatchers ] = useTypeaheadReducer<string>();

    React.useEffect(() => {
        const getRecipients = props.getRecipients;
        getRecipients('').then(recipients => dispatchers.setDefaults(recipients));
    }, [ props.getRecipients, dispatchers ]);

    React.useEffect(() => {
        const getRecipients = props.getRecipients;
        if (state.loadingFilter) {
            getRecipients(state.lastSearch).then(recipients => dispatchers.setFilterValue(
                state.lastSearch,
                recipients
            ));
        }
    }, [ props.getRecipients, state.loadingFilter, state.lastSearch, dispatchers ]);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value?.trim();

        if (search === '') {
            dispatchers.useDefaults();
        } else {
            dispatchers.loadFilterValue(search);
        }

        return [];
    }, [ dispatchers ]);

    const options = useRecipientOptionMemo(state);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined) {
            return undefined;
        }

        return (sel as Array<string>).map(s => new RecipientOption(s));

    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const onSelected = props.onSelected;
        if (value instanceof RecipientOption) {
            onSelected(value);
        }
    }, [ props.onSelected ]);

    return (
        <Select
            variant={ SelectVariant.typeaheadMulti }
            typeAheadAriaLabel="Select the recipients"
            selections={ selection }
            onSelect={ onSelect }
            onToggle={ toggle }
            isOpen={ isOpen }
            onFilter={ onFilter }
            onClear={ props.onClear }
            menuAppendTo={ document.body }
            isDisabled={ props.isDisabled }
        >
            { options }
        </Select>
    );
};
