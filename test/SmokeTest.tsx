import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fetchMock from 'fetch-mock';
import { mockInsights } from 'insights-common-typescript-dev';
import * as React from 'react';

import App from '../src/app/App';
import { Schemas } from '../src/generated/OpenapiIntegrations';
import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from './AppWrapper';
import { waitForAsyncEvents } from './TestUtils';
import Endpoint = Schemas.Endpoint;

const mockMaintenance = (isUp: boolean) => {
    const response = isUp ? {
        status: 'UP'
    } : {
        start_time: '2021-06-11T13:09:31.213141',
        end_time: '2021-06-11T18:09:31.213141',
        status: 'MAINTENANCE'
    };

    fetchMock.get('/api/notifications/v1.0/status', {
        status: 200,
        body: response
    });
};

describe('Smoketest', () => {
    it('Opens the main integrations page in multiple browsers', async () => {
        mockInsights();
        mockMaintenance(true);
        appWrapperSetup();
        const rbacUrl = '/api/rbac/v1/access/?application=notifications%2Cintegrations';
        const dataRbac = {
            data: [
                {
                    permission: 'notifications:*:*',
                    resourceDefinitions: []
                },
                {
                    permission: 'integrations:*:*',
                    resourceDefinitions: []
                }
            ]
        };
        fetchMock.get(rbacUrl, {
            status: 200,
            body: {
                meta: {
                    count: 1, limit: 1000, offset: 0
                },
                links: {
                    first: '/api/rbac/v1/access/?application=notifications,integrations&limit=1000&offset=0',
                    next: null,
                    previous: null,
                    last: '/api/rbac/v1/access/?application=notifications,integrations&limit=1000&offset=0'
                },
                data: dataRbac
            }
        });

        const mock = new MockAdapter(axios);
        mock.onGet(rbacUrl).reply(200,
            dataRbac
        );

        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=rhel', {
            body: [
                {
                    label: 'fobar',
                    value: 'baz'
                }
            ]
        });

        fetchMock.get('/api/integrations/v1.0/endpoints/2432/history', {
            body: [],
            status: 200
        });

        fetchMock.get('/api/integrations/v1.0/endpoints?limit=10&offset=0&type=webhook', {
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

        render(<div id="root"><App /></div>, {
            wrapper: getConfiguredAppWrapper({
                route: {
                    location: {
                        pathname: '/integrations',
                        search: '',
                        hash: '',
                        state: {}
                    }
                }
            })
        });

        await waitForAsyncEvents();
        return screen.findByText('Integrations').then(value => expect(value).toBeTruthy()).finally(() => appWrapperCleanup());
    });

    it('Opens the main notifications page in multiple browsers', async () => {
        mockInsights();
        appWrapperSetup();
        mockMaintenance(true);

        const rbacUrl = '/api/rbac/v1/access/?application=notifications%2Cintegrations';
        const dataRbac = {
            data: [
                {
                    permission: 'notifications:*:*',
                    resourceDefinitions: []
                },
                {
                    permission: 'integrations:*:*',
                    resourceDefinitions: []
                }
            ]
        };
        fetchMock.get(rbacUrl, {
            status: 200,
            body: {
                meta: {
                    count: 1, limit: 1000, offset: 0
                },
                links: {
                    first: '/api/rbac/v1/access/?application=notifications,integrations&limit=1000&offset=0',
                    next: null,
                    previous: null,
                    last: '/api/rbac/v1/access/?application=notifications,integrations&limit=1000&offset=0'
                },
                data: dataRbac
            }
        });

        const mock = new MockAdapter(axios);
        mock.onGet(rbacUrl).reply(200,
            dataRbac
        );

        fetchMock.get('/api/integrations/v1.0/endpoints?limit=10&offset=0&type=webhook', {
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

        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes?limit=10&offset=0', {
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
                    name: 'Cool notification'
                }
            ] as Array<Schemas.EventType>
        });

        fetchMock.get('/api/notifications/v1.0/notifications/eventTypes/3', {
            body: []
        });

        fetchMock.get('/api/notifications/v1.0/notifications/defaults', {
            body: [

            ] as Array<Schemas.Endpoint>
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

        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=rhel', {
            body: [
                {
                    displayName: 'Policies',
                    name: 'policies',
                    id: 'foobar-policy'
                }
            ] as Array<Schemas.Facet>
        });

        render(<div id="root"><App /></div>, {
            wrapper: getConfiguredAppWrapper({
                route: {
                    location: {
                        pathname: '/notifications/rhel',
                        search: '',
                        hash: '',
                        state: {}
                    }
                }
            })
        });

        await waitForAsyncEvents();

        return screen.findByText('Notifications').then(value => expect(value).toBeTruthy()).finally(() => appWrapperCleanup());
    });
});
