import * as React from 'react';
import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';
import { useTypeaheadReducer } from './useTypeaheadReducer';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';

export interface RecipientTypeaheadProps extends OuiaComponentProps {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div { ...getOuiaProps('RecipientTypeahead', props) }>
            <Select
                variant={ SelectVariant.single }
                typeAheadAriaLabel="Select the recipients"
                selections={ 'All registered users' }
                onSelect={ onSelect }
                onToggle={ toggle }
                isOpen={ isOpen }
                onFilter={ onFilter }
                menuAppendTo={ document.body }
                isDisabled={ true }
            >
                { options }
            </Select>
        </div>
    );
};
