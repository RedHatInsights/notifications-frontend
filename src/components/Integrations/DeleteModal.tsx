import * as React from 'react';
import { DeleteModal, DeleteModalProps } from '../Modals/DeleteModal';
import { Integration } from '../../types/Integration';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface IntegrationDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
    integration?: Integration;
    onDelete: (integration: Integration) => boolean | Promise<boolean>;
}

export const IntegrationDeleteModal: React.FunctionComponent<IntegrationDeleteModalProps> = (props) => {

    const onDeleteInternal = React.useCallback(() => {
        const integration = props.integration;
        const onDelete = props.onDelete;
        if (integration) {
            return onDelete(integration);
        }

        return false;
    }, [ props.onDelete, props.integration ]);

    if (!props.integration) {
        return null;
    }

    const content = `Do you want to delete the integration: "${ props.integration.name }"?`;
    return (
        <DeleteModal
            isOpen={ true }
            isDeleting={ props.isDeleting }
            title={ 'Remove integration' }
            content={ content }
            onClose={ props.onClose }
            onDelete={ onDeleteInternal }
            error={ props.error }
        />
    );
};
