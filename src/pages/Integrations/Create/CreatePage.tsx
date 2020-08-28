import * as React from 'react';
import { Integration, NewIntegration } from '../../../types/Integration';
import { IntegrationSaveModal } from '../../../components/Integrations/SaveModal';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import { addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import { ActionModalError } from '../../../components/Modals/ActionModal';

interface CreatePageProps {
    isEdit: boolean;
    initialIntegration: Partial<Integration>;
    onClose: (saved: boolean) => void;
}

export const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const saveIntegrationMutation = useSaveIntegrationMutation();
    const [ hasError, setError ] = React.useState(false);

    const onSaveIntegration = React.useCallback((integration: NewIntegration) => {
        if (!integration.id) {
            integration.isEnabled = true;
        }

        setError(false);

        return saveIntegrationMutation.mutate(integration).then(response => {
            if (response.status === 200) {
                if (props.isEdit) {
                    addSuccessNotification('Integration saved', `Integration "${integration.name}" has been updated.`);
                } else {
                    addSuccessNotification('Integration created', `Integration "${integration.name}" has been created.`);
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
