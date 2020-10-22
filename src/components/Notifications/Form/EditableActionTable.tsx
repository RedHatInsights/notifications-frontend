import {
    Action, DefaultNotificationBehavior,
    IntegrationRef,
    NotificationType
} from '../../../types/Notification';
import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { IntegrationType } from '../../../types/Integration';
import { RecipientTypeahead } from './RecipientTypeahead';
import { IntegrationRecipientTypeahead } from './IntegrationRecipientTypeahead';
import { ActionTypeahead } from './ActionTypeahead';
import { ActionOption } from './ActionOption';
import { useFormikContext } from 'formik';

export interface EditableActionTableProps {
    actions: Array<Action>;
    path: string;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: IntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    handleRemove?: (index: number) => () => void;
    isDisabled?: boolean;
}

interface EditableActionElementProps {
    path: string;
    action: Action;
    isDisabled?: boolean;
}

const EditableActionElement: React.FunctionComponent<EditableActionElementProps> = (props) => {

    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();

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

    return <ActionTypeahead
        action={ props.action }
        actionSelected={ actionSelected }
        isDisabled={ props.isDisabled }
    />;
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
                            <tr key={ index }>
                                <td>
                                    <EditableActionElement
                                        action={ a }
                                        isDisabled={ props.isDisabled }
                                        path={ `${props.path}.${index}` }
                                    />
                                </td>
                                <td>
                                    { a.type === NotificationType.INTEGRATION ? (
                                        <IntegrationRecipientTypeahead
                                            path={ `${props.path}.${index}` }
                                            integrationType={ a.integration?.type ?? IntegrationType.WEBHOOK }
                                            selected={ a.integration }
                                            getIntegrations={ props.getIntegrations }
                                            isDisabled={ props.isDisabled }
                                        />
                                    ) : (
                                        <RecipientTypeahead
                                            path={ `${props.path}.${index}` }
                                            selected={ a.recipient }
                                            getRecipients={ props.getRecipients }
                                            isDisabled={ props.isDisabled }
                                        />
                                    ) }
                                </td>
                                <td>
                                    <Button
                                        onClick={ props.handleRemove && props.handleRemove(index) }
                                        variant={ ButtonVariant.plain }
                                    >
                                        <TimesIcon/>
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </>
    );
};
