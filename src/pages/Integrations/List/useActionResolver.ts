import { Integration } from '../../../types/Integration';
import { useCallback } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';

interface ActionResolverParams {
    onEdit: (integration: Integration) => void;
    onDelete: (integration: Integration) => void;
    canWriteAll: boolean;
}

export const useActionResolver = (params: ActionResolverParams) => {

    return useCallback((integration: IntegrationRow) => {
        const onEdit = params.onEdit;
        const onDelete = params.onDelete;

        const isDisabled = !params.canWriteAll;

        return [
            {
                title: 'Edit',
                isDisabled,
                onClick: () => onEdit(integration)
            }, {
                title: 'Delete',
                isDisabled,
                onClick: () => onDelete(integration)
            }
        ];

    }, [ params.onEdit, params.onDelete, params.canWriteAll ]);
};
