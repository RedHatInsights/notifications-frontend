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
        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: AppWrapper
            }
        );
        mockMaintenance(true);

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('loading')).toBeTruthy();
        jest.restoreAllMocks();
    });

    it('Shows the content when read is set', async () => {
        jest.useFakeTimers();
        mockMaintenance(true);

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
        render(
            <IntlProvider locale={ navigator.language } messages={ messages }><App /></IntlProvider>,
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        await waitForAsyncEvents();

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
        mockMaintenance(true);

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
        mockMaintenance(true);

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
