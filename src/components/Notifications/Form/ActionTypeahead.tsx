import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { getInsights, OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { isStagingOrProd } from '../../../types/Environments';
import { IntegrationType } from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ActionOption } from './ActionOption';

const getSelectOptions = (selectedNotifications: ReadonlyArray<NotificationType>) => [
    ...([ NotificationType.DRAWER, NotificationType.EMAIL_SUBSCRIPTION ] as ReadonlyArray<NotificationType>)
    .filter(type => !selectedNotifications.includes(type))
    .map(type => new ActionOption({
        kind: 'notification',
        type
    })),
    ...[ IntegrationType.WEBHOOK as const ].map(type => new ActionOption({
        kind: 'integration',
        type
    }))
];

export interface ActionTypeaheadProps extends OuiaComponentProps {
    selectedNotifications: ReadonlyArray<NotificationType>;
    action: Action;
    isDisabled?: boolean;
    onSelected: (actionOption: ActionOption) => void;
}

export const ActionTypeahead: React.FunctionComponent<ActionTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isExpanded: boolean) => {
        setOpen(isExpanded);
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

    const hideNonWebhooks = isStagingOrProd(getInsights());

    const selectableOptions = React.useMemo(() => getSelectOptions(props.selectedNotifications)
    .filter((o) => !hideNonWebhooks
            || o.notificationType === NotificationType.INTEGRATION)
    .map(o => <SelectOption key={ o.toString() } value={ o } />), [ getSelectOptions, hideNonWebhooks, props.selectedNotifications ]);

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
                { selectableOptions }
            </Select>
        </div>
    );
};
