import { ActionModalError, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { IntegrationSaveModal } from '../../../components/Integrations/SaveModal';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import { NewUserIntegration, UserIntegration } from '../../../types/Integration';

interface CreatePageProps {
    isEdit: boolean;
    initialIntegration: Partial<UserIntegration>;
    onClose: (saved: boolean) => void;
}

export const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const saveIntegrationMutation = useSaveIntegrationMutation();
    const [ hasError, setError ] = React.useState(false);

    const onSaveIntegration = React.useCallback((integration: NewUserIntegration) => {
        if (!integration.id) {
            integration.isEnabled = true;
        }

        setError(false);

        return saveIntegrationMutation.mutate(integration).then(response => {
            if (response.status === 200) {
                if (props.isEdit) {
                    addSuccessNotification(
                        `${integration.name} saved successfully`,
                        integration.isEnabled ? 'This integration is enabled and ready to use.' : 'This integration is disabled.'
                    );
                } else {
                    addSuccessNotification(`${integration.name} added successfully`, 'This integration is enabled and ready to use.');
                }

                return true;
            } else {
                setError(true);
                return false;
            }
        });
    }, [ saveIntegrationMutation, props.isEdit ]);

    const error = React.useMemo<ActionModalError | undefined>(() => {
        if (hasError) {
            if (props.isEdit) {
                return {
                    title: 'Integration failed to update',
                    description: <p>There was an error trying to update the Integration. Please try again.</p>
                };
            } else {
                return {
                    title: 'Failed to create Integration',
                    description: <p>There was an error trying to create the Integration. Please try again.</p>
                };
            }
        }

        return undefined;
    }, [ hasError, props.isEdit ]);

    return (
        <IntegrationSaveModal
            initialIntegration={ props.initialIntegration }
            onSave={ onSaveIntegration }
            isEdit={ props.isEdit }
            isSaving={ saveIntegrationMutation.loading }
            onClose={ props.onClose }
            error={ error }
        />
    );
};
