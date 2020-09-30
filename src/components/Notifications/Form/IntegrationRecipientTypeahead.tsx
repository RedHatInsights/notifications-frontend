import { DefaultNotificationBehavior, IntegrationRef } from '../../../types/Notification';
import { IntegrationType } from '../../../types/Integration';
import * as React from 'react';
import { useFormikContext } from 'formik';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { RecipientOption } from './RecipientOption';

export interface IntegrationRecipientTypeaheadProps {
    selected: Partial<IntegrationRef> | undefined;
    path: string;
    getIntegrations: (type: IntegrationType, search: string) => Array<IntegrationRef>;
    integrationType: IntegrationType;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<IntegrationRecipientTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const getIntegrations = props.getIntegrations;

        return getIntegrations(
            props.integrationType,
            search !== undefined ? search.trim() : '').map(r => <SelectOption key={ r.id } value={ new RecipientOption(r) }/>
        );
    }, [ props.getIntegrations, props.integrationType ]);

    const defaultIntegration = React.useMemo(() => {
        const getIntegrations = props.getIntegrations;
        return getIntegrations(props.integrationType, '').map(r => <SelectOption key={ r.id } value={ new RecipientOption(r) }/>);
    }, [ props.getIntegrations, props.integrationType ]);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined || sel.name === undefined || sel.id === undefined || sel.type === undefined) {
            return undefined;
        }

        return new RecipientOption(sel as IntegrationRef);
    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        if (value instanceof RecipientOption) {
            setFieldValue(`${props.path}.integration`, value.recipientOrIntegration);
        }
    }, [ setFieldValue, props.path ]);

    return (
        <Select
            variant={ SelectVariant.typeahead }
            typeAheadAriaLabel="Select the recipients"
            selections={ selection }
            onSelect={ onSelect }
            onToggle={ toggle }
            isOpen={ isOpen }
            direction="up"
            onFilter={ onFilter }
        >
            { defaultIntegration }
        </Select>
    );
};
