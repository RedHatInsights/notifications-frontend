import { getByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import * as React from 'react';
import { MemoryRouterProps, RouteProps } from 'react-router';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { VerboseErrorBoundary } from '../../../../../test/VerboseErrorBoundary';
import { Schemas } from '../../../../generated/OpenapiIntegrations';
import { linkTo } from '../../../../Routes';
import { NotificationsListPage } from '../Page';

type RouterAndRoute = {
    router: MemoryRouterProps,
    route: RouteProps
};

const routePropsPageForBundle = (bundle: string): RouterAndRoute => ({
    router: {
        initialEntries: [ `/notifications/${bundle}` ]
    },
    route: {
        path: linkTo.notifications(':bundleName')
    }
});

const mockFacets = () => {
    fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
        body: [
            {
                displayName: 'Red Hat Enterprise Linux',
                name: 'rhel',
                id: 'foobar'
            }
        ] as Array<Schemas.Facet>
    });

    fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
        body: [
            {
                displayName: 'Policies',
                name: 'policies',
                id: 'foobar-policy'
            }
        ] as Array<Schemas.Facet>
    });
};

const defaultGetEventTypesUrl = '/api/notifications/v1.0/notifications/eventTypes?bundleId=foobar&limit=10&offset=0';

describe('src/pages/Notifications/List/Page', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('If the bundle is not found, redirects to insights', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [

            ] as Array<Schemas.EventType>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
            body: [
                {
                    displayName: 'Red Hat Enterprise Linux',
                    name: 'rhel',
                    id: 'foobar'
                }
            ] as Array<Schemas.Facet>
        });

        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: [
                {
                    displayName: 'Policies',
                    name: 'policies',
                    id: 'foobar-policy'
                }
            ] as Array<Schemas.Facet>
        });
        const getLocation = jest.fn();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('i-dont-exist'),
                    getLocation
                })
            }
        );

        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('Notifications/Notifications/DefaultBehavior')).toBeTruthy();
        expect(getLocation().pathname).toBe('/notifications/insights');
    });

    it('Throws error if bundles fails o load', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
            body: null
        });

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('i-dont-exist')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/Error: Unable to load bundle information/i)).toBeTruthy();
        err.mockRestore();
    });

    it('Throws error if default bundle is not found', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
            body: []
        });

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/Error: Default bundle information not found/i)).toBeTruthy();
        err.mockRestore();
    });

    it('Throws error if applications fails o load', async () => {
        const err = jest.spyOn(console, 'error');
        err.mockImplementation(() => ({}));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
            body: [
                {
                    displayName: 'Red Hat Enterprise Linux',
                    name: 'rhel',
                    id: 'foobar'
                }
            ] as Array<Schemas.Facet>
        });

        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: null
        });

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('i-dont-exist')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/Error: Unable to load application facets/i)).toBeTruthy();
        err.mockRestore();
    });

    it('Shows loading when loading bundles', async () => {
        let resolve: any;
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', {
            body: [
                {
                    displayName: 'Red Hat Enterprise Linux',
                    name: 'rhel',
                    id: 'foobar'
                }
            ] as Array<Schemas.Facet>
        });

        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', new Promise(_resolve => resolve = _resolve));

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/loading/i)).toBeTruthy();
        resolve();
        await  waitForAsyncEvents();
    });

    it('Shows loading when loading applications', async () => {
        let resolve: any;
        fetchMock.get('/api/notifications/v1.0/notifications/facets/bundles', new Promise(_resolve => resolve = _resolve));

        render(
            <VerboseErrorBoundary>
                <NotificationsListPage />
            </VerboseErrorBoundary>
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/loading/i)).toBeTruthy();
        resolve();
        await  waitForAsyncEvents();
    });

    it('Renders default behavior', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [

            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('Notifications/Notifications/DefaultBehavior')).toBeTruthy();
    });

    describe('Clicking edit button of Default notification', () => {
        it('brings up the edit form', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [

                ] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [

                ] as Array<Schemas.EventType>
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('Notifications/Notifications/DefaultBehavior')
                .getByOuia('PF4/Button')
            );

            await waitForAsyncEvents();
            expect(screen.getByText(/Edit default notification actions/i)).toBeVisible();
        });

        it('and then cancel, closes the modal', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [

                ] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [

                ] as Array<Schemas.EventType>
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('Notifications/Notifications/DefaultBehavior')
                .getByOuia('PF4/Button')
            );

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('PF4/ModalContent')
                .getByOuia('PF4/Button', 'cancel')
            );

            expect(screen.queryByText(/Edit default notification actions/i)).toBeFalsy();
        });

        it('and then save closes the modal and shows a notification if no changes are made', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [

                ] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [

                ] as Array<Schemas.EventType>
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('Notifications/Notifications/DefaultBehavior')
                .getByOuia('PF4/Button')
            );

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('PF4/ModalContent')
                .getByOuia('PF4/Button', 'action')
            );

            await waitForAsyncEvents();
            expect(screen.queryByText(/Actions updated/)).toBeTruthy();
            expect(screen.queryByText(/Edit default notification actions/i)).toBeFalsy();
        });
    });

    it('Renders notifications list', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [

            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel')
                })
            }
        );

        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('Notifications/Notifications/Table')).toBeTruthy();
    });

    describe('Clicking edit button of notification row', () => {
        it('brings up the edit form', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [
                    {
                        id: '3',
                        application: {
                            id: 'my-app',
                            bundle_id: 'my-bundle-id',
                            name: 'My app',
                            display_name: 'My app desc'
                        },
                        display_name: 'my notification',
                        name: 'Cool notification',
                        endpoints: []
                    }
                ] as Array<Schemas.EventType>
            });
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/3', {
                body: []
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(getByText(ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table'), /edit/i));

            await waitForAsyncEvents();
            expect(screen.getByText(/Edit notification actions/i)).toBeVisible();
        });

        it('and then cancel, closes the modal', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [
                    {
                        id: '3',
                        application: {
                            id: 'my-app',
                            bundle_id: 'my-bundle-id',
                            name: 'My app',
                            display_name: 'My app desc'
                        },
                        display_name: 'my notification',
                        name: 'Cool notification',
                        endpoints: []
                    }
                ] as Array<Schemas.EventType>
            });
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/3', {
                body: []
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(getByText(ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table'), /edit/i));

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('PF4/ModalContent')
                .getByOuia('PF4/Button', 'cancel')
            );

            expect(screen.queryByText(/Edit default notification actions/i)).toBeFalsy();
        });

        it('and then save closes the modal and shows a notification if no changes are made', async () => {
            fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
                body: [] as Array<Schemas.Endpoint>
            });
            fetchMock.get(defaultGetEventTypesUrl, {
                body: [
                    {
                        id: '3',
                        application: {
                            id: 'my-app',
                            bundle_id: 'my-bundle-id',
                            name: 'My app',
                            display_name: 'My app desc'
                        },
                        display_name: 'my notification',
                        name: 'Cool notification',
                        endpoints: []
                    }
                ] as Array<Schemas.EventType>
            });
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/3', {
                body: []
            });
            mockFacets();
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        ...routePropsPageForBundle('rhel')
                    })
                }
            );

            await waitForAsyncEvents();
            userEvent.click(getByText(ouiaSelectors
            .getByOuia('Notifications/Notifications/Table')
            .getByOuia('PF4/Table'), /edit/i));

            await waitForAsyncEvents();
            userEvent.click(
                ouiaSelectors
                .getByOuia('PF4/ModalContent')
                .getByOuia('PF4/Button', 'action')
            );

            await waitForAsyncEvents();
            expect(screen.queryByText(/Actions updated/)).toBeTruthy();
            expect(screen.queryByText(/Edit default notification actions/i)).toBeFalsy();
        });
    });

    it('Without write permissions edit default notification is disabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/15454656416', {
            body: [

            ]
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        bundle_id: 'my-bundle-id',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: '15454656416',
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel'),
                    appContext: {
                        rbac: {
                            canWriteNotifications: false,
                            canWriteIntegrationsEndpoints: true,
                            canReadIntegrationsEndpoints: true,
                            canReadNotifications: true
                        }
                    }
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            getByText(ouiaSelectors.getByOuia('Notifications/Notifications/DefaultBehavior'), /Edit/i)
        ).toBeDisabled();
    });

    it('With write and read permissions edit default notification is enabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/15454656416', {
            body: [

            ]
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        bundle_id: 'my-bundle-id',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: '15454656416',
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel'),
                    appContext: {
                        rbac: {
                            canWriteNotifications: true,
                            canWriteIntegrationsEndpoints: true,
                            canReadIntegrationsEndpoints: true,
                            canReadNotifications: true
                        }
                    }
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            getByText(ouiaSelectors.getByOuia('Notifications/Notifications/DefaultBehavior'), /Edit/i)
        ).toBeEnabled();
    });

    it('Without write permissions edit notification is disabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/15454656416', {
            body: [

            ]
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        bundle_id: 'my-bundle-id',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: '15454656416',
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel'),
                    appContext: {
                        rbac: {
                            canWriteNotifications: false,
                            canWriteIntegrationsEndpoints: true,
                            canReadIntegrationsEndpoints: true,
                            canReadNotifications: true
                        }
                    }
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            getByText(ouiaSelectors.getByOuia('Notifications/Notifications/Table'), /Edit/i)
        ).toBeDisabled();
    });

    it('With write and read permissions edit notification is enabled', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/15454656416', {
            body: [

            ]
        });
        fetchMock.get(defaultGetEventTypesUrl, {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        bundle_id: 'my-bundle-id',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: '15454656416',
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        mockFacets();
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    ...routePropsPageForBundle('rhel'),
                    appContext: {
                        rbac: {
                            canWriteNotifications: true,
                            canWriteIntegrationsEndpoints: true,
                            canReadIntegrationsEndpoints: true,
                            canReadNotifications: true
                        }
                    }
                })
            }
        );

        await waitForAsyncEvents();
        expect(
            getByText(ouiaSelectors.getByOuia('Notifications/Notifications/Table'), /Edit/i)
        ).toBeEnabled();
    });
});
