import React from 'react';
import { Provider } from 'react-redux';
import { getNotificationsRegistry } from '../../../store/Store';
import IntegrationTestModal from './IntegrationTest';

const registry = getNotificationsRegistry();

const IntegrationTestProvider = ({ integrationUUID, onClose, isModalOpen }) => {
  return (
    <Provider store={registry.getStore()}>
      <IntegrationTestModal
        integrationUUID={integrationUUID}
        onClose={onClose}
        isModalOpen={isModalOpen}
      />
    </Provider>
  );
};

export default IntegrationTestProvider;
