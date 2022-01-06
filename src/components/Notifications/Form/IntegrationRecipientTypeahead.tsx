import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { usePrevious } from 'react-use';

import { Messages } from '../../../properties/Messages';
import { UserIntegrationType } from '../../../types/Integration';
import { IntegrationRef } from '../../../types/Notification';
import { IntegrationRecipient } from '../../../types/Recipient';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';

export interface IntegrationRecipientTypeaheadProps extends OuiaComponentProps {
    selected: Partial<IntegrationRef> | undefined;
    integrationType: UserIntegrationType;
    isDisabled?: boolean;
    onSelected: (recipientOption: RecipientOption) => void;
    onOpenChange?: (isOpen: boolean) => void;
    validated: string | undefined;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<IntegrationRecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);
    const prevOpen = usePrevious(isOpen);
    const { getIntegrations } = useRecipientContext();

    const [ state, dispatchers ] = useTypeaheadReducer<IntegrationRecipient>();

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    React.useEffect(() => {
        const onOpenChange = props.onOpenChange;
        if (prevOpen !== undefined && prevOpen !== isOpen) {
            onOpenChange && onOpenChange(isOpen);
        }
    }, [ prevOpen, isOpen, props.onOpenChange ]);

    React.useEffect(() => {
        getIntegrations(props.integrationType, '').then(integrations => dispatchers.setDefaults(integrations.map(i => new IntegrationRecipient(i))));
    }, [ getIntegrations, props.integrationType, dispatchers ]);

    React.useEffect(() => {
        if (state.loadingFilter) {
            getIntegrations(props.integrationType, state.lastSearch).then(integrations => dispatchers.setFilterValue(
                state.lastSearch,
                integrations.map(i => new IntegrationRecipient(i))
            ));
        }
    }, [ getIntegrations, props.integrationType, state.loadingFilter, state.lastSearch, dispatchers ]);

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
        if (sel === undefined || sel.name === undefined || sel.id === undefined || sel.type === undefined) {
            return undefined;
        }

        return new RecipientOption(new IntegrationRecipient(sel as IntegrationRef));
    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const integrationSelected = props.onSelected;
        if (value instanceof RecipientOption) {
            integrationSelected(value);
            setOpen(false);
        }
    }, [ props.onSelected ]);

    const chooseText = `Choose ${Messages.components.integrations.integrationType[props.integrationType].toLowerCase()}`;

    return (
        <div { ...getOuiaProps('IntegrationRecipientTypeahead', props) }>
            <Select
                variant={ SelectVariant.typeahead }
                typeAheadAriaLabel={ chooseText }
                placeholderText={ chooseText }
                selections={ selection }
                onSelect={ onSelect }
                onToggle={ toggle }
                isOpen={ isOpen }
                onFilter={ onFilter }
                menuAppendTo={ document.body }
                isDisabled={ props.isDisabled }
                validated='default'
            >
                { options }
            </Select>
        </div>
    );
};
