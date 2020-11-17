import * as React from 'react';
import { Action, ActionNotify, NotificationType } from '../../../types/Notification';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { ActionOption } from './ActionOption';
import { IntegrationType } from '../../../types/Integration';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { isStagingBetaOrProdBeta } from '../../../types/Environments';
import { getInsights } from '@redhat-cloud-services/insights-common-typescript';

const getSelectOptions = () => [
    ...([ NotificationType.DRAWER, NotificationType.EMAIL, NotificationType.PLATFORM_ALERT ] as Array<ActionNotify['type']>)
    .map(type => new ActionOption({
        kind: 'notification',
        type
    })),
    ...[ IntegrationType.WEBHOOK ].map(type => new ActionOption({
        kind: 'integration',
        type
    }))
];

export interface ActionTypeaheadProps extends OuiaComponentProps {
    action: Action;
    isDisabled?: boolean;
    onSelected: (actionOption: ActionOption) => void;
}

export const ActionTypeahead: React.FunctionComponent<ActionTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback(() => {
        setOpen(prev => !prev);
    }, [ setOpen ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const actionSelected = props.onSelected;
        if (value instanceof ActionOption) {
            actionSelected(value);
            setOpen(false);
        }

    }, [ props.onSelected, setOpen ]);

    const selectedOption = React.useMemo(() => {
        if (props.action.type === NotificationType.INTEGRATION) {
            return new ActionOption({
                kind: 'integration',
                type: props.action.integration.type
            });
        }

        return new ActionOption({
            kind: 'notification',
            type: props.action.type
        });
    }, [ props.action ]);

    const hideNonWebhooks = isStagingBetaOrProdBeta(getInsights());

    return (
        <div { ...getOuiaProps('ActionTypeahead', props) } >
            <Select
                variant={ SelectVariant.typeahead }
                typeAheadAriaLabel="Select an action type"
                selections={ selectedOption }
                onToggle={ toggle }
                isOpen={ isOpen }
                onSelect={ onSelect }
                menuAppendTo={ document.body }
                isDisabled={ props.isDisabled }
            >
                { getSelectOptions()
                .filter((o) => !hideNonWebhooks || o.notificationType === NotificationType.INTEGRATION)
                .map(o => <SelectOption key={ o.toString() } value={ o } />) }
            </Select>
        </div>
    );
};
