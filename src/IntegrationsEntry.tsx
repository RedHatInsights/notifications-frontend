import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { enableMapSet } from 'immer';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';

import messages from '../locales/data.json';
import IntegrationsApp from './app/IntegrationsApp';
import { AppEntryProps } from './AppEntry';
import { getNotificationsRegistry } from './store/Store';
import {
  createFetchingClient,
  getInsights,
} from './utils/insights-common-typescript';

enableMapSet();

const IntegrationsEntry: React.FunctionComponent<AppEntryProps> = (props) => {
  const client = React.useMemo(
    () =>
      createFetchingClient(getInsights, {
        responseInterceptors: [validateSchemaResponseInterceptor],
      }),
    []
  );

  const store = React.useMemo(() => {
    const registry = props.logger
      ? getNotificationsRegistry(props.logger)
      : getNotificationsRegistry();
    return registry.getStore();
  }, [props.logger]);

  return (
    <IntlProvider
      locale={navigator.language.slice(0, 2)}
      messages={messages}
      onError={console.log}
    >
      <Provider store={store}>
        <ClientContextProvider client={client}>
          <IntegrationsApp {...props} />
        </ClientContextProvider>
      </Provider>
    </IntlProvider>
  );
};

export default IntegrationsEntry;
