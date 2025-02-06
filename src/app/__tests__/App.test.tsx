import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import {
  Rbac,
  fetchRBAC,
} from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import messages from '../../../locales/data.json';
import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../test/TestUtils';
import App from '../App';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
  const real = jest.requireActual(
    '@redhat-cloud-services/insights-common-typescript'
  );
  return {
    ...real,
    fetchRBAC: jest.fn(real.fetchRBAC),
  };
});

jest.mock('../../pages/Notifications/List/Page', () => {
  const MockedRoutes: React.FunctionComponent = () => (
    <div data-testid="content" />
  );
  return {
    NotificationsListPage: MockedRoutes,
  };
});

jest.mock('../../pages/Integrations/List/Page', () => {
  const MockedRoutes: React.FunctionComponent = () => (
    <div data-testid="content" />
  );
  return {
    IntegrationsListPage: MockedRoutes,
  };
});

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    getBundle: () => 'foo',
    getApp: () => 'notifications',
    isBeta: () => false,
    getEnvironment: () => 'bar',
    auth: {
      getUser: () =>
        Promise.resolve({ identity: { user: { is_org_admin: true } } }),
    },
  });
});

const mockMaintenance = (isUp: boolean) => {
  const response = isUp
    ? {
        data: [],
        links: {},
        meta: {
          count: 0,
        },
      }
    : {};

  fetchMock.get('/api/notifications/v1.0/notifications/events', {
    status: 200,
    body: response,
  });
};

describe('src/app/App', () => {
  beforeEach(() => {
    appWrapperSetup();
    fetchMock.get(`/api/featureflags/v0`, {
      body: {
        toggles: [],
      },
    });
  });

  afterEach(() => {
    appWrapperCleanup();
  });

  it('Shows loading when RBAC is not set', async () => {
    jest.useFakeTimers();
    const promise = new Promise<Rbac>(() => {
      return 'foo';
    });
    const Wrapper = getConfiguredAppWrapper({
      route: {
        path: '/',
      },
    });
    (fetchRBAC as jest.Mock).mockImplementation(() => promise);
    render(
      <IntlProvider locale={navigator.language} messages={messages}>
        <App />
      </IntlProvider>,
      {
        wrapper: Wrapper,
      }
    );
    mockMaintenance(true);

    await act(async () => {
      await jest.advanceTimersToNextTimer();
    });

    expect(ouiaSelectors.getByOuia('AppSkeleton')).toBeTruthy();

    jest.restoreAllMocks();
  });

  it('Shows the content when read is set', async () => {
    jest.useFakeTimers();
    mockMaintenance(true);

    const Wrapper = getConfiguredAppWrapper({
      route: {
        path: '/',
      },
    });

    const rbac = new Rbac({
      integrations: {
        endpoints: ['read', 'write'],
      },
      notifications: {
        notifications: ['read', 'write'],
      },
    });
    (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(rbac));
    render(
      <IntlProvider locale={navigator.language} messages={messages}>
        <App />
      </IntlProvider>,
      {
        wrapper: Wrapper,
      }
    );

    await act(async () => {
      await jest.advanceTimersToNextTimer();
    });

    await waitForAsyncEvents();
    // eslint-disable-next-line testing-library/prefer-presence-queries, jest-dom/prefer-in-document
    expect(screen.queryAllByText('content')).toBeTruthy();
  });

  it('Shows error when RBAC does not have read access when /notifications', async () => {
    jest.useFakeTimers();
    const rbac = new Rbac({
      integrations: {
        endpoints: ['read', 'write'],
      },
      notifications: {
        notifications: ['write'],
      },
    });
    (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(rbac));
    mockMaintenance(true);

    const Wrapper = getConfiguredAppWrapper({
      route: {
        path: '/',
      },
    });

    render(
      <IntlProvider locale={navigator.language} messages={messages}>
        <App />
      </IntlProvider>,
      {
        wrapper: Wrapper,
      }
    );

    await act(async () => {
      await jest.advanceTimersToNextTimer();
    });

    expect(
      screen.getByText(/You do not have access to Notifications/i)
    ).toBeInTheDocument();
  });
});
