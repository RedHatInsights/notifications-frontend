import { FormHelperText, Select, SelectVariant } from '@patternfly/react-core';
import * as React from 'react';

import { IntegrationType } from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { NotificationRecipient } from '../../../types/Recipient';
import { UseBehaviorGroupActionHandlers } from '../BehaviorGroup/useBehaviorGroupActionHandlers';
import { IntegrationRecipientTypeahead } from '../Form/IntegrationRecipientTypeahead';
import { RecipientTypeahead } from '../Form/RecipientTypeahead';

interface RecipientFormProps {
    action?: Action;
    integrationSelected: ReturnType<UseBehaviorGroupActionHandlers['handleIntegrationSelected']>;
    recipientSelected: ReturnType<UseBehaviorGroupActionHandlers['handleRecipientSelected']>;
    recipientOnClear: ReturnType<UseBehaviorGroupActionHandlers['handleRecipientOnClear']>;
    onOpenChange?: (isOpen: boolean) => void;
    error?: string;
    description: Readonly<NotificationRecipient>;
}

const dummyOnToggle = () => false;

export const RecipientForm: React.FunctionComponent<RecipientFormProps> = props => {
    let recipient: React.ReactNode;

    if (!props.action) {
        recipient = (
            <div><Select variant={ SelectVariant.typeahead } isDisabled onToggle={ dummyOnToggle } isOpen={ false } /></div>
        );
    } else if (props.action.type === NotificationType.INTEGRATION) {
        recipient = (
            <IntegrationRecipientTypeahead
                onSelected={ props.integrationSelected }
                integrationType={ props.action.integration?.type ?? IntegrationType.WEBHOOK }
                selected={ props.action.integration }
                onOpenChange={ props.onOpenChange }
                error={ !!props.error }
            />
        );
    } else {
        recipient = (
            <RecipientTypeahead
                onSelected={ props.recipientSelected }
                selected={ props.action.recipient }
                onClear={ props.recipientOnClear }
                onOpenChange={ props.onOpenChange }
                error={ !!props.error }
                description={ props.description }
            />
        );
    }

    return (
        <> { recipient }
            { props.error && (
                <FormHelperText isError isHidden={ !props.error }>{ props.error }
                </FormHelperText>
            ) }
        </>
    );
};
