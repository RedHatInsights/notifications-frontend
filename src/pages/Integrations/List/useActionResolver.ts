import { useCallback } from 'react';

import {
  IntegrationRow,
  OnEnable,
} from '../../../components/Integrations/Table';
import { UserIntegration } from '../../../types/Integration';
import { useFlag } from '@unleash/proxy-client-react';
import { useIntl } from 'react-intl';
import messages from '../../../properties/DefinedMessages';

interface ActionResolverParams {
  onEdit: (integration: UserIntegration) => void;
  onTest: (integration: UserIntegration) => void;
  onDelete: (integration: UserIntegration) => void;
  canWrite: boolean;
  onEnable: OnEnable;
}

export const useActionResolver = (params: ActionResolverParams) => {
  const integrationTest = useFlag('insights.integrations.test');
  const intl = useIntl();
  return useCallback(
    (integration: IntegrationRow, index: number) => {
      const onEdit = params.onEdit;
      const onTest = params.onTest;
      const onDelete = params.onDelete;
      const onEnable = params.onEnable;

      const isDisabled = !params.canWrite;

      return [
        {
          title: 'Edit',
          isDisabled,
          onClick: () => onEdit(integration),
          description: intl.formatMessage(
            messages.integrationdropdownEditDescription
          ),
        },
        ...(integrationTest
          ? [
              {
                title: 'Test',
                isDisabled,
                onClick: () => onTest(integration),
                description: intl.formatMessage(
                  messages.integrationdropdownTestDescription
                ),
              },
            ]
          : []),
        {
          title: 'Delete',
          isDisabled,
          description: intl.formatMessage(messages.removeDescription),
          onClick: () => onDelete(integration),
        },
        {
          title: integration.isEnabled ? 'Disable' : 'Enable',
          isDisabled,
          description: integration.isEnabled
            ? intl.formatMessage(messages.pauseDescription)
            : intl.formatMessage(messages.resumeDescription),
          onClick: () => onEnable(integration, index, !integration.isEnabled),
        },
      ];
    },
    [
      intl,
      params.onEdit,
      params.onTest,
      params.onDelete,
      params.canWrite,
      params.onEnable,
      integrationTest,
    ]
  );
};
