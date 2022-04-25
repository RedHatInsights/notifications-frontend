import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import Config from '../../../config/Config';
import { useIntegrations } from '../../../hooks/useIntegrations';
import { isReleased } from '../../../types/Environments';
import { UserIntegrationType } from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ActionOption } from './ActionOption';

const getSelectOptions = (
    availableNotificationTypes: ReadonlyArray<NotificationType>,
    availableIntegrationTypes: ReadonlyArray<UserIntegrationType>,
    selectedNotifications: ReadonlyArray<NotificationType>) => [
    ...availableNotificationTypes
    .filter(type => !selectedNotifications.includes(type))
    .map(type => new ActionOption({
        kind: 'notification',
        type
    })),
    ...availableIntegrationTypes.map(type => new ActionOption({
        kind: 'integration',
        type
    }))
];

export interface ActionTypeaheadProps extends OuiaComponentProps {
    selectedNotifications: ReadonlyArray<NotificationType>;
    action?: Action;
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
        if (!props.action) {
            return undefined;
        }

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

    const released = isReleased();
    const integrationTypes = useIntegrations();

    const selectableOptions = React.useMemo(() => {
        const notificationTypes = released ?
            Config.notifications.actions.released :
            Config.notifications.actions.experimental;

        return getSelectOptions(notificationTypes, integrationTypes, props.selectedNotifications)
        .map(o => <SelectOption key={ o.toString() } value={ o } />);
    }, [ integrationTypes, released, props.selectedNotifications ]);

    return (
        <div { ...getOuiaProps('ActionTypeahead', props) } >
            <Select
                maxHeight={ 400 }
                variant={ SelectVariant.single }
                aria-label="Select action"
                placeholderText="Select action"
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
