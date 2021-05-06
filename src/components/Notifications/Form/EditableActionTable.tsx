import { Button, ButtonVariant } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { UserIntegrationType } from '../../../types/Integration';
import { Action, IntegrationRef } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { RecipientForm } from '../EditableActionRow/RecipientForm';
import { useEditableActionRow } from '../EditableActionRow/useEditableActionRow';
import { ActionTypeahead } from './ActionTypeahead';

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

    const {
        recipientSelected,
        recipientOnClear,
        integrationSelected,
        actionSelected
    } = useEditableActionRow(props.path);

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
                <RecipientForm
                    action={ props.action }
                    integrationSelected={ integrationSelected }
                    recipientSelected={ recipientSelected }
                    recipientOnClear={ recipientOnClear }
                    getIntegrations={ props.getIntegrations }
                    getRecipients={ props.getRecipients }
                />
            </td>
            <td>
                <Button
                    onClick={ props.onRemove }
                    variant={ ButtonVariant.plain }
                >
                    <TimesIcon />
                </Button>
            </td>
        </tr>
    );
};

export const EditableActionTable: React.FunctionComponent<EditableActionTableProps> = (props) => {

    return (
        <>
            <thead { ...getOuiaProps('Notifications/Form/EditableActionHeader', {}) }>
                <tr>
                    <th>Action</th>
                    <th>Recipient</th>
                    <th />
                </tr>
            </thead>
            <tbody { ...getOuiaProps('Notifications/Form/EditableActionBody', {}) }>
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
