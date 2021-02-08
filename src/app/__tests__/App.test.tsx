import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import messages from '../../../locales/data.json';
import { AppWrapper, appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../test/TestUtils';
import App from '../App';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    const MockedAppSkeleton: React.FunctionComponent = () => <div data-testid="loading"><real.AppSkeleton /></div>;
    return {
        ...real,
        AppSkeleton: MockedAppSkeleton,
        fetchRBAC: jest.fn(real.fetchRBAC)
    };
});
jest.mock('../../Routes', () => {
    const MockedRoutes: React.FunctionComponent = () => <div data-testid="content" />;
    return {
        Routes: MockedRoutes
    };
});

describe('src/app/App', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Shows loading when RBAC is not set', async () => {
        jest.useFakeTimers();
        const promise = new Promise<Rbac>(() => {
            return 'foo';
        });
        (fetchRBAC as jest.Mock).mockImplementation(() => promise);
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: []
        });
        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('loading')).toBeTruthy();
        jest.restoreAllMocks();
    });

    it('Shows loading when applications is not set', async () => {
        jest.useFakeTimers();
        const promise = Promise.resolve(new Rbac({}));
        (fetchRBAC as jest.Mock).mockImplementation(() => promise);
        let resolver;
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', new Promise(resolv => resolver = resolv));
        render(
            <App />,
            {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        rbac: new Rbac({}),
                        applications: undefined
                    } as any
                })
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('loading')).toBeTruthy();
        jest.restoreAllMocks();
        resolver();
        await waitForAsyncEvents();
    });

    it('Shows the content when read is set', async () => {
        jest.useFakeTimers();

        const Wrapper = getConfiguredAppWrapper({
            route: {
                location: {
                    pathname: '/notifications',
                    search: '',
                    hash: '',
                    state: {}
                }
            }
        });

        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(new Rbac({
            integrations: {
                endpoints: [ 'read', 'write' ]
            },
            notifications: {
                notifications: [ 'read', 'write' ]
            }
        })));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: []
        });
        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('Shows error when RBAC does not have read access when /notifications', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(new Rbac({
            integrations: {
                endpoints: [ 'read', 'write' ]
            },
            notifications: {
                notifications: [ 'write' ]
            }
        })));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: []
        });

        const Wrapper = getConfiguredAppWrapper({
            route: {
                location: {
                    pathname: '/notifications',
                    search: '',
                    hash: '',
                    state: {}
                }
            }
        });

        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByText(/You do not have access to Notifications/i)).toBeTruthy();
    });

    it('Shows error when RBAC does not have read access when /integrations', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(new Rbac({
            integrations: {
                endpoints: [ 'write' ]
            },
            notifications: {
                notifications: [ 'read', 'write' ]
            }
        })));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications?bundleName=insights', {
            body: []
        });

        const Wrapper = getConfiguredAppWrapper({
            route: {
                location: {
                    pathname: '/integrations',
                    search: '',
                    hash: '',
                    state: {}
                }
            }
        });

        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByText(/You do not have access to Integrations/i)).toBeTruthy();
    });
});
