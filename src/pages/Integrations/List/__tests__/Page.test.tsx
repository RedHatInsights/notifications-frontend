import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Schemas } from '../../../../generated/OpenapiIntegrations';
import { IntegrationsListPage } from '../Page';
import Endpoint = Schemas.Endpoint;
import { Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { getByLabelText, getByRole, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';

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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read', 'write' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

            await waitForAsyncEvents();

            expect(
                getByLabelText(ouiaSelectors.getByOuia('Notifications/Integrations/Table'), /Enabled/i)
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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read', 'write' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

            await waitForAsyncEvents();
            expect(
                getByLabelText(ouiaSelectors.getByOuia('Notifications/Integrations/Table'), /Enabled/i)
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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

            await waitForAsyncEvents();

            const dropdownContainer = ouiaSelectors.getByOuia('Notifications/Integrations/Table').getByOuia('PF4/Dropdown');

            userEvent.click(
                getByRole(
                    dropdownContainer,
                    'button'
                )
            );

            expect(
                getByText(dropdownContainer, /Edit/i)
            ).toHaveAttribute('aria-disabled', 'true');
            expect(
                getByText(dropdownContainer, /Remove/i)
            ).toHaveAttribute('aria-disabled', 'true');
            expect(
                getByText(dropdownContainer, /(Enable|Disable)/i)
            ).toHaveAttribute('aria-disabled', 'true');
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
                        properties: {},
                        updated: Date.now().toString()
                    } as Endpoint
                ],
                meta: { count: 1 },
                links: {}
            });

            fetchMock.getOnce('/api/integrations/v1.0/endpoints/2432/history', []);

            render(
                <IntegrationsListPage />
                , {
                    wrapper: getConfiguredAppWrapper({
                        appContext: {
                            applications: [],
                            rbac: new Rbac({
                                integrations: {
                                    endpoints: [ 'read', 'write' ]
                                },
                                notifications: {
                                    notifications: [ 'read', 'write' ]
                                }
                            })
                        }
                    })
                }
            );

            await waitForAsyncEvents();
            const dropdownContainer = ouiaSelectors.getByOuia('Notifications/Integrations/Table').getByOuia('PF4/Dropdown');

            userEvent.click(
                getByRole(
                    dropdownContainer,
                    'button'
                )
            );

            expect(
                getByText(dropdownContainer, /Edit/i)
            ).toHaveAttribute('aria-disabled', 'false');
            expect(
                getByText(dropdownContainer, /Remove/i)
            ).toHaveAttribute('aria-disabled', 'false');
            expect(
                getByText(dropdownContainer, /(Enable|Disable)/i)
            ).toHaveAttribute('aria-disabled', 'false');
        });
    });
});
