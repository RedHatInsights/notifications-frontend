import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './storybook.css';
import React, { Fragment, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter } from 'react-router-dom';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import messages from '../locales/data.json';
import { AppContext } from '../src/app/AppContext';
import { ServerStatus } from '../src/types/Server';
import { ChromeProvider, FeatureFlagsProvider, type ChromeConfig, type FeatureFlagsConfig, type AppContextConfig } from './context-providers';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Create a client for react-fetching-library
const createTestClient = () => createClient({});

// Wrapper that provides a fresh client for each story
const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState(() => createTestClient());
  
  return (
    <ClientContextProvider client={client}>
      {children}
    </ClientContextProvider>
  );
};

// Mock insights global for Storybook
declare global {
  var insights: {
    chrome: {
      getEnvironment: () => string;
    };
  };
}

// Mock global insights object for libraries that access it directly
const mockInsightsChrome = {
  getEnvironment: () => 'prod',
  getUserPermissions: () => Promise.resolve([
    { permission: 'notifications:*:*', resourceDefinitions: [] },
    { permission: 'integrations:endpoints:read', resourceDefinitions: [] },
    { permission: 'integrations:endpoints:write', resourceDefinitions: [] },
  ]),
  auth: {
    getUser: () => Promise.resolve({
      identity: {
        user: {
          username: 'test-user',
          email: 'test@redhat.com',
          is_org_admin: true,
          is_internal: false,
        },
      },
    }),
    getToken: () => Promise.resolve('mock-jwt-token-12345'),
  },
};

if (typeof global !== 'undefined') {
  (global as any).insights = { chrome: mockInsightsChrome };
} else if (typeof window !== 'undefined') {
  (window as any).insights = { chrome: mockInsightsChrome };
}

// Default AppContext settings
const defaultAppContextSettings: AppContextConfig = {
  rbac: {
    canWriteNotifications: true,
    canWriteIntegrationsEndpoints: true,
    canReadIntegrationsEndpoints: true,
    canReadNotifications: true,
    canReadEvents: true,
  },
  isOrgAdmin: false,
};

const preview: Preview = {
  beforeAll: async () => {
    initialize({ onUnhandledRequest: 'warn' });
  },
  loaders: [mswLoader],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Components', '*'],
      },
    },
    layout: 'fullscreen',
    chromatic: { delay: 300 },
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default configurations for all stories (can be overridden per story)
    appContext: defaultAppContextSettings,
    chrome: {
      environment: 'prod',
    },
    featureFlags: {},
  },
  decorators: [
    (Story, { parameters, args }) => {
      // Merge AppContext from parameters with defaults
      const appContextSettings = {
        ...defaultAppContextSettings,
        ...parameters.appContext,
        rbac: {
          ...defaultAppContextSettings.rbac,
          ...parameters.appContext?.rbac,
        },
      };

      // Full AppContext value including server status
      const appContextValue = {
        ...appContextSettings,
        server: {
          status: ServerStatus.RUNNING,
        },
      };

      // Merge chrome config from parameters with any arg overrides
      const chromeConfig: ChromeConfig = {
        environment: 'prod',
        ...parameters.chrome,
        ...(args.environment !== undefined && { environment: args.environment }),
      };

      const featureFlags: FeatureFlagsConfig = {
        ...parameters.featureFlags,
      };

      return (
        <ClientWrapper>
          <ChromeProvider value={chromeConfig}>
            <FeatureFlagsProvider value={featureFlags}>
              <AppContext.Provider value={appContextValue}>
                <IntlProvider locale="en" messages={messages}>
                  <MemoryRouter>
                    <Fragment>
                      <NotificationsProvider>
                        <Story />
                      </NotificationsProvider>
                    </Fragment>
                  </MemoryRouter>
                </IntlProvider>
              </AppContext.Provider>
            </FeatureFlagsProvider>
          </ChromeProvider>
        </ClientWrapper>
      );
    },
  ],
};

export default preview;
