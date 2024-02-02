import { defineMessages } from 'react-intl';

export default defineMessages({
  notifications: {
    id: 'notifications',
    description: 'Application name',
    defaultMessage: 'Notifications',
  },
  integrations: {
    id: 'integrations',
    description: 'Application name',
    defaultMessage: 'Integrations',
  },
  integrationsEmptyStateTitle: {
    id: 'integrationsEmptyStateTitle',
    description: 'Integrations Empty State title',
    defaultMessage: 'No integrations found',
  },
  integrationsTableEmptyStateBody: {
    id: 'integrationsTableEmptyStateBody',
    description: 'Integrations Empty State body',
    defaultMessage:
      'No integrations match the filter criteria. Remove all filters or clear all filters to show integrations.',
  },
});
