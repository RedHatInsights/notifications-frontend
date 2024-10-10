/* eslint-disable testing-library/prefer-screen-queries, testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Schemas } from '../../../../generated/OpenapiIntegrations';
import { IntegrationsListPage } from '../Page';
import Endpoint = Schemas.Endpoint;
import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import { getByLabelText, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({ getBundle: () => 'foo', getEnvironment: () => 'bar' });
});

describe('src/pages/Integrations/List/Page', () => {
  beforeEach(() => {
    appWrapperSetup();
  });

  afterEach(() => {
    appWrapperCleanup();
  });

  describe('RBAC', () => {
    it('Create button is disabled when write permissions is false', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteIntegrationsEndpoints: false,
            },
          },
        }),
      });

      await waitForAsyncEvents();
      expect(screen.getByText(/add integration/i)).toBeDisabled();
    });

    it('Create button is enabled when write permissions is true', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper(),
      });

      await waitForAsyncEvents();
      expect(screen.getByText(/add integration/i)).toBeEnabled();
    });

    it('Enabled switch is disabled when write permissions is false', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteIntegrationsEndpoints: false,
            },
          },
        }),
      });

      await waitForAsyncEvents();

      expect(
        getByLabelText(
          ouiaSelectors.getByOuia('Notifications/Integrations/Table'),
          /Enabled/i
        )
      ).toBeDisabled();
    });

    it('Enabled switch is enabled when write permissions is true', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper(),
      });

      await waitForAsyncEvents();
      expect(
        getByLabelText(
          ouiaSelectors.getByOuia('Notifications/Integrations/Table'),
          /Enabled/i
        )
      ).toBeEnabled();
    });

    it('Action menu elements are disabled when write permissions is false', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteIntegrationsEndpoints: false,
            },
          },
        }),
      });

      await waitForAsyncEvents();

      const dropdownContainer = getByLabelText(
        ouiaSelectors.getByOuia('Notifications/Integrations/Table'),
        'Kebab toggle'
      );

      await userEvent.click(dropdownContainer);

      expect(
        getByText(dropdownContainer.parentElement as HTMLElement, /Edit/i)
      ).toBeEnabled();
      expect(
        getByText(dropdownContainer.parentElement as HTMLElement, /Delete/i)
      ).toBeEnabled();
      expect(
        getByText(
          dropdownContainer.parentElement as HTMLElement,
          /(Enable|Disable)/i
        )
      ).toBeEnabled();
    });

    it('Action menu elements are enabled when write permissions is true', async () => {
      fetchMock.getOnce(/\/api\/integrations\/v1\.0\/endpoints.*/, {
        data: [
          {
            id: '2432',
            type: 'webhook',
            created: Date.now().toString(),
            description: 'My integration desc',
            enabled: true,
            name: 'my integration name',
            properties: {
              basic_authentication: undefined,
              disable_ssl_verification: false,
              method: 'GET',
              secret_token: undefined,
              url: 'http://foo',
            },
            updated: Date.now().toString(),
          } as Endpoint,
        ],
        meta: { count: 1 },
        links: {},
      });

      fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

      render(<IntegrationsListPage />, {
        wrapper: getConfiguredAppWrapper(),
      });

      await waitForAsyncEvents();
      const dropdownContainer = getByLabelText(
        ouiaSelectors.getByOuia('Notifications/Integrations/Table'),
        'Kebab toggle'
      );

      await userEvent.click(dropdownContainer);

      expect(
        getByText(dropdownContainer.parentElement as HTMLElement, /Edit/i)
      ).toBeEnabled();
      expect(
        getByText(dropdownContainer.parentElement as HTMLElement, /Delete/i)
      ).toBeEnabled();
      expect(
        getByText(
          dropdownContainer.parentElement as HTMLElement,
          /(Enable|Disable)/i
        )
      ).toBeEnabled();
    });
  });
});
