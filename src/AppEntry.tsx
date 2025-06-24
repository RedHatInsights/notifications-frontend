import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { enableMapSet } from 'immer';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import * as Redux from 'redux';

import messages from '../locales/data.json';
import App from './app/App';
import { getNotificationsRegistry } from './store/Store';
import {
  createFetchingClient,
  getInsights,
} from './utils/insights-common-typescript';

export interface AppEntryProps {
  logger?: Redux.Middleware;
}

enableMapSet();

const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {
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
          <App />
        </ClientContextProvider>
      </Provider>
    </IntlProvider>
  );
};

export default AppEntry;
