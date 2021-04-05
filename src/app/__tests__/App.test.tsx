import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen } from '@testing-library/react';
import * as React from 'react';

import messages from '../../../locales/data.json';
import { AppWrapper, appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../test/AppWrapper';
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
