import { useCallback } from 'react';

import { IntegrationRow, OnEnable } from '../../../components/Integrations/Table';
import { UserIntegration } from '../../../types/Integration';

interface ActionResolverParams {
    onEdit: (integration: UserIntegration) => void;
    onDelete: (integration: UserIntegration) => void;
    canWriteAll: boolean;
    onEnable: OnEnable;
}

export const useActionResolver = (params: ActionResolverParams) => {

    return useCallback((integration: IntegrationRow, index: number) => {
        const onEdit = params.onEdit;
        const onDelete = params.onDelete;
        const onEnable = params.onEnable;

        const isDisabled = !params.canWriteAll;

        return [
            {
                title: 'Edit',
                isDisabled,
                onClick: () => onEdit(integration)
            }, {
                title: 'Remove',
                isDisabled,
                onClick: () => onDelete(integration)
            }, {
                title: integration.isEnabled ? 'Disable' : 'Enable',
                isDisabled,
                onClick: () => onEnable(integration, index, !integration.isEnabled)
            }
        ];

    }, [ params.onEdit, params.onDelete, params.canWriteAll, params.onEnable ]);
};
