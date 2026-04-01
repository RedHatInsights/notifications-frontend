import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
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
import { KESSEL_WORKSPACE_RELATIONS_ORDERED } from '../rbac/kesselWorkspaceRelations';

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
      getToken: () => Promise.resolve('mock-token'),
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

const mockKesselBulkPairs = (
  allowedPerRelation: boolean[] = KESSEL_WORKSPACE_RELATIONS_ORDERED.map(
    () => true
  )
) => ({
  pairs: allowedPerRelation.map((allowed) => ({
    item: {
      allowed: allowed ? 'ALLOWED_TRUE' : 'ALLOWED_FALSE',
    },
  })),
});

const mockKesselAndDefaultWorkspace = () => {
  fetchMock.get(
    /\/api\/rbac\/v2\/workspaces\/\?type=default/,
    {
      status: 200,
      body: {
        data: [
          {
            id: '00000000-0000-0000-0000-000000000001',
            type: 'default',
            name: 'Default',
            created: '2020-01-01T00:00:00.000Z',
            modified: '2020-01-01T00:00:00.000Z',
          },
        ],
      },
    },
    { overwriteRoutes: true }
  );
  fetchMock.post(
    /\/api\/kessel\/v1beta2\/checkselfbulk/,
    {
      status: 200,
      body: mockKesselBulkPairs(),
    },
    { overwriteRoutes: true }
  );
  fetchMock.get(
    /\/api\/rbac\/v1\/groups/,
    {
      status: 200,
      body: {
        data: [],
        meta: { count: 0 },
      },
    },
    { overwriteRoutes: true }
  );
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

  it('Shows loading when default workspace is not resolved', async () => {
    jest.useFakeTimers();
    fetchMock.get(
      /\/api\/rbac\/v2\/workspaces\/\?type=default/,
      () => new Promise(() => {}),
      { overwriteRoutes: true }
    );
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
    mockKesselAndDefaultWorkspace();

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

    await waitForAsyncEvents();
    // eslint-disable-next-line testing-library/prefer-presence-queries, jest-dom/prefer-in-document
    expect(screen.queryAllByText('content')).toBeTruthy();
  });

  it('Shows error when RBAC does not have read access when /notifications', async () => {
    jest.useFakeTimers();
    mockMaintenance(true);
    fetchMock.get(
      /\/api\/rbac\/v2\/workspaces\/\?type=default/,
      {
        status: 200,
        body: {
          data: [
            {
              id: '00000000-0000-0000-0000-000000000001',
              type: 'default',
              name: 'Default',
              created: '2020-01-01T00:00:00.000Z',
              modified: '2020-01-01T00:00:00.000Z',
            },
          ],
        },
      },
      { overwriteRoutes: true }
    );
    const deniedNotificationsView = KESSEL_WORKSPACE_RELATIONS_ORDERED.map(
      (rel) => (rel === 'notifications_notifications_view' ? false : true)
    );
    fetchMock.post(
      /\/api\/kessel\/v1beta2\/checkselfbulk/,
      {
        status: 200,
        body: mockKesselBulkPairs(deniedNotificationsView),
      },
      { overwriteRoutes: true }
    );
    fetchMock.get(
      /\/api\/rbac\/v1\/groups/,
      {
        status: 200,
        body: {
          data: [],
          meta: { count: 0 },
        },
      },
      { overwriteRoutes: true }
    );

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
