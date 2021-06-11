import * as React from 'react';

import { IntegrationType, UserIntegrationType } from '../../../types/Integration';
import { Action, IntegrationRef, NotificationType } from '../../../types/Notification';
import { IntegrationRecipientTypeahead } from '../Form/IntegrationRecipientTypeahead';
import { RecipientTypeahead } from '../Form/RecipientTypeahead';
import { useEditableActionRow } from './useEditableActionRow';

interface RecipientFormProps {
    action: Action;
    integrationSelected: ReturnType<typeof useEditableActionRow>['integrationSelected'];
    recipientSelected: ReturnType<typeof useEditableActionRow>['recipientSelected'];
    recipientOnClear: ReturnType<typeof useEditableActionRow>['recipientOnClear'];
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

export const RecipientForm: React.FunctionComponent<RecipientFormProps> = props => {
    if (props.action.type === NotificationType.INTEGRATION) {
        return (
            <IntegrationRecipientTypeahead
                onSelected={ props.integrationSelected }
                integrationType={ props.action.integration?.type ?? IntegrationType.WEBHOOK }
                selected={ props.action.integration }
                getIntegrations={ props.getIntegrations }
            />
        );
    }

    return (
        <RecipientTypeahead
            onSelected={ props.recipientSelected }
            selected={ props.action.recipient }
            getRecipients={ props.getRecipients }
            onClear={ props.recipientOnClear }
        />
    );
};
