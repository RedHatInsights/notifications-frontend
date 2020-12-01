import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import jestMock from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Messages } from '../../../../properties/Messages';
import { IntegrationType } from '../../../../types/Integration';
import { CreatePage } from '../CreatePage';

describe('src/pages/Integrations/Create/CreatePage', () => {

    it('Renders when is open', async () => {
        render(
            <CreatePage
                initialIntegration={ {} }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('Picks initial value', async () => {
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar'
                } }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByDisplayValue(/foobar/i)).toBeTruthy();
    });

    it('If no IntegrationType is specified, it picks the first', async () => {
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar'
                } }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        const firstIntegrationTypeDisplayName = Messages.components.integrations.integrationType[Object.values(IntegrationType)[0]];
        expect(screen.getByDisplayValue(firstIntegrationTypeDisplayName)).toBeTruthy();
    });

    it('Calls onClose when clicking the x', async () => {
        const onClose = jestMock.fn();
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar'
                } }
                onClose={ onClose }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        userEvent.click(screen.getByLabelText(/close/i));
        expect(onClose).toHaveBeenCalled();
    });

    it('Calls onClose when clicking the cancel button', async () => {
        const onClose = jestMock.fn();
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar'
                } }
                onClose={ onClose }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/cancel/i));
        expect(onClose).toHaveBeenCalled();
    });

    it('Submit is disabled when there is any error', async () => {
        render(
            <CreatePage
                initialIntegration={ {} }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/save/i)).toBeDisabled();
    });

    it('Submit is enabled when there are no errors', async () => {
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/save/i)).toBeEnabled();
    });

    it('When is new, it shows as Add Integration', async () => {
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/add integration/i)).toBeTruthy();
    });

    it('When is new, it shows as Edit Integration', async () => {
        render(
            <CreatePage
                initialIntegration={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                onClose={ jestMock.fn() }
                isEdit={ true }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/edit integration/i)).toBeTruthy();
    });

});
