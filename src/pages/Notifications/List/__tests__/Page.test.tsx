import { getByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Schemas } from '../../../../generated/OpenapiIntegrations';
import { NotificationsListPage } from '../Page';

describe('src/pages/Notifications/List/Page', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Renders default behavior', async () => {
        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
        });
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [

            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [

                ] as Array<Schemas.EventType>
            });
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [

                ] as Array<Schemas.EventType>
            });
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [

                ] as Array<Schemas.EventType>
            });
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [

            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [
                    {
                        id: 3,
                        application: {
                            id: 'my-app',
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
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [
                    {
                        id: 3,
                        application: {
                            id: 'my-app',
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
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
            fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
                body: [
                    {
                        id: 3,
                        application: {
                            id: 'my-app',
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
            render(
                <NotificationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper()
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
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: 15454656416,
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        applications: [],
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
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: 15454656416,
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        applications: [],
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
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: 15454656416,
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        applications: [],
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
        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
            body: [
                {
                    application: {
                        display_name: 'the app',
                        created: Date.now().toString(),
                        eventTypes: undefined,
                        id: 'app',
                        name: 'app',
                        updated: Date.now().toString()

                    },
                    display_name: 'display_name',
                    endpoints: [],
                    id: 15454656416,
                    name: 'mmmokay'
                }
            ] as Array<Schemas.EventType>
        });
        render(
            <NotificationsListPage />
            , {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        applications: [],
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
