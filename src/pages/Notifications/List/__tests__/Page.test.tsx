import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import {
    Environment,
    getInsights,
    InsightsType
} from '@redhat-cloud-services/insights-common-typescript';
import { getByLabelText, queryAllByLabelText } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import { mockInsights } from 'insights-common-typescript-dev';
import * as React from 'react';
import { MemoryRouterProps, RouteProps } from 'react-router';

import {
    appWrapperCleanup,
    appWrapperSetup,
    getConfiguredAppWrapper
} from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { VerboseErrorBoundary } from '../../../../../test/VerboseErrorBoundary';
import { Schemas } from '../../../../generated/OpenapiIntegrations';
import { linkTo } from '../../../../Routes';
import { NotificationsListPage } from '../Page';
import Facet = Schemas.Facet;

type RouterAndRoute = {
  router: MemoryRouterProps;
  route: RouteProps;
};

const routePropsPageForBundle = (bundle: string): RouterAndRoute => ({
    router: {
        initialEntries: [ `/notifications/${bundle}` ]
    },
    route: {
        path: linkTo.notifications(':bundleName')
    }
});

const mockEnvironment = (env: Environment) => {

    const insightsEnv = env.replace('-beta', '');
    const isBeta = env.endsWith('-beta');
    const isProd = env.startsWith('prod');

    mockInsights({
        chrome: {
            ...getInsights().chrome,
            getEnvironment: () => insightsEnv as ReturnType<InsightsType['chrome']['getEnvironment']>,
            isProd,
            isBeta: () => isBeta
        }
    });
};

const defaultEventTypeId = 'my-event-type-id';

const mockFacets = (bundles?: Array<Facet> | null | Promise<any>, applications?: Array<Facet> | null | Promise<any>) => {
    if (bundles !== null) {
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles?includeApplications=false',
            (bundles as any)?.then ? bundles as Promise<any> : {
                body: bundles ?? [
                    {
                        displayName: 'Red Hat Enterprise Linux',
                        name: 'rhel',
                        id: 'foobar'
                    }
                ] as Array<Schemas.Facet>
            });
    }

    if (applications !== null) {
        fetchMock.get(
            '/api/notifications/v1.0/notifications/facets/applications?bundleName=rhel',
            (applications as any)?.then ? applications as Promise<any> :
                {
                    body: applications ?? [
                        {
                            displayName: 'Policies',
                            name: 'policies',
                            id: 'foobar-policy'
                        }
                    ] as Array<Schemas.Facet>
                }
        );
    }
};

const mockEventTypes = (eventTypeId: string = defaultEventTypeId) => {
    fetchMock.get(defaultGetEventTypesUrl, {
        body: {
            links: {},
            meta: {
                count: 1
            },
            data: [
                {
                    application_id: 'app',
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        id: 'app',
                        bundle_id: 'my-bundle-id',
                        name: 'app',
                        updated: Date.now().toString()
                    },
                    display_name: 'display_name',
                    id: eventTypeId,
                    name: 'mmmokay'
                }
            ]
        } as Schemas.PageEventType
    });
};

const mockNoEventTypes = () => {
    fetchMock.get(defaultGetEventTypesUrl, {
        body: {
            links: {},
            data: [],
            meta: {
                count: 0
            }
        } as Schemas.PageEventType
    });
};

const mockBehaviorGroup = () => {
    fetchMock.get('/api/notifications/v1.0/notifications/bundles/foobar/behaviorGroups', {
        body: [
            {
                created: '2021-05-05T18:14:46.618528',
                id: 'c06e3a00-3005-4576-b45a-94cd1d2337f2',
                display_name: 'Stuff',
                bundle_id: 'my-bundle-id',
                actions: [
                    {
                        created: '2021-05-05T18:14:47.291189',
                        id: {
                            behaviorGroupId: 'c06e3a00-3005-4576-b45a-94cd1d2337f2',
                            endpointId: 'ea9cbec3-9ac6-42bb-9e70-7a73e1eeb673'
                        },
                        endpoint: {
                            created: '2021-05-05T18:14:46.974783',
                            id: 'ea9cbec3-9ac6-42bb-9e70-7a73e1eeb673',
                            name: 'Email subscription',
                            description: '',
                            enabled: true,
                            type: 'email_subscription',
                            properties: {
                                only_admins: false,
                                group_id: undefined,
                                ignore_preferences: false
                            }
                        }
                    },
                    {
                        created: '2021-05-05T21:42:58.005847',
                        id: {
                            behaviorGroupId: 'c06e3a00-3005-4576-b45a-94cd1d2337f2',
                            endpointId: '89025967-e843-4a84-8dbc-87f26cb8e5a6'
                        },
                        endpoint: {
                            created: '2021-05-04T22:48:55.579464',
                            id: '89025967-e843-4a84-8dbc-87f26cb8e5a6',
                            name: 'Webhook 1',
                            description: '',
                            enabled: true,
                            type: 'webhook',
                            properties: {
                                url: 'https://webhook.site/1510a88f-ca26-4938-b29d-3b0ad85ae705',
                                method: 'POST',
                                disable_ssl_verification: false,
                                secret_token: null,
                                basic_authentication: null
                            }
                        }
                    },
                    {
                        created: '2021-05-05T21:42:58.007177',
                        id: {
                            behaviorGroupId: 'c06e3a00-3005-4576-b45a-94cd1d2337f2',
                            endpointId: '116979f1-0e1c-4dbe-add0-74ec623bfcca'
                        },
                        endpoint: {
                            created: '2021-05-04T22:49:01.19272',
                            id: '116979f1-0e1c-4dbe-add0-74ec623bfcca',
                            name: 'Webhook 2',
                            description: '',
                            enabled: true,
                            type: 'webhook',
                            properties: {
                                url: 'https://webhook.site/1510a88f-ca26-4938-b29d-3b0ad85ae705',
                                method: 'POST',
                                disable_ssl_verification: false,
                                secret_token: null,
                                basic_authentication: null
                            }
                        }
                    },
                    {
                        created: '2021-05-05T23:07:12.091362',
                        id: {
                            behaviorGroupId: 'c06e3a00-3005-4576-b45a-94cd1d2337f2',
                            endpointId: '3a23c473-b376-431f-9a07-74dbe980107e'
                        },
                        endpoint: {
                            created: '2021-05-04T22:49:06.040102',
                            id: '3a23c473-b376-431f-9a07-74dbe980107e',
                            name: 'Slack',
                            description: '',
                            enabled: true,
                            type: 'webhook',
                            properties: {
                                url: 'https://webhook.site/1510a88f-ca26-4938-b29d-3b0ad85ae705',
                                method: 'POST',
                                disable_ssl_verification: false,
                                secret_token: null,
                                basic_authentication: null
                            }
                        }
                    }
                ]
            },
            {
                created: '2021-05-05T18:14:40.698201',
                id: '412e37bf-b669-46da-8e19-c031c40df410',
                display_name: 'more',
                bundle_id: 'my-bundle-id',
                actions: [
                    {
                        created: '2021-05-05T18:14:41.406439',
                        id: {
                            behaviorGroupId: '412e37bf-b669-46da-8e19-c031c40df410',
                            endpointId: '128e2ef3-9b2e-43cc-b97e-bbec91b643f4'
                        },
                        endpoint: {
                            created: '2021-05-05T18:14:41.064672',
                            id: '128e2ef3-9b2e-43cc-b97e-bbec91b643f4',
                            name: 'Email subscription',
                            description: '',
                            enabled: true,
                            type: 'email_subscription',
                            properties: {
                                only_admins: false,
                                group_id: undefined,
                                ignore_preferences: false
                            }
                        }
                    }
                ]
            },
            {
                created: '2021-05-05T18:14:33.482023',
                id: '6945a772-9b37-4748-b4fe-01a33472ff17',
                display_name: 'xyz',
                bundle_id: 'my-bundle-id',
                actions: [
                    {
                        created: '2021-05-05T18:14:34.198221',
                        id: {
                            behaviorGroupId: '6945a772-9b37-4748-b4fe-01a33472ff17',
                            endpointId: '2dce7e14-d0bc-4e07-a8b6-835fe61709cb'
                        },
                        endpoint: {
                            created: '2021-05-05T18:14:33.854982',
                            id: '2dce7e14-d0bc-4e07-a8b6-835fe61709cb',
                            name: 'Email subscription',
                            description: '',
                            enabled: true,
                            type: 'email_subscription',
                            properties: {
                                only_admins: false,
                                group_id: undefined,
                                ignore_preferences: false
                            }
                        }
                    }
                ]
            }
        ] as Array<Schemas.BehaviorGroup>
    });
};

const defaultGetEventTypesUrl =
  '/api/notifications/v1.0/notifications/eventTypes?bundleId=foobar&limit=20&offset=0&sort_by=e.application.displayName%3ADESC';

const mockBehaviorGroupsOfEventTypes = (eventTypeId: string = defaultEventTypeId, returnEmpty?: boolean) => {
    fetchMock.get(`/api/notifications/v1.0/notifications/eventTypes/${eventTypeId}/behaviorGroups`, {
        body: returnEmpty ? [] : [
            {
                bundle_id: 'my-bundle-id',
                created: '2021-05-04T22:08:07.268356',
                display_name: 'Behavior group 4',
                id: 'c06e3a00-3005-4576-b45a-94cd1d2337f2'
            }
        ]
    });
};

describe('src/pages/Notifications/List/Page', () => {
    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('If the bundle is not found, redirects to rhel', async () => {
        mockNoEventTypes();
        mockFacets();
        mockBehaviorGroup();

        const getLocation = jest.fn();
        render(<NotificationsListPage />, {
            wrapper: getConfiguredAppWrapper({
                ...routePropsPageForBundle('i-dont-exist'),
                getLocation
            })
        });

        await waitForAsyncEvents();
        expect(getLocation().pathname).toBe('/notifications/rhel');
    });

    it('Throws error if bundles fails o load', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        mockFacets({} as any, null);

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>,
            {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('i-dont-exist')
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            screen.getByText(/Error: Unable to load bundle information/i)
        ).toBeTruthy();
        err.mockRestore();
    });

    it('Throws error if default bundle is not found', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        mockFacets([], null);

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>,
            {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            screen.getByText(/Error: Default bundle information not found/i)
        ).toBeTruthy();
        err.mockRestore();
    });

    it('Throws error if applications fails to load', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        mockFacets(undefined, {} as any);

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>,
            {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('i-dont-exist')
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            screen.getByText(/Error: Unable to load application facets/i)
        ).toBeTruthy();
        err.mockRestore();
    });

    it('Shows loading when loading bundles', async () => {
        let resolve: any;
        mockFacets(new Promise((_resolve) => (resolve = _resolve)), null);
        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>,
            {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/loading/i)).toBeTruthy();
        resolve();
        await waitForAsyncEvents();
    });

    it('Shows loading when loading applications', async () => {
        let resolve: any;
        mockFacets(undefined, new Promise((_resolve) => (resolve = _resolve)));

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>,
            {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/loading/i)).toBeTruthy();
        resolve();
        await waitForAsyncEvents();
    });

    it('Renders notifications list', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [] as Array<Schemas.Endpoint>
        });
        mockNoEventTypes();
        mockFacets();
        mockBehaviorGroup();
        render(<NotificationsListPage />, {
            wrapper: getConfiguredAppWrapper({
                ...routePropsPageForBundle('rhel')
            })
        });

        await waitForAsyncEvents();
        expect(
            ouiaSelectors.getByOuia('Notifications/Notifications/Table')
        ).toBeTruthy();
    });

    describe('Clicking edit button of notification row', () => {
        it('Sets in edit mode', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            mockEventTypes(defaultEventTypeId);
            fetchMock.get(`/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`, {
                body: []
            });
            mockFacets();
            mockBehaviorGroup();
            mockBehaviorGroupsOfEventTypes();
            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });
            await waitForAsyncEvents();

            const table = ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table');

            userEvent.click(
                getByLabelText(
                    table,
                    /edit/i
                )
            );

            await waitForAsyncEvents();
            expect(getByLabelText(table, /done/)).toBeVisible();
            expect(getByLabelText(table, /cancel/)).toBeVisible();
        });

        it('and then cancel, removes done/cancel', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            mockEventTypes(defaultEventTypeId);
            fetchMock.get(`/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`, {
                body: []
            });
            mockFacets();
            mockBehaviorGroup();
            mockBehaviorGroupsOfEventTypes();
            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();
            const table = ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table');

            userEvent.click(
                getByLabelText(
                    table,
                    /edit/i
                )
            );

            await waitForAsyncEvents();
            userEvent.click(
                getByLabelText(
                    table,
                    /cancel/i
                )
            );

            expect(getByLabelText(table, /edit/)).toBeVisible();
            expect(queryAllByLabelText(table, /cancel/).length).toBe(0);
            expect(queryAllByLabelText(table, /done/).length).toBe(0);
        });

        it('and then save closes the modal and shows a notification if no changes are made', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            mockEventTypes(defaultEventTypeId);
            fetchMock.get(`/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`, {
                body: []
            });
            mockFacets();
            mockBehaviorGroup();
            mockBehaviorGroupsOfEventTypes();

            let saveLoadingResolver;
            fetchMock.put(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}/behaviorGroups`,
                new Promise(resolve => saveLoadingResolver = resolve)
            );

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();
            const table = ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table');

            userEvent.click(
                getByLabelText(
                    table,
                    /edit/i
                )
            );

            await waitForAsyncEvents();
            userEvent.click(
                getByLabelText(
                    table,
                    /done/i
                )
            );

            await waitForAsyncEvents();
            expect(getByLabelText(table, /done/)).toBeDisabled();
            expect(getByLabelText(table, /cancel/)).toBeDisabled();

            saveLoadingResolver({
                status: 200
            });
            await waitForAsyncEvents();

            expect(getByLabelText(table, /edit/)).toBeEnabled();
            expect(queryAllByLabelText(table, /cancel/).length).toBe(0);
            expect(queryAllByLabelText(table, /done/).length).toBe(0);
        });
    });

    it('Without write permissions edit notification is disabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [] as Array<Schemas.Endpoint>
        });
        fetchMock.get(
            `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
            {
                body: []
            }
        );
        mockEventTypes(defaultEventTypeId);
        mockFacets();
        mockBehaviorGroup();
        mockBehaviorGroupsOfEventTypes();
        render(<NotificationsListPage />, {
            wrapper: getConfiguredAppWrapper({
                ...routePropsPageForBundle('rhel'),
                appContext: {
                    rbac: {
                        canWriteNotifications: false
                    }
                },
                skipIsBetaMock: true
            })
        });

        await waitForAsyncEvents();
        expect(
            getByLabelText(
                ouiaSelectors.getByOuia('Notifications/Notifications/Table'),
                /edit/i
            )
        ).toBeDisabled();
    });

    it('With write and read permissions edit notification is enabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [] as Array<Schemas.Endpoint>
        });
        fetchMock.get(
            `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
            {
                body: []
            }
        );
        mockEventTypes(defaultEventTypeId);
        mockFacets();
        mockBehaviorGroup();
        mockBehaviorGroupsOfEventTypes();
        render(<NotificationsListPage />, {
            wrapper: getConfiguredAppWrapper({
                ...routePropsPageForBundle('rhel')
            })
        });

        await waitForAsyncEvents();
        expect(
            getByLabelText(
                ouiaSelectors.getByOuia('Notifications/Notifications/Table'),
                /edit/i
            )
        ).toBeEnabled();
    });

    describe('Behavior groups', () => {

        it('Loads correctly on empty', async () => {
            fetchMock.get(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
                {
                    body: []
                }
            );
            mockEventTypes(defaultEventTypeId);
            mockFacets();
            mockBehaviorGroupsOfEventTypes();
            fetchMock.get('/api/notifications/v1.0/notifications/bundles/foobar/behaviorGroups', {
                body: []
            });

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();

            expect(screen.getAllByText(/behavior group/i).length).toBeGreaterThan(0);
        });

        it('Create behavior group when there are no behavior groups', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
                {
                    body: []
                }
            );
            mockEventTypes();
            mockFacets();
            fetchMock.get('/api/notifications/v1.0/notifications/bundles/foobar/behaviorGroups', {
                body: []
            });
            mockBehaviorGroupsOfEventTypes(defaultEventTypeId, true);

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();

            userEvent.click(screen.getByText(/create new group/i));
            await waitForAsyncEvents();
            expect(screen.getByText(/Create new behavior group/i)).toBeVisible();
        });

        it('Create behavior group when there are behavior groups', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
                {
                    body: []
                }
            );
            mockEventTypes();
            mockBehaviorGroupsOfEventTypes();
            mockFacets();
            mockBehaviorGroup();

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();

            userEvent.click(screen.getByText(/create new group/i));
            await waitForAsyncEvents();
            expect(screen.getByText(/Create new behavior group/i)).toBeVisible();
        });

        it('View Event Log is disabled if canReadEvents is false', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
                {
                    body: []
                }
            );
            mockEventTypes();
            mockBehaviorGroupsOfEventTypes();
            mockFacets();
            mockBehaviorGroup();

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel'),
                    appContext: {
                        rbac: {
                            canReadEvents: false
                        }
                    }
                })
            });

            await waitForAsyncEvents();

            expect(screen.getByText(/view event log/i)).toBeDisabled();
        });

        it.each<[Environment, boolean]>([
            [ 'ci', true ],
            [ 'ci-beta', true ],
            [ 'qa', true ],
            [ 'qa-beta', true ],
            [ 'stage', true ],
            [ 'stage-beta', true ],
            [ 'prod', true ],
            [ 'prod-beta', true ]
        ])('appears in %s? %j', async (env, appears) => {
            mockEnvironment(env);
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(
                `/api/notifications/v1.0/notifications/eventTypes/${defaultEventTypeId}`,
                {
                    body: []
                }
            );
            mockEventTypes(defaultEventTypeId);
            mockFacets();
            if (appears) {
                mockBehaviorGroup();
                mockBehaviorGroupsOfEventTypes();
            } else {
                fetchMock.get('/api/notifications/v1.0/notifications/bundles/foobar/behaviorGroups', () => Promise.reject('should not call this'));
            }

            render(<NotificationsListPage />, {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            });

            await waitForAsyncEvents();
            if (appears) {
                expect(screen.getAllByText(/behavior group/i).length).toBeGreaterThan(0);
            } else {
                expect(screen.queryByText(/behavior group/i)).toBeFalsy();
            }
        });

        afterAll(() => {
            mockInsights();
        });
    });
});
