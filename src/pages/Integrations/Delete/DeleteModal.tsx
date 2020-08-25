import * as React from 'react';
import { Alert, AlertVariant, Button, ButtonVariant, Modal, ModalVariant, Spinner } from '@patternfly/react-core';
import {
    addSuccessNotification,
    OuiaComponentProps
} from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { Integration } from '../../../types/Integration';
import { useDeleteIntegration } from '../../../services/useDeleteIntegration';

interface DeleteIntegrationModalProps extends OuiaComponentProps {
    isOpen: boolean;
    onClose: (deleted: boolean) => void;
    integration: Integration;
}

export const DeleteIntegrationModal: React.FunctionComponent<DeleteIntegrationModalProps> = (props) => {

    const deleteIntegrationMutation = useDeleteIntegration();
    const [ hasError, setError ] = React.useState(false);

    const onDelete = React.useCallback(() => {
        const integration = props.integration;
        const onClose = props.onClose;
        const deleteIntegration = deleteIntegrationMutation.mutate;
        setError(false);
        deleteIntegration(integration.id).then((response) => {
            if (response.status === 200) {
                onClose(true);
                addSuccessNotification('Integration removed', 'The integration was removed.');
            } else {
                setError(true);
            }
        });
    }, [ props.integration, deleteIntegrationMutation.mutate, props.onClose, setError ]);

    const close = React.useCallback(() => {
        const onClose = props.onClose;
        onClose(false);
    }, [ props.onClose ]);

    if (!props.isOpen) {
        return null;
    }

    return (
        <div { ...getOuiaProps('DeleteIntegrationModal', props) } >
            <Modal
                title={ 'Remove integration' }
                isOpen={ true }
                onClose={ close }
                variant={ ModalVariant.small }
                actions={ [
                    <Button
                        ouiaId="submit"
                        key="submit"
                        variant={ ButtonVariant.danger }
                        isDisabled={ deleteIntegrationMutation.loading }
                        onClick={ onDelete }
                    >
                        { deleteIntegrationMutation.loading ? <Spinner size="md"/> : 'Delete' }
                    </Button>,
                    <Button
                        ouiaId="cancel"
                        key="cancel"
                        variant={ ButtonVariant.plain }
                        isDisabled={ deleteIntegrationMutation.loading }
                        onClick={ close }
                    >
                        Cancel
                    </Button>
                ] }
            >
                { hasError && (
                    <>
                        <Alert
                            isInline
                            title={ 'Failed to remove Integration' }
                            variant={ AlertVariant.danger }
                        >
                            <p>There was an error trying to remove the Integration. Please try again.</p>
                        </Alert>
                        <br/>
                    </>
                ) }
                Do you want to delete the integration: &quot;{ props.integration.name }&quot;?
            </Modal>
        </div>
    );
};
