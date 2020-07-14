import { Integration } from '../../../types/Integration';
import { useCallback } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';

interface ActionResolverParams {
    onEdit: (integration: Integration) => void;
    canWriteAll: boolean;
}

export const useActionResolver = (params: ActionResolverParams) => {

    return useCallback((integration: IntegrationRow) => {
        const onEdit = params.onEdit;

        if (!params.canWriteAll) {
            return [];
        }

        return [
            {
                title: 'Edit',
                onClick: () => onEdit(integration)
            }
        ];

    }, [ params.onEdit, params.canWriteAll ]);
};
