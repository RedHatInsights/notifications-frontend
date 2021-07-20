import { FormHelperText } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';

import { IntegrationType, UserIntegrationType } from '../../../types/Integration';
import { Action, IntegrationRef, NotificationType } from '../../../types/Notification';
import { UseBehaviorGroupActionHandlers } from '../BehaviorGroup/useBehaviorGroupActionHandlers';
import { IntegrationRecipientTypeahead } from '../Form/IntegrationRecipientTypeahead';
import { RecipientTypeahead } from '../Form/RecipientTypeahead';

interface RecipientFormProps {
    action: Action;
    integrationSelected: ReturnType<UseBehaviorGroupActionHandlers['handleIntegrationSelected']>;
    recipientSelected: ReturnType<UseBehaviorGroupActionHandlers['handleRecipientSelected']>;
    recipientOnClear: ReturnType<UseBehaviorGroupActionHandlers['handleRecipientOnClear']>;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    onOpenChange?: (isOpen: boolean) => void;
    error?: string;
}

export const RecipientForm: React.FunctionComponent<RecipientFormProps> = props => {
    let recipient: React.ReactNode;

    if (props.action.type === NotificationType.INTEGRATION) {
        recipient = (
            <IntegrationRecipientTypeahead
                onSelected={ props.integrationSelected }
                integrationType={ props.action.integration?.type ?? IntegrationType.WEBHOOK }
                selected={ props.action.integration }
                getIntegrations={ props.getIntegrations }
                onOpenChange={ props.onOpenChange }
            />
        );
    } else {
        recipient = (
            <RecipientTypeahead
                onSelected={ props.recipientSelected }
                selected={ props.action.recipient }
                getRecipients={ props.getRecipients }
                onClear={ props.recipientOnClear }
                onOpenChange={ props.onOpenChange }
            />
        );
    }

    return (
        <>
            { recipient }
            { props.error && (
                <FormHelperText isError icon={ <ExclamationCircleIcon /> } isHidden={ !props.error }>
                    { props.error }
                </FormHelperText>
            ) }
        </>
    );
};
