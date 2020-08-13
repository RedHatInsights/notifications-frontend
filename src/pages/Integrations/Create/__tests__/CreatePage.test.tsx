import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import jestMock from 'jest-mock';

import { CreatePage } from '../CreatePage';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { IntegrationType } from '../../../../types/Integration';
import { Messages } from '../../../../properties/Messages';

describe('src/pages/Integrations/Create/CreatePage', () => {
    it('Nothing is rendered when not open', async () => {
        render(
            <CreatePage
                initialValue={ {} }
                isModalOpen={ false }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.queryByRole('dialog')).toBeFalsy();
    });

    it('Renders when is open', async () => {
        render(
            <CreatePage
                initialValue={ {} }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByRole('dialog')).toBeTruthy();
    });

    it('Picks initial value', async () => {
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByDisplayValue(/foobar/i)).toBeTruthy();
    });

    it('If no IntegrationType is specified, it picks the first', async () => {
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
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
                initialValue={ {
                    name: 'foobar'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
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
                initialValue={ {
                    name: 'foobar'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
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
                initialValue={ {} }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/submit/i)).toBeDisabled();
    });

    it('Submit is enabled when there are no errors', async () => {
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/submit/i)).toBeEnabled();
    });

    it('onSave is called when clicking submit', async () => {
        const onSave = jestMock.fn();
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                isModalOpen={ true }
                onSave={ onSave }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/submit/i));
        await waitForAsyncEvents();
        expect(onSave).toHaveBeenCalled();
    });

    it('When is new, it shows as Add Integration', async () => {
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/add integration/i)).toBeTruthy();
    });

    it('When is new, it shows as Edit Integration', async () => {
        render(
            <CreatePage
                initialValue={ {
                    name: 'foobar',
                    url: 'http://google.com'
                } }
                isModalOpen={ true }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ true }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/edit integration/i)).toBeTruthy();
    });

});
