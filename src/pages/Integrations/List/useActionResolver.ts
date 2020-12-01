import { useCallback } from 'react';

import { IntegrationRow } from '../../../components/Integrations/Table';
import { UserIntegration } from '../../../types/Integration';

interface ActionResolverParams {
    onEdit: (integration: UserIntegration) => void;
    onDelete: (integration: UserIntegration) => void;
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
