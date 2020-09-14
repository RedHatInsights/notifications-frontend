import * as React from 'react';
import {
    addSuccessNotification,
    OuiaComponentProps,
    ActionModalError
} from '@redhat-cloud-services/insights-common-typescript';
import { Integration } from '../../../types/Integration';
import { useDeleteIntegration } from '../../../services/useDeleteIntegration';
import { IntegrationDeleteModal } from '../../../components/Integrations/DeleteModal';

interface IntegrationDeleteModalPageProps extends OuiaComponentProps {
    onClose: (deleted: boolean) => void;
    integration: Integration;
}

export const IntegrationDeleteModalPage: React.FunctionComponent<IntegrationDeleteModalPageProps> = (props) => {

    const deleteIntegrationMutation = useDeleteIntegration();
    const [ hasError, setError ] = React.useState(false);

    const onDelete = React.useCallback((integration: Integration) => {
        const deleteIntegration = deleteIntegrationMutation.mutate;
        setError(false);
        return deleteIntegration(integration.id).then((response) => {
            if (response.status === 200) {
                addSuccessNotification('Integration removed', 'The integration was removed.');
                return true;
            } else {
                setError(true);
                return false;
            }
        });
    }, [ deleteIntegrationMutation.mutate, setError ]);

    const error = React.useMemo<ActionModalError | undefined>(() => {
        if (hasError) {
            return {
                title: 'Failed to remove Integration',
                description: <p>There was an error trying to remove the Integration. Please try again.</p>
            };
        }

        return undefined;
    }, [ hasError ]);

    return (
        <IntegrationDeleteModal
            integration={ props.integration }
            isDeleting={ deleteIntegrationMutation.loading }
            onClose={ props.onClose }
            onDelete={ onDelete }
            error={ error }
        />
    );
};
