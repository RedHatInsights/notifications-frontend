import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { render, screen } from '@testing-library/react';
import * as React from 'react';

import messages from '../../locales/data.json';
import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../test/AppWrapper';
import { waitForAsyncEvents } from '../../test/TestUtils';
import { Routes } from '../Routes';

jest.mock('../pages/Notifications/List/Page', () => ({
    NotificationsListPage: () => 'Notifications'
}));

jest.mock('../pages/Integrations/List/Page', () => ({
    IntegrationsListPage: () => 'Integrations'
}));

describe('src/Routes', () => {

    describe('App Wrapped', () => {

        beforeEach(() => {
            appWrapperSetup();
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
            expect(document.body.firstChild).toBeEmptyDOMElement();
        });

        it('Should render Integrations on /integrations', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/integrations' ]
                },
                getLocation
            });
            render(<IntlProvider locale={ navigator.language } messages={ messages }><Routes /></IntlProvider>, {
                wrapper: Wrapper
            });

            await waitForAsyncEvents();

            expect(getLocation().pathname).toBe('/integrations');
            expect(screen.getByText('Integrations')).toBeVisible();
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

        it('Should redirect on /notifications', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/notifications' ]
                },
                getLocation
            });
            render(<Routes />, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/notifications/insights');
            expect(screen.getByText(/notifications/i)).toBeVisible();
        });
    });
});
