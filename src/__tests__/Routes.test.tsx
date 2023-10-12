import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../test/AppWrapper';
import { Routes } from '../Routes';

jest.mock('../pages/Notifications/List/Page', () => ({
    NotificationsListPage: () => 'Notifications'
}));

jest.mock('../pages/Integrations/List/Page', () => ({
    IntegrationsListPage: () => 'Integrations'
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
    return () => ({ getApp: () => 'foo', isBeta: () => false });
});

describe('src/Routes', () => {

    describe('App Wrapped', () => {

        beforeEach(() => {
            appWrapperSetup();
            fetchMock.get(`/api/featureflags/v0`, {
                body: {
                    toggles: []
                }
            });
        });

        afterEach(() => {
            appWrapperCleanup();
        });

        it('Nothing is rendered in /', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/' ]
                },
                getLocation
            });
            render(<Routes />, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/');
            expect(screen.getByRole('link', { name: 'Go to landing page' })).toBeVisible();
        });

        it('Should render on /notifications/foobar', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/notifications/foobar' ]
                },
                getLocation
            });
            render(<Routes />, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/notifications/foobar');
            expect(screen.getByText(/notifications/i)).toBeVisible();
        });
    });
});
