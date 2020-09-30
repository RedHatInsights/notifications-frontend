import * as React from 'react';
import { Action, ActionNotify, DefaultNotificationBehavior, NotificationType } from '../../../types/Notification';
import { useFormikContext } from 'formik';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { ActionOption } from './ActionOption';
import { IntegrationType } from '../../../types/Integration';

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

export interface ActionTypeaheadProps {
    action: Action;
    path: string;
}

export const ActionTypeahead: React.FunctionComponent<ActionTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback(() => {
        setOpen(prev => !prev);
    }, [ setOpen ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const path = props.path;

        if (value instanceof ActionOption) {
            setFieldValue(`${path}.type`, value.notificationType);
            if (value.integrationType) {
                setFieldValue(`${path}.integration`, {
                    type: value.integrationType
                });
                setFieldValue(`${path}.recipient`, []);
            } else {
                setFieldValue(`${path}.recipient`, []);
                setFieldValue(`${path}.integration`, undefined);
            }

            setOpen(false);
        }

    }, [ setFieldValue, props.path, setOpen ]);

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

    return (
        <Select
            variant={ SelectVariant.typeahead }
            typeAheadAriaLabel="Select an action type"
            selections={ selectedOption }
            onToggle={ toggle }
            isOpen={ isOpen }
            onSelect={ onSelect }
            direction="up"
        >
            { getSelectOptions().map(o => <SelectOption key={ o.toString() } value={ o } />) }
        </Select>
    );
};
