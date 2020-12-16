import { DeleteModal, DeleteModalProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { UserIntegration } from '../../types/Integration';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface IntegrationDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
    integration?: UserIntegration;
    onDelete: (integration: UserIntegration) => boolean | Promise<boolean>;
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

    const content = `Do you want to remove the integration: "${ props.integration.name }"?`;
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
