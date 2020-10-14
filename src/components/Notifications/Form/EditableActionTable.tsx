import {
    Action,
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

export interface EditableActionTableProps {
    actions: Array<Action>;
    path: string;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: IntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    handleRemove?: (index: number) => () => void;
}

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
                                    <ActionTypeahead
                                        path={ `${props.path}.${index}` }
                                        action={ a }
                                    />
                                </td>
                                <td>
                                    { a.type === NotificationType.INTEGRATION ? (
                                        <IntegrationRecipientTypeahead
                                            path={ `${props.path}.${index}` }
                                            integrationType={ a.integration?.type ?? IntegrationType.WEBHOOK }
                                            selected={ a.integration }
                                            getIntegrations={ props.getIntegrations }
                                        />
                                    ) : (
                                        <RecipientTypeahead
                                            path={ `${props.path}.${index}` }
                                            selected={ a.recipient }
                                            getRecipients={ props.getRecipients }
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
