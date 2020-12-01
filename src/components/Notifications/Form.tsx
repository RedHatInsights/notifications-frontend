import { Button, ButtonVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { global_spacer_md, global_spacer_sm } from '@patternfly/react-tokens';
import {
    Checkbox,
    Form,
    FormText,
    OuiaComponentProps,
    ouiaIdConcat
} from '@redhat-cloud-services/insights-common-typescript';
import { FieldArray, FieldArrayRenderProps, FormikProps, useFormikContext } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { UserIntegrationType } from '../../types/Integration';
import {
    Action,
    DefaultNotificationBehavior,
    IntegrationRef,
    Notification,
    NotificationType
} from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { EditableActionTable } from './Form/EditableActionTable';

type Type = 'default' | 'notification';

export interface NotificationFormProps extends OuiaComponentProps {
    type: Type;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

interface ActionsArrayProps extends FieldArrayRenderProps {
    form: FormikProps<Notification | DefaultNotificationBehavior>;
    type: Type;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

const alignLeftClassName = style({
    textAlign: 'left'
});

const tableClassName = style({
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: global_spacer_sm.var,
            paddingBottom: global_spacer_sm.var,
            paddingLeft: global_spacer_md.var,
            paddingRight: global_spacer_md.var
        },
        '& th': {
            width: '500px'
        },
        '& th:last-child': {
            width: '80px'
        }
    }
});

const ActionArray: React.FunctionComponent<ActionsArrayProps> = (props) => {

    const { values, isSubmitting } = props.form;
    const actions = values.actions;

    const addAction = React.useCallback(() => {
        const push = props.push;
        const newAction: Action = {
            type: NotificationType.EMAIL_SUBSCRIPTION,
            integrationId: '',
            recipient: []
        };

        push(newAction);
    }, [ props.push ]);

    return (
        <>
            { (actions === undefined || actions.length === 0) && (
                <tbody>
                    <tr>
                        <td colSpan={ 3 }><span>No actions. Users will not be notified.</span></td>
                    </tr>
                </tbody>
            )}

            { actions && actions.length > 0 && (
                <EditableActionTable
                    path={ props.name }
                    actions={ actions }
                    getRecipients={ props.getRecipients }
                    getIntegrations={ props.getIntegrations }
                    handleRemove={ props.handleRemove }
                    isDisabled={ isSubmitting }
                />
            ) }
            <tbody>
                <tr>
                    <td>
                        <Button
                            className={ alignLeftClassName }
                            variant={ ButtonVariant.link }
                            icon={ <PlusCircleIcon /> }
                            onClick={ addAction }
                            isDisabled={ isSubmitting }
                        >
                            Add action
                        </Button>
                    </td>
                </tr>
            </tbody>
        </>
    );
};

export const NotificationForm: React.FunctionComponent<NotificationFormProps> = (props) => {

    const { values, isSubmitting } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const { type } = props;

    const showActions: boolean = type === 'default' ? true : !(values as Notification).useDefault;

    return (
        <Form { ... getOuiaProps('Notifications/Form', props) }>
            <table className={ tableClassName }>
                { props.type === 'notification' && (
                    <>
                        <thead/>
                        <tbody>
                            <tr>
                                <td>
                                    <FormText
                                        ouiaId={ ouiaIdConcat(props.ouiaId, 'event-name') }
                                        label="Event name"
                                        name="event"
                                        id="event"
                                    />
                                </td>
                                <td>
                                    <FormText
                                        ouiaId={ ouiaIdConcat(props.ouiaId, 'application') }
                                        label="Application"
                                        name="application"
                                        id="application"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={ 2 }>
                                    <Checkbox
                                        ouiaId={ ouiaIdConcat(props.ouiaId, 'use-default') }
                                        name="useDefault"
                                        id="useDefault"
                                        label="Use default notification actions"
                                        isDisabled={ isSubmitting }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </>
                ) }
                { props.type === 'default' && (
                    <tbody>
                        <tr>
                            <td colSpan={ 3 }>
                                <div>Change the default notification actions for <b>Red Hat Insights</b>.</div>
                                <div>These actions apply to all events that use the default actions.</div>
                            </td>
                        </tr>
                    </tbody>
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
            </table>
        </Form>
    );
};
