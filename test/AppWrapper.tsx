import { NotificationPortal as NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { clearNotifications as createClearNotificationsAction } from '@redhat-cloud-services/frontend-components-notifications/redux/actions/notifications';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { getInsights } from '@redhat-cloud-services/insights-common-typescript';
import { FlagProvider, UnleashClient } from '@unleash/proxy-client-react';
import fetchMock from 'fetch-mock';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { ClientContextProvider, createClient } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { MemoryRouterProps, useLocation } from 'react-router';
import {
  Routes as DomRoutes,
  Route,
  RouteProps,
  MemoryRouter as Router,
} from 'react-router-dom';
import { DeepPartial } from 'ts-essentials';

import messages from '../locales/data.json';
import { AppContext } from '../src/app/AppContext';
import { getNotificationsRegistry } from '../src/store/Store';
import { ServerStatus } from '../src/types/Server';

let setup = false;
let client;

export const appWrapperSetup = () => {
  if (setup) {
    throw new Error(
      'Looks like appWrapperCleanup has not been called, you need to call it on the afterEach'
    );
  }

  setup = true;
  fetchMock.mock();
  client = createClient({
    responseInterceptors: [validateSchemaResponseInterceptor],
  });

  getNotificationsRegistry().store.dispatch(createClearNotificationsAction());
};

export const appWrapperCleanup = () => {
  try {
    const calls = fetchMock
      .calls(false)
      .filter((c) => c.isUnmatched || c.isUnmatched === undefined);
    if (calls.length > 0) {
      throw new Error(
        `Found ${
          calls.length
        } unmatched calls, maybe you forgot to mock? : ${calls.map(
          (c) => c.request?.url || c['0']
        )}`
      );
    }
  } finally {
    setup = false;

    fetchMock.restore();
  }
};

type Config = {
  router?: MemoryRouterProps;
  route?: RouteProps;
  appContext?: Partial<Omit<AppContext, 'rbac'>> &
    DeepPartial<Pick<AppContext, 'rbac'>>;
  getLocation?: jest.Mock; // Pass a jest.fn() to get back the location hook
  skipIsBetaMock?: boolean;
};

const defaultAppContextSettings: AppContext = {
  rbac: {
    canWriteNotifications: true,
    canWriteIntegrationsEndpoints: true,
    canReadIntegrationsEndpoints: true,
    canReadNotifications: true,
    canReadEvents: true,
  },
  server: {
    status: ServerStatus.RUNNING,
  },
  isOrgAdmin: false,
};

const InternalWrapper: React.FunctionComponent<React.PropsWithChildren<Config>> = (props) => {
  const location = useLocation();

  if (props.skipIsBetaMock) {
    (getInsights().chrome.isBeta as jest.Mock).mockImplementation(() => {
      return location.pathname.startsWith('/beta/');
    });
  }

  if (props.getLocation) {
    props.getLocation.mockImplementation(() => location);
  }

  return <>{props.children}</>;
};

export const AppWrapper: React.FunctionComponent<Config> = (props) => {
  if (!setup) {
    throw new Error(
      'appWrapperSetup has not been called, you need to call it on the beforeEach'
    );
  }

  const completeAppContext = {
    ...defaultAppContextSettings,
    ...props.appContext,
    rbac: {
      ...defaultAppContextSettings.rbac,
      ...props.appContext?.rbac,
    },
  };

  const unleashClient = React.useMemo(
    () =>
      new UnleashClient({
        url: `${document.location.origin}/api/featureflags/v0`,
        clientKey: 'proxy-123',
        appName: 'web',
        fetch: () =>
          Promise.resolve({
            status: 200,
            body: {
              toggles: [],
            },
          }),
      }),
    []
  );

  const store = getNotificationsRegistry().getStore();
  return (
    <IntlProvider locale={navigator.language} messages={messages}>
      <FlagProvider unleashClient={unleashClient}>
        <Provider store={store}>
          <Router {...props.router}>
            <ClientContextProvider client={client}>
              <AppContext.Provider value={completeAppContext}>
                <NotificationsPortal />
                <InternalWrapper {...props}>
                  <DomRoutes>
                    {(props.router?.initialEntries?.length || 0) > 0 ? (
                      props.router?.initialEntries?.map((item) => (
                        <Route
                          key={item as string}
                          path={item as string}
                          {...props.route}
                        />
                      ))
                    ) : (
                      <Route path="/" {...props.route} />
                    )}
                  </DomRoutes>
                </InternalWrapper>
              </AppContext.Provider>
            </ClientContextProvider>
          </Router>
        </Provider>
      </FlagProvider>
    </IntlProvider>
  );
};

export const getConfiguredAppWrapper = (config?: Partial<Config>) => {
  const ConfiguredAppWrapper: React.FunctionComponent<React.PropsWithChildren> = (props) => {
    return (
      <AppWrapper
        {...config}
        route={{
          element: <React.Fragment>{props.children}</React.Fragment>,
          ...config?.route,
        }}
      ></AppWrapper>
    );
  };

  return ConfiguredAppWrapper;
};
