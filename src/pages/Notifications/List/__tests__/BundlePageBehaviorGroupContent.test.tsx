/* eslint-disable testing-library/prefer-screen-queries, testing-library/no-unnecessary-act */
import {
  findByLabelText,
  findByRole,
  findByText,
  getAllByRole,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Schemas } from '../../../../generated/OpenapiNotifications';
import { Facet } from '../../../../types/Notification';
import { BundlePageBehaviorGroupContent } from '../BundlePageBehaviorGroupContent';
import BehaviorGroup = Schemas.BehaviorGroup;
import EventType = Schemas.EventType;
import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import userEvent from '@testing-library/user-event';
import Endpoint = Schemas.Endpoint;

beforeEach(() => {
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
      pathname: '/settings/notifications',
      search: '?activeTab=behaviorGroups',
      hash: '',
      state: {},
      key: 'defaultKey',
    }),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

const policiesApplication: Facet = {
  id: 'app-1',
  displayName: 'Policies',
  name: 'policies',
};

const driftApplication: Facet = {
  id: 'app-2',
  displayName: 'Drift',
  name: 'drift',
};

const applications: Array<Facet> = [policiesApplication, driftApplication];

const bundle: Facet = {
  id: 'bundle-1',
  displayName: 'RHEL',
  name: 'rhel',
};

type NotificationType = {
  notification: EventType;
};

const getNotifications = (
  application: Facet,
  count: number
): Array<NotificationType> =>
  [...Array(count).keys()].map((i) => ({
    notification: {
      id: `${bundle.id}.${application.id}.notif-${i}`,
      application: {
        id: application.id,
        bundle_id: bundle.id,
        name: application.name,
        display_name: application.displayName,
      },
      application_id: application.id,
      display_name: `${application.displayName}-notif-${i}`,
      name: `${application.displayName}-notif-${i}`,
      description: '',
    },
  }));

const getBehaviorGroups = (
  requestedBehaviorGroups: Array<Array<NotificationType>>
): Array<BehaviorGroup> =>
  [...Array(requestedBehaviorGroups.length).keys()].map((i) => ({
    id: `bg-${i}`,
    display_name: `Behavior-${i}`,
    bundle_id: bundle.id,
    actions: [],
    behaviors: requestedBehaviorGroups[i].map((b) => ({
      event_type: b.notification,
    })),
  }));

const mockBehaviorGroups = (behaviorGroups: Array<BehaviorGroup>) => {
  fetchMock.get(
    `/api/notifications/v1.0/notifications/bundles/${bundle.id}/behaviorGroups`,
    {
      status: 200,
      body: behaviorGroups,
    }
  );
};

const mockNotifications = (notifications: Array<NotificationType>) => {
  fetchMock.get(
    (urlString: string) => {
      const url = new URL(urlString, 'http://dummy-url.com');
      return (
        url.pathname === '/api/notifications/v1.0/notifications/eventTypes' &&
        url.searchParams.get('bundleId') === bundle.id
      );
    },
    {
      status: 200,
      body: {
        data: notifications.map((n) => n.notification),
        meta: {
          count: notifications.length,
        },
        links: {},
      },
    }
  );
};

let getUser;

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    auth: { getUser },
  });
});

describe('src/pages/Notifications/List/BundlePageBehaviorGroupContent', () => {
  beforeEach(() => {
    appWrapperSetup();
    jest.useRealTimers();
    getUser = async () => ({
      identity: {
        user: {
          is_org_admin: true,
        },
      },
    });
  });

  afterEach(() => {
    appWrapperCleanup();
  });

  it('Loads the behavior group and event types', async () => {
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    behaviorGroups[0].behaviors = [
      {
        event_type: notifications[0].notification,
      },
    ];

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper(),
      }
    );

    await waitForAsyncEvents();

    // Appears on behavior group section and in first notification
    expect(screen.getAllByText(/Behavior-0/).length).toBe(2);
    // Only appears on behavior group section
    expect(screen.getAllByText(/Behavior-1/).length).toBe(1);
  });

  it('Upon addition of a behavior group, updates the name on the notification table and the linked event types', async () => {
    const notifications = getNotifications(policiesApplication, 1);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    behaviorGroups[1].display_name = 'Baz';

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    fetchMock.put(
      `/api/notifications/v1.0/notifications/behaviorGroups/${behaviorGroups[0].id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
        body: true,
      }
    );
    fetchMock.post('/api/integrations/v1.0/endpoints', {
      status: 200,
      body: {
        properties: {
          only_admins: false,
          group_id: undefined,
          ignore_preferences: false,
        },
        id: 'x',
        type: 'email_subscription',
        description: '',
        name: '',
      } as Endpoint,
    });
    fetchMock.post(
      '/api/integrations/v1.0/endpoints/system/email_subscription',
      {
        description: 'email',
        name: 'email',
        id: 'e-new',
        type: 'email_subscription',
      }
    );

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper(),
      }
    );

    await waitFor(() => expect(screen.getAllByText('Baz').length).toBe(1)); // Only once, the behavior group card

    const behaviorGroupsTab = getAllByRole(document.body, 'tab');
    await userEvent.click(
      await findByText(behaviorGroupsTab[1], 'Behavior Groups')
    );

    const pf4Card = ouiaSelectors.getAllByOuia('PF4/Card');
    expect(await findByLabelText(pf4Card[0], 'Actions')).toBeInTheDocument();
    await userEvent.click(await findByLabelText(pf4Card[0], 'Actions'));

    expect(await findByRole(document.body, 'menu')).toBeInTheDocument();
    const pf4CardDropdown = await findByRole(document.body, 'menu');
    await userEvent.click(await findByText(pf4CardDropdown, /edit/i));

    expect(await screen.findByLabelText(/Group name/i)).toBeInTheDocument();
    await userEvent.clear(await screen.findByLabelText(/Group name/i));
    await userEvent.type(await screen.findByLabelText(/Group name/i), 'Foobar');

    await userEvent.click(await screen.findByText(/Next/i));

    expect(
      await findByRole(
        ouiaSelectors.getByOuia('Notifications/ActionTypeahead'),
        'button'
      )
    ).toBeInTheDocument();
    await userEvent.click(
      await findByRole(
        ouiaSelectors.getByOuia('Notifications/ActionTypeahead'),
        'button'
      )
    );
    expect(await screen.findByText(/Send an email/i)).toBeInTheDocument();
    await userEvent.click(await screen.findByText(/Send an email/i));

    expect(
      await findByRole(
        ouiaSelectors.getByOuia('Notifications/RecipientTypeahead'),
        'button'
      )
    ).toBeInTheDocument();
    await userEvent.click(
      await findByRole(
        ouiaSelectors.getByOuia('Notifications/RecipientTypeahead'),
        'button'
      )
    );

    expect(await screen.findByText('All')).toBeInTheDocument();
    await userEvent.click(await screen.findByText('All'));

    // Changing name of behavior 1
    behaviorGroups[0].display_name = 'Foobar';

    // Attaching behavior 2 to notification 0
    behaviorGroups[1].behaviors = [
      {
        event_type: notifications[0].notification,
      },
    ];

    await userEvent.click(await screen.findByText(/next/i));
    await userEvent.click(await screen.findByText(/next/i));

    expect(await screen.findByText(/finish/i)).toHaveAttribute(
      'aria-disabled',
      'false'
    );
    await userEvent.click(await screen.findByText(/finish/i));

    await waitFor(() =>
      expect(screen.queryByText(/Behavior-0/i)).not.toBeInTheDocument()
    );
    // Toast, behavior group section and table
    await waitFor(() => expect(screen.getAllByText(/Foobar/i).length).toBe(3));
    // behavior group and table
    await waitFor(() => expect(screen.getAllByText(/Baz/i).length).toBe(2));
  });

  it('Add group button should appear', async () => {
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper(),
      }
    );

    await waitForAsyncEvents();

    expect(await screen.findByText(/Create new group/i)).toBeInTheDocument();
  });

  it('Add group button should be enabled with the write permissions', async () => {
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper(),
      }
    );

    expect(await screen.findByText(/Create new group/i)).toBeEnabled();

    // Check that is not aria-disabled
    expect(await screen.findByText(/Create new group/i)).not.toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('Opens in the correct tab if parameter is present', async () => {
    render(
      <MemoryRouter
        initialEntries={['/settings/notifications?activeTab=behaviorGroups']}
      >
        <BundlePageBehaviorGroupContent
          applications={applications}
          bundle={bundle}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Behavior groups')).toBeInTheDocument();
  });

  it('Add group button should be disabled with no write permissions', async () => {
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteNotifications: false,
              canWriteIntegrationsEndpoints: false,
            },
          },
        }),
      }
    );

    // The component is not really disabled (html-wise)
    expect(await screen.findByText(/Create new group/i)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('Add group button should tooltip with no write permissions and user is not an org_admin', async () => {
    getUser = async () => ({
      identity: {
        user: {
          is_org_admin: false,
        },
      },
    });
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteNotifications: false,
              canWriteIntegrationsEndpoints: false,
            },
            isOrgAdmin: false,
          },
        }),
      }
    );

    expect(await screen.findByText(/Create new group/i)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    await userEvent.hover(await screen.findByText(/Create new group/i));
    await screen.findByText(
      /You do not have permissions to perform this action. Contact your org admin for more information/i
    );
  });

  it('Add group button should tooltip with no write permissions and user is an org_admin', async () => {
    const notifications = getNotifications(policiesApplication, 3);
    const behaviorGroups = getBehaviorGroups([[notifications[0]], []]);

    mockNotifications(notifications);
    mockBehaviorGroups(behaviorGroups);

    render(
      <BundlePageBehaviorGroupContent
        applications={applications}
        bundle={bundle}
      />,
      {
        wrapper: getConfiguredAppWrapper({
          appContext: {
            rbac: {
              canWriteNotifications: false,
              canWriteIntegrationsEndpoints: false,
            },
            isOrgAdmin: true,
          },
        }),
      }
    );

    // The component is not really disabled (html-wise)
    expect(await screen.findByText(/Create new group/i)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    await userEvent.hover(await screen.findByText(/Create new group/i));

    expect(
      await screen.findByText(
        /You need the Notifications administrator role to perform this action/i
      )
    ).toBeInTheDocument();
  });
});
