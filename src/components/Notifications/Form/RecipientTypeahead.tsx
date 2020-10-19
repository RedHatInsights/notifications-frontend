import * as React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { DefaultNotificationBehavior } from '../../../types/Notification';
import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';
import { useTypeaheadReducer } from './useTypeaheadReducer';
import { useRecipientOptionMemo } from './UseRecipientOptionMemo';

export interface RecipientTypeaheadProps {
    selected: Array<string> | undefined;
    path: string;
    getRecipients: (search: string) => Promise<Array<string>>;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
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
        // return getRecipients(search !== undefined ? search.trim() : '').map(r => <SelectOption key={ r } value={ new RecipientOption(r) }/>);
    }, [ dispatchers ]);

    const onClear = React.useCallback(() => {
        setFieldValue(`${props.path}.recipient`, []);
    }, [ props.path, setFieldValue ]);

    const options = useRecipientOptionMemo(state);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined) {
            return undefined;
        }

        return (sel as Array<string>).map(s => new RecipientOption(s));

    }, [ props.selected ]);

    return (
        <FieldArray name={ `${props.path}.recipient` }>
            { helpers => {

                const onSelect = (_event, value: string | SelectOptionObject) => {
                    if (props.selected) {
                        const index = props.selected.indexOf(value.toString());
                        if (index === -1) {
                            helpers.push(value.toString());
                        } else {
                            helpers.remove(index);
                        }
                    }
                };

                return (
                    <Select
                        variant={ SelectVariant.typeaheadMulti }
                        typeAheadAriaLabel="Select the recipients"
                        selections={ selection }
                        onSelect={ onSelect }
                        onToggle={ toggle }
                        isOpen={ isOpen }
                        onFilter={ onFilter }
                        onClear={ onClear }
                        menuAppendTo={ document.body }
                    >
                        { options }
                    </Select>
                );
            } }
        </FieldArray>
    );
};
