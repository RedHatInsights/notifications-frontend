import * as React from 'react';

import { AppWrapper, appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../test/AppWrapper';
import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen } from '@testing-library/react';

import App from '../App';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import messages from '../../../locales/data.json';
import fetchMock from 'fetch-mock';
import { waitForAsyncEvents } from '../../../test/TestUtils';

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
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications', {
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
        const promise = Promise.resolve({});
        (fetchRBAC as jest.Mock).mockImplementation(() => promise);
        let resolver;
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications', new Promise(resolv => resolver = resolv));
        render(
            <App/>,
            {
                wrapper: getConfiguredAppWrapper({
                    appContext: {
                        rbac: {},
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

    it('Shows the content when RBAC.canReadAll is set', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve({
            canReadAll: true,
            canWriteAll: true
        }));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications', {
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

        expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('Shows error when RBAC does not have read access when /notifications', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve({
            canReadAll: false,
            canWriteAll: true
        }));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications', {
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
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve({
            canReadAll: false,
            canWriteAll: true
        }));
        fetchMock.get('/api/notifications/v1.0/notifications/facets/applications', {
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
