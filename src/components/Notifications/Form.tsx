import * as React from 'react';
import { Action, ActionType, Notification } from '../../types/Notification';
import { Messages } from '../../properties/Messages';
import { FormSelectOption } from '@patternfly/react-core';
import {
    Checkbox,
    Form,
    FormText,
    OuiaComponentProps,
    ouiaIdConcat
} from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import { getOuiaProps } from '../../utils/getOuiaProps';

const actionFormOptions = [ ActionType.INTEGRATION, ActionType.DRAWER, ActionType.EMAIL, ActionType.PLATFORM_ALERT ]
.map(type => Messages.components.notifications.types[type])
.map(label => (<FormSelectOption key={ label } label={ label }/>));

export interface NotificationFormProps extends OuiaComponentProps {
    type: 'default' | 'notification';
}

export const NotificationForm: React.FunctionComponent<NotificationFormProps> = (props) => {

    const { values } = useFormikContext<Notification | Array<Action>>();
    const { type } = props;
    const actions: Array<Action> = type === 'default' ? (values as Array<Action>) : ((values as Notification).actions);

    const showActions: boolean = type === 'default' ? true : !(values as Notification).useDefault;

    return (
        <Form { ... getOuiaProps('Notifications/Form', props) }>
            { props.type === 'notification' && (
                <>
                    <Checkbox
                        ouiaId={ ouiaIdConcat(props.ouiaId, 'use-default') }
                        name="useDefault"
                        id="useDefault"
                        label="Use default notification actions"
                    />
                    <FormText
                        ouiaId={ ouiaIdConcat(props.ouiaId, 'event-name') }
                        label="Event name"
                        name="event"
                        id="event"
                    />
                    <FormText
                        ouiaId={ ouiaIdConcat(props.ouiaId, 'application') }
                        label="Application"
                        name="application"
                        id="application"
                    />
                </>
            ) }
            { props.type === 'default' && (
                <>
                    <div>Change the default notification actions for <b>Red Hat Insights</b>.</div>
                    <div>These actions apply to all events that use the default actions.</div>
                </>
            )}

            { showActions && (
                <>
                    { (actions === undefined || actions.length === 0) && (
                        <span>No actions. Users will not be notified.</span>
                    )}

                    { actions.length > 0 && (
                        actions.map(a => {
                            return a.type;
                        }).join(', ')
                    ) }
                </>
            ) }

        </Form>
    );
};
