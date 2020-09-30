import * as React from 'react';
import {
    Action,
    NotificationType,
    DefaultNotificationBehavior,
    Notification,
    IntegrationRef
} from '../../types/Notification';
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
import { IntegrationType } from '../../types/Integration';
import { style } from 'typestyle';

type Type = 'default' | 'notification';

export interface NotificationFormProps extends OuiaComponentProps {
    type: Type;
    getRecipients: (search: string) => Array<string>;
    getIntegrations: (type: IntegrationType, search: string) => Array<IntegrationRef>;
}

interface ActionsArrayProps extends FieldArrayRenderProps {
    form: FormikProps<Notification | DefaultNotificationBehavior>;
    type: Type;
    getRecipients: (search: string) => Array<string>;
    getIntegrations: (type: IntegrationType, search: string) => Array<IntegrationRef>;
}

const alignLeftClassName = style({
    textAlign: 'left'
});

const ActionArray: React.FunctionComponent<ActionsArrayProps> = (props) => {

    const { values } = props.form;
    const actions = values.actions;

    const addAction = React.useCallback(() => {
        const push = props.push;
        const newAction: Action = {
            type: NotificationType.PLATFORM_ALERT,
            recipient: []
        };

        push(newAction);
    }, [ props.push ]);

    return (
        <>
            { (actions === undefined || actions.length === 0) && (
                <span>No actions. Users will not be notified.</span>
            )}

            { actions && actions.length > 0 && (
                <EditableActionTable
                    path={ props.name }
                    actions={ actions }
                    getRecipients={ props.getRecipients }
                    getIntegrations={ props.getIntegrations }
                    handleRemove={ props.handleRemove }
                />
            ) }
            <Button
                className={ alignLeftClassName }
                variant={ ButtonVariant.link }
                icon={ <PlusCircleIcon /> }
                onClick={ addAction }
            >
                Add action
            </Button>
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
                        { helpers =>  <ActionArray
                            type={ props.type }
                            { ...helpers }
                            getRecipients={ props.getRecipients }
                            getIntegrations={ props.getIntegrations }
                        /> }
                    </FieldArray>
                </>
            ) }

        </Form>
    );
};
