import * as React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import jestMock from 'jest-mock';

import { CreatePage } from '../CreatePage';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

describe('src/pages/Integrations/Create/CreatePage', () => {
    it('Nothing is rendered when not open', async () => {
        render(
            <CreatePage
                initialValue={ {} }
                isModalOpen={ false }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isEdit={ false }
                isCopy={ false }
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
                isCopy={ false }
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
                isCopy={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByDisplayValue(/foobar/i)).toBeTruthy();
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
                isCopy={ false }
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
                isCopy={ false }
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
                isCopy={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/submit/i)).toBeDisabled();
    });

    it('Submit is disabled when there are no errors', async () => {
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
                isCopy={ false }
            />);
        await waitForAsyncEvents();
        expect(screen.getByText(/submit/i)).toBeEnabled();
    });
});
