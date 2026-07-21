import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './storybook.css';
import React, { Fragment, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import { createClient, ClientContextProvider } from 'react-fetching-library';
import { MemoryRouter } from 'react-router-dom';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import {
  hccPreviewDefaults,
  StorybookMockProvider,
  FeatureFlagsProvider,
} from '@redhat-cloud-services/hcc-storybook-hub';
import messages from '../locales/data.json';
import { AppContext } from '../src/app/AppContext';
import { ServerStatus } from '../src/types/Server';

// Same OpenAPI response shaping as AppEntry so hooks that check payload.status === 200 work (e.g. useGetSeverities).
const createTestClient = () =>
  createClient({
    responseInterceptors: [validateSchemaResponseInterceptor],
  });

// Wrapper that provides a fresh client for each story
const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState(() => createTestClient());

  return <ClientContextProvider client={client}>{children}</ClientContextProvider>;
};

// Default RBAC settings for AppContext
const defaultRbac = {
  canWriteNotifications: true,
  canWriteIntegrationsEndpoints: true,
  canReadIntegrationsEndpoints: true,
  canReadNotifications: true,
  canReadEvents: true,
};

const preview: Preview = {
  ...hccPreviewDefaults,
  parameters: {
    ...hccPreviewDefaults.parameters,
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Components', '*'],
      },
    },
    chromatic: { delay: 300 },
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default configurations for all stories (can be overridden per story)
    appContext: {
      rbac: defaultRbac,
      isOrgAdmin: false,
    },
    featureFlags: {},
  },
  decorators: [
    (Story, { parameters }) => {
      // Merge AppContext from parameters with defaults
      const rbac = {
        ...defaultRbac,
        ...parameters.appContext?.rbac,
      };

      const appContextValue = {
        rbac,
        isOrgAdmin: parameters.appContext?.isOrgAdmin ?? false,
        server: {
          status: ServerStatus.RUNNING,
        },
      };

      const featureFlags = parameters.featureFlags ?? {};

      return (
        <StorybookMockProvider
          bundle="settings"
          app="notifications"
          permissions={[
            'notifications:*:*',
            'integrations:endpoints:read',
            'integrations:endpoints:write',
          ]}
        >
          <FeatureFlagsProvider value={featureFlags}>
            <ClientWrapper>
              <AppContext.Provider value={appContextValue}>
                <IntlProvider
                  locale="en"
                  messages={(messages as Record<string, Record<string, string>>)['en-US']}
                >
                  <MemoryRouter>
                    <Fragment>
                      <NotificationsProvider>
                        <Story />
                      </NotificationsProvider>
                    </Fragment>
                  </MemoryRouter>
                </IntlProvider>
              </AppContext.Provider>
            </ClientWrapper>
          </FeatureFlagsProvider>
        </StorybookMockProvider>
      );
    },
  ],
};

export default preview;
