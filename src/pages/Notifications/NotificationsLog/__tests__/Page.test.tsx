import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { NotificationsLogPage } from '../Page';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({ getBundle: () => 'settings', getEnvironment: () => 'prod' });
});

const mockBundles = [
  {
    id: 'bundle-1',
    name: 'rhel',
    displayName: 'Red Hat Enterprise Linux',
    children: [{ id: 'app-1', name: 'advisor', displayName: 'Advisor' }],
  },
  {
    id: 'bundle-2',
    name: 'openshift',
    displayName: 'OpenShift',
    children: [],
  },
];

const makeEvent = (id: string, withActions = true) => ({
  id,
  bundle: 'rhel',
  application: 'advisor',
  event_type: 'new-recommendation',
  created: '2024-01-15T10:00:00.000',
  severity: null,
  actions: withActions
    ? [
        {
          id: `action-${id}`,
          endpoint_id: `endpoint-${id}`,
          endpoint_type: 'webhook',
          endpoint_sub_type: null,
          status: 'SUCCESS' as const,
        },
      ]
    : [],
});

const mockEventsResponse = (events: ReturnType<typeof makeEvent>[]) => ({
  data: events,
  meta: { count: events.length },
  links: {},
});

describe('src/pages/Notifications/NotificationsLog/Page', () => {
  beforeEach(() => {
    appWrapperSetup();
    fetchMock.get(/\/api\/notifications\/v1\.0\/notifications\/facets\/bundles.*/, mockBundles);
    fetchMock.get(/\/api\/notifications\/v1\.0\/notifications\/severities.*/, []);
  });

  afterEach(() => {
    appWrapperCleanup();
  });

  it('renders the page header with correct title and subtitle', async () => {
    fetchMock.get(/\/api\/notifications\/v1\.0\/notifications\/events.*/, mockEventsResponse([]));

    render(<NotificationsLogPage />, { wrapper: getConfiguredAppWrapper() });
    await waitForAsyncEvents();

    expect(screen.getByRole('heading', { name: /notifications log/i })).toBeInTheDocument();
    expect(
      screen.getByText(/view details for all notifications delivered to my notification drawer/i)
    ).toBeInTheDocument();
  });

  it('renders the "Type" action column header', async () => {
    fetchMock.get(
      /\/api\/notifications\/v1\.0\/notifications\/events.*/,
      mockEventsResponse([makeEvent('evt-1')])
    );

    render(<NotificationsLogPage />, { wrapper: getConfiguredAppWrapper() });
    await waitForAsyncEvents();

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.queryByText('Action taken')).not.toBeInTheDocument();
  });

  it('renders events returned by the API', async () => {
    fetchMock.get(
      /\/api\/notifications\/v1\.0\/notifications\/events.*/,
      mockEventsResponse([makeEvent('evt-1'), makeEvent('evt-2')])
    );

    render(<NotificationsLogPage />, { wrapper: getConfiguredAppWrapper() });
    await waitForAsyncEvents();

    const rows = screen.getAllByRole('row');
    // 1 header row + 2 data rows
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it('shows empty state when no events are returned', async () => {
    fetchMock.get(/\/api\/notifications\/v1\.0\/notifications\/events.*/, mockEventsResponse([]));

    render(<NotificationsLogPage />, { wrapper: getConfiguredAppWrapper() });
    await waitForAsyncEvents();

    expect(screen.getByText(/no matching events found/i)).toBeInTheDocument();
  });

  it('filters out events with no actions', async () => {
    const eventsWithActions = [makeEvent('evt-1'), makeEvent('evt-2')];
    const eventsWithoutActions = [makeEvent('evt-no-action', false)];

    fetchMock.get(
      /\/api\/notifications\/v1\.0\/notifications\/events.*/,
      mockEventsResponse([...eventsWithActions, ...eventsWithoutActions])
    );

    render(<NotificationsLogPage />, { wrapper: getConfiguredAppWrapper() });
    await waitForAsyncEvents();

    const rows = screen.getAllByRole('row');
    // 1 header row + 2 data rows (event without action is excluded)
    expect(rows.length).toBe(3);
  });
});
