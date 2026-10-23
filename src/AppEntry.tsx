import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { enableMapSet } from 'immer';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import * as Redux from 'redux';

import App from './app/App';
import { getNotificationsRegistry } from './store/Store';
import { createFetchingClient } from './utils/insights-common-typescript';
import { IntlMessagesProvider, useChromeLocale } from './shared/i18n';

export interface AppEntryProps {
  logger?: Redux.Middleware;
}

enableMapSet();

const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {
  const { auth } = useChrome();
  const locale = useChromeLocale();

  const client = React.useMemo(
    () =>
      createFetchingClient(() => auth.getToken(), {
        responseInterceptors: [validateSchemaResponseInterceptor],
      }),
    [auth]
  );

  const store = React.useMemo(() => {
    const registry = props.logger
      ? getNotificationsRegistry(props.logger)
      : getNotificationsRegistry();
    return registry.getStore();
  }, [props.logger]);

  return (
    <IntlMessagesProvider locale={locale}>
      <Provider store={store}>
        <ClientContextProvider client={client}>
          <App />
        </ClientContextProvider>
      </Provider>
    </IntlMessagesProvider>
  );
};

export default AppEntry;
