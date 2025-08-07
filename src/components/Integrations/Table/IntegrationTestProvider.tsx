import React from 'react';
import { Provider } from 'react-redux';
import { getNotificationsRegistry } from '../../../store/Store';
import IntegrationTestModal from './IntegrationTest';

const registry = getNotificationsRegistry();

const IntegrationTestProvider = ({
  integrationId,
  integrationType,
  onClose,
  isModalOpen,
}) => {
  return (
    <Provider store={registry.getStore()}>
      <IntegrationTestModal
        integrationId={integrationId}
        integrationType={integrationType}
        onClose={onClose}
        isModalOpen={isModalOpen}
      />
    </Provider>
  );
};

export default IntegrationTestProvider;
