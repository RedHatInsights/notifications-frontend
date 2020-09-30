import * as React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { DefaultNotificationBehavior } from '../../../types/Notification';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';

export interface RecipientTypeaheadProps {
    selected: Array<string> | undefined;
    path: string;
    getRecipients: (search: string) => Array<string>;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const getRecipients = props.getRecipients;

        return getRecipients(search !== undefined ? search.trim() : '').map(r => <SelectOption key={ r } value={ new RecipientOption(r) }/>);
    }, [ props.getRecipients ]);

    const onClear = React.useCallback(() => {
        setFieldValue(`${props.path}.recipient`, []);
    }, [ props.path, setFieldValue ]);

    const defaultRecipients = React.useMemo(() => {
        const getRecipients = props.getRecipients;
        return getRecipients('').map(r => <SelectOption key={ r } value={ new RecipientOption(r) }/>);
    }, [ props.getRecipients ]);

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
                        direction="up"
                        onFilter={ onFilter }
                        onClear={ onClear }
                    >
                        { defaultRecipients }
                    </Select>
                );
            } }
        </FieldArray>
    );
};
