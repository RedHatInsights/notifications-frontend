import { act, render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Schemas } from '../../../../generated/OpenapiNotifications';
import { Facet } from '../../../../types/Notification';
import { BundlePageBehaviorGroupContent } from '../BundlePageBehaviorGroupContent';
import BehaviorGroup = Schemas.BehaviorGroup;
import EventType = Schemas.EventType;
import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import { getByRole, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Endpoint = Schemas.Endpoint;

const policiesApplication: Facet = {
    id: 'app-1',
    displayName: 'Policies',
    name: 'policies'
};

const driftApplication: Facet = {
    id: 'app-2',
    displayName: 'Drift',
    name: 'drift'
};

const applications: Array<Facet> = [
    policiesApplication, driftApplication
];

const bundle: Facet = {
    id: 'bundle-1',
    displayName: 'RHEL',
    name: 'rhel'
};

type NotificationWithBehaviorGroup = {
    notification: EventType,
    groups: Array<BehaviorGroup>
};

const getNotifications = (application: Facet, behaviorGroups: Array<Array<BehaviorGroup>>): Array<NotificationWithBehaviorGroup> =>
    [ ...Array(behaviorGroups.length).keys() ].map(i => ({
        notification: {
            id: `${bundle.id}.${application.id}.notif-${i}`,
            application: {
                id: application.id,
                bundle_id: bundle.id,
                name: application.name,
                display_name: application.displayName
            },
            application_id: application.id,
            display_name: `${application.displayName}-notif-${i}`,
            name: `${application.displayName}-notif-${i}`,
            description: ''
        },
        groups: behaviorGroups[i]
    }));

const getBehaviorGroups = (count: number): Array<BehaviorGroup> =>
    [ ...Array(count).keys() ].map(i => ({
        id: `bg-${i}`,
        display_name: `Behavior-${i}`,
        bundle_id: bundle.id,
        actions: []
    }));

const mockBehaviorGroups = (behaviorGroups: Array<BehaviorGroup>) => {
    fetchMock.get(`/api/notifications/v1.0/notifications/bundles/${bundle.id}/behaviorGroups`, {
        status: 200,
        body: behaviorGroups
    });
};

const mockNotifications = (notifications: Array<NotificationWithBehaviorGroup>) => {
    fetchMock.get(
        `/api/notifications/v1.0/notifications/eventTypes?bundleId=${bundle.id}&limit=20&offset=0&sort_by=e.application.displayName%3ADESC`,
        {
            status: 200,
            body: {
                data: notifications.map(n => n.notification),
                meta: {
                    count: notifications.length
                },
                links: {}
            }
        }
    );

    notifications.forEach(n => fetchMock.get(`/api/notifications/v1.0/notifications/eventTypes/${n.notification.id}/behaviorGroups`, {
        status: 200,
        body: n.groups
    }));
};

//

describe('src/pages/Notifications/List/BundlePageBehaviorGroupContent', () => {

    beforeEach(() => {
        appWrapperSetup();
        jest.useRealTimers();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Loads the behavior group and event types', async() => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        // Appears on behavior group section and in first notification
        expect(screen.getAllByText(/Behavior-0/).length).toBe(2);
        // Only appears on behavior group section
        expect(screen.getAllByText(/Behavior-1/).length).toBe(1);
    });

    it('Upon edition of a behavior group, updates the name on the notification table', async () => {
        jest.useFakeTimers();
        const behaviorGroups = getBehaviorGroups(1);
        const notifications = getNotifications(policiesApplication, [
            behaviorGroups
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        fetchMock.put(`/api/notifications/v1.0/notifications/behaviorGroups/${behaviorGroups[0].id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200,
            body: true
        });
        fetchMock.post('/api/integrations/v1.0/endpoints', {
            status: 200,
            body: {
                properties: {
                    only_admins: false,
                    group_id: undefined,
                    ignore_preferences: false
                },
                id: 'x',
                type: 'email_subscription',
                description: '',
                name: ''
            } as Endpoint
        });
        fetchMock.put(`/api/notifications/v1.0/notifications/behaviorGroups/${behaviorGroups[0].id}/actions`, {
            status: 200
        });
        fetchMock.post('/api/integrations/v1.0/endpoints/system/email_subscription', {
            description: 'email',
            name: 'email',
            id: 'e-new',
            type: 'email_subscription'
        });

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        const pf4Card = ouiaSelectors.getByOuia('PF4/Card');
        act(() => userEvent.click(getByRole(pf4Card, 'button')));

        const pf4CardDropdown = getByRole(document.body, 'menu');
        act(() => userEvent.click(getByText(pf4CardDropdown, /edit/i)));

        await waitForAsyncEvents();
        await userEvent.clear(screen.getByLabelText(/Group name/i));
        await userEvent.type(screen.getByLabelText(/Group name/i), 'Foobar');
        await waitForAsyncEvents();

        act(() => userEvent.click(getByRole(ouiaSelectors.getByOuia('Notifications/ActionTypeahead'), 'button')));
        await waitForAsyncEvents();

        act(() => userEvent.click(screen.getByText(/Send an email/i)));
        await waitForAsyncEvents();

        act(() => userEvent.click(getByRole(ouiaSelectors.getByOuia('Notifications/RecipientTypeahead'), 'button')));
        await waitForAsyncEvents();
        await act(async () => {
            jest.runAllTimers();
        });

        act(() => userEvent.click(screen.getByText('All')));
        await waitForAsyncEvents();

        behaviorGroups[0].display_name = 'Foobar';

        expect(screen.getByText(/save/i)).toHaveAttribute('aria-disabled', 'false');
        act(() => userEvent.click(screen.getByText(/save/i)));
        await waitForAsyncEvents();

        expect(screen.queryByText(/Behavior-0/i)).not.toBeInTheDocument();
        // Toast, behavior group section and table
        expect(screen.getAllByText(/Foobar/i).length).toBe(3);
    });

    it('Add group button should appear', async () => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        expect(screen.getByText(/Create new group/i)).toBeInTheDocument();
    });

    it('Add group button should be enabled with the write permissions', async () => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        expect(screen.getByText(/Create new group/i)).toBeEnabled();

        // Check that is not aria-disabled
        expect(screen.getByText(/Create new group/i)).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('Add group button should be disabled with no write permissions', async () => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper({
                appContext: {
                    rbac: {
                        canWriteNotifications: false,
                        canWriteIntegrationsEndpoints: false
                    }
                }
            })
        });

        await waitForAsyncEvents();

        // The component is not really disabled (html-wise)
        expect(screen.getByText(/Create new group/i)).toHaveAttribute('aria-disabled', 'true');
    });

    it('Add group button should tooltip with no write permissions and user is not an org_admin', async () => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper({
                appContext: {
                    rbac: {
                        canWriteNotifications: false,
                        canWriteIntegrationsEndpoints: false
                    },
                    isOrgAdmin: false
                }
            })
        });

        await waitForAsyncEvents();

        // The component is not really disabled (html-wise)
        expect(screen.getByText(/Create new group/i)).toHaveAttribute('aria-disabled', 'true');
        userEvent.hover(screen.getByText(/Create new group/i));
        expect(await screen.findByText(
            /You do not have permissions to perform this action. Contact your org admin for more information/i
        )).toBeInTheDocument();
    });

    it('Add group button should tooltip with no write permissions and user is an org_admin', async () => {
        const behaviorGroups = getBehaviorGroups(2);
        const notifications = getNotifications(policiesApplication, [
            [ behaviorGroups[0] ],
            [],
            []
        ]);

        mockNotifications(notifications);
        mockBehaviorGroups(behaviorGroups);

        render(<BundlePageBehaviorGroupContent applications={ applications } bundle={ bundle } />, {
            wrapper: getConfiguredAppWrapper({
                appContext: {
                    rbac: {
                        canWriteNotifications: false,
                        canWriteIntegrationsEndpoints: false
                    },
                    isOrgAdmin: true
                }
            })
        });

        await waitForAsyncEvents();

        // The component is not really disabled (html-wise)
        expect(screen.getByText(/Create new group/i)).toHaveAttribute('aria-disabled', 'true');
        userEvent.hover(screen.getByText(/Create new group/i));

        expect(await screen.findByText(
            /You need the Notifications administrator role to perform this action/i
        )).toBeInTheDocument();
    });
});
