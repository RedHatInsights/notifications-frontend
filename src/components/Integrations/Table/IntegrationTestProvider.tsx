import React from 'react';
import { Provider } from 'react-redux';
import { getNotificationsRegistry } from '../../../store/Store';
import IntegrationTestModal from './IntegrationTest';

type IntegrationTestProps = {
  integrationUUID: string;
};

const registry = getNotificationsRegistry();

const IntegrationTestProvider: React.FC<IntegrationTestProps> = (props) => {
  return (
    <Provider store={registry.getStore()}>
      <IntegrationTestModal {...props} />
    </Provider>
  );
};

export default IntegrationTestProvider;
