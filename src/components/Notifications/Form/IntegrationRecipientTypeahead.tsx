import { Select, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { UserIntegrationType } from '../../../types/Integration';
import { IntegrationRef } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';

export interface IntegrationRecipientTypeaheadProps extends OuiaComponentProps {
    selected: Partial<IntegrationRef> | undefined;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    integrationType: UserIntegrationType;
    isDisabled?: boolean;
    onSelected: (recipientOption: RecipientOption) => void;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<IntegrationRecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);

    const [ state, dispatchers ] = useTypeaheadReducer<IntegrationRef>();

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    React.useEffect(() => {
        const getIntegrations = props.getIntegrations;
        getIntegrations(props.integrationType, '').then(integrations => dispatchers.setDefaults(integrations));
    }, [ props.getIntegrations, props.integrationType, dispatchers ]);

    React.useEffect(() => {
        const getIntegrations = props.getIntegrations;
        if (state.loadingFilter) {
            getIntegrations(props.integrationType, state.lastSearch).then(integrations => dispatchers.setFilterValue(
                state.lastSearch,
                integrations
            ));
        }
    }, [ props.getIntegrations, props.integrationType, state.loadingFilter, state.lastSearch, dispatchers ]);

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
        if (sel === undefined || sel.name === undefined || sel.id === undefined || sel.type === undefined) {
            return undefined;
        }

        return new RecipientOption(sel as IntegrationRef);
    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const integrationSelected = props.onSelected;
        if (value instanceof RecipientOption) {
            integrationSelected(value);
            setOpen(false);
        }
    }, [ props.onSelected ]);

    return (
        <div { ...getOuiaProps('IntegrationRecipientTypeahead', props) }>
            <Select
                variant={ SelectVariant.typeahead }
                typeAheadAriaLabel="Select the recipients"
                selections={ selection }
                onSelect={ onSelect }
                onToggle={ toggle }
                isOpen={ isOpen }
                onFilter={ onFilter }
                menuAppendTo={ document.body }
                isDisabled={ props.isDisabled }
            >
                { options }
            </Select>
        </div>
    );
};
