import * as React from 'react';
import { Action, ActionType, DefaultNotificationBehavior, Notification } from '../../types/Notification';
import { Button, ButtonVariant } from '@patternfly/react-core';
import {
    Checkbox,
    Form,
    FormText,
    OuiaComponentProps,
    ouiaIdConcat
} from '@redhat-cloud-services/insights-common-typescript';
import { FieldArray, FieldArrayRenderProps, FormikProps, useFormikContext } from 'formik';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { EditableActionTable } from './EditableActionTable';

type Type = 'default' | 'notification';

export interface NotificationFormProps extends OuiaComponentProps {
    type: Type;
}

interface ActionsArrayProps extends FieldArrayRenderProps {
    form: FormikProps<Notification | DefaultNotificationBehavior>;
    type: Type;
}

const ActionArray: React.FunctionComponent<ActionsArrayProps> = (props) => {

    const { values } = props.form;
    const actions = values.actions;

    const addAction = () => {
        const newAction: Action = {
            type: ActionType.PLATFORM_ALERT,
            recipient: []
        };

        props.push(newAction);
    };

    return (
        <>
            { (actions === undefined || actions.length === 0) && (
                <span>No actions. Users will not be notified.</span>
            )}

            { actions && actions.length > 0 && (
                <EditableActionTable path={ props.name } actions={ actions }/>
            ) }
            <Button variant={ ButtonVariant.link } icon={ <PlusCircleIcon /> } onClick={ addAction }>Add action</Button>
        </>
    );
};

export const NotificationForm: React.FunctionComponent<NotificationFormProps> = (props) => {

    const { values } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const { type } = props;

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
                    <FieldArray name="actions">
                        { helpers =>  <ActionArray type={ props.type } { ...helpers } /> }
                    </FieldArray>
                </>
            ) }

        </Form>
    );
};
