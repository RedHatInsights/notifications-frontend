import {
    Action, DefaultNotificationBehavior,
    IntegrationRef,
    NotificationType
} from '../../../types/Notification';
import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { UserIntegrationType } from '../../../types/Integration';
import { RecipientTypeahead } from './RecipientTypeahead';
import { IntegrationRecipientTypeahead } from './IntegrationRecipientTypeahead';
import { ActionTypeahead } from './ActionTypeahead';
import { ActionOption } from './ActionOption';
import { useField, useFormikContext } from 'formik';
import { RecipientOption } from './RecipientOption';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';

export interface EditableActionTableProps {
    actions: Array<Action>;
    path: string;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    handleRemove?: (index: number) => () => void;
    isDisabled?: boolean;
}

interface EditableActionElementProps extends OuiaComponentProps {
    path: string;
    action: Action;
    isDisabled?: boolean;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    onRemove?: () => void;
}

const EditableActionRow: React.FunctionComponent<EditableActionElementProps> = (props) => {

    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [
        recipientFieldProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        recipientFieldHelpers
    ] = useField<Array<string> | undefined>(`${props.path}.recipient`);

    const actionSelected = React.useCallback((value: ActionOption) => {
        setFieldValue(`${props.path}.type`, value.notificationType);
        if (value.integrationType) {
            setFieldValue(`${props.path}.integration`, {
                type: value.integrationType
            });
            setFieldValue(`${props.path}.recipient`, []);
        } else {
            setFieldValue(`${props.path}.recipient`, []);
            setFieldValue(`${props.path}.integration`, undefined);
        }
    }, [ setFieldValue, props.path ]);

    const integrationSelected = React.useCallback((value: RecipientOption) => {
        setFieldValue(`${props.path}.integration`, value.recipientOrIntegration);
    }, [ setFieldValue, props.path ]);

    const recipientSelected = React.useCallback((value: RecipientOption) => {
        if (recipientFieldProps.value) {
            const selected = recipientFieldProps.value;
            const index = selected.indexOf(value.toString());
            if (index === -1) {
                recipientFieldHelpers.setValue([ ...selected, value.toString() ]);
            } else {
                recipientFieldHelpers.setValue([ ...selected ].filter((_, i) => i !== index));
            }
        }
    }, [ recipientFieldProps, recipientFieldHelpers ]);

    const recipientOnClear = React.useCallback(() => {
        recipientFieldHelpers.setValue([]);
    }, [ recipientFieldHelpers ]);

    return (
        <tr>
            <td>
                <ActionTypeahead
                    action={ props.action }
                    onSelected={ actionSelected }
                    isDisabled={ props.isDisabled }
                    ouiaId={ `${props.ouiaId ? 'action-' + props.ouiaId : undefined}` }
                />
            </td>
            <td>
                { props.action.type === NotificationType.INTEGRATION ? (
                    <IntegrationRecipientTypeahead
                        onSelected={ integrationSelected }
                        integrationType={ props.action.integration?.type ?? UserIntegrationType.WEBHOOK }
                        selected={ props.action.integration }
                        getIntegrations={ props.getIntegrations }
                        isDisabled={ props.isDisabled }
                        ouiaId={ `${props.ouiaId ? 'recipient-' + props.ouiaId : undefined}` }
                    />
                ) : (
                    <RecipientTypeahead
                        onSelected={ recipientSelected }
                        selected={ props.action.recipient }
                        getRecipients={ props.getRecipients }
                        isDisabled={ props.isDisabled }
                        onClear={ recipientOnClear }
                        ouiaId={ `${props.ouiaId ? 'recipient-' + props.ouiaId : undefined}` }
                    />
                ) }
            </td>
            <td>
                <Button
                    onClick={ props.onRemove }
                    variant={ ButtonVariant.plain }
                >
                    <TimesIcon/>
                </Button>
            </td>
        </tr>
    );
};

export const EditableActionTable: React.FunctionComponent<EditableActionTableProps> = (props) => {

    return (
        <>
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Recipient</th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                {
                    props.actions.map((a, index) => {
                        return (
                            <EditableActionRow
                                key={ index }
                                ouiaId={ `${index}` }
                                action={ a }
                                isDisabled={ props.isDisabled }
                                path={ `${props.path}.${index}` }
                                getRecipients={ props.getRecipients }
                                getIntegrations={ props.getIntegrations }
                                onRemove={ props.handleRemove ? props.handleRemove(index) : undefined }
                            />
                        );
                    })
                }
            </tbody>
        </>
    );
};
