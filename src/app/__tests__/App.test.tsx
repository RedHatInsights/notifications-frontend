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
import { KESSEL_WORKSPACE_RELATIONS } from '../rbac/kesselWorkspaceRelations';

import * as kesselSdk from '@project-kessel/react-kessel-access-check';

jest.mock('@project-kessel/react-kessel-access-check', () => {
  const actual = jest.requireActual('@project-kessel/react-kessel-access-check');
  return {
    ...actual,
    AccessCheck: {
      Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    },
    useSelfAccessCheck: jest.fn().mockReturnValue({ data: undefined, loading: true }),
    fetchDefaultWorkspace: jest.fn().mockResolvedValue({ id: 'test-workspace-id' }),
  };
});

jest.mock('../../pages/Notifications/List/Page', () => {
  const MockedRoutes: React.FunctionComponent = () => <div data-testid="content" />;
  return {
    NotificationsListPage: MockedRoutes,
  };
});

jest.mock('../../pages/Integrations/List/Page', () => {
  const MockedRoutes: React.FunctionComponent = () => <div data-testid="content" />;
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
      getUser: () => Promise.resolve({ identity: { user: { is_org_admin: true } } }),
    },
  });
});

const allPermissionsAllowed = Object.values(KESSEL_WORKSPACE_RELATIONS).map((relation) => ({
  allowed: true,
  relation,
}));

const limitedPermissions = Object.values(KESSEL_WORKSPACE_RELATIONS).map((relation) => ({
  allowed:
    relation === KESSEL_WORKSPACE_RELATIONS.NOTIFICATIONS_NOTIFICATIONS_EDIT ||
    relation === KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW ||
    relation === KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT,
  relation,
}));

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

    (kesselSdk.useSelfAccessCheck as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
    });

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

    (kesselSdk.useSelfAccessCheck as jest.Mock).mockReturnValue({
      data: allPermissionsAllowed,
      loading: false,
    });

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

  it('Shows overview page even without read access at /', async () => {
    jest.useFakeTimers();

    (kesselSdk.useSelfAccessCheck as jest.Mock).mockReturnValue({
      data: limitedPermissions,
      loading: false,
    });

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

    expect(screen.queryByText(/You do not have access to Notifications/i)).not.toBeInTheDocument();
  });
});
