import * as React from 'react';

import { act, render, screen } from '@testing-library/react';

import { RecipientTypeahead } from '../RecipientTypeahead';
import jestMock from 'jest-mock';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

describe('src/components/Notifications/Form/RecipientTypeAhead', () => {
    it('Renders if selected is undefined', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
    });

    // Remove this once we support selecting the recipients
    it('Appears as disabled', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    // Remove this once we support selecting the recipients
    it('Has text "All registered users"', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(screen.getByText('All registered users')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders disabled if isDisabled', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
            isDisabled={ true }
        />);
        await waitForAsyncEvents();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders the selected even if getRecipients does not yield it', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(screen.getByText('comi')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders multiple selected', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi', 'tales' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => [ 'tales' ]) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(screen.getByText('comi')).toBeVisible();
        expect(screen.getByText('tales')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Clicking clear button will call onClear', async () => {
        const onClear = jestMock.fn();
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => [ 'tales' ]) }
            onClear={ onClear }
        />);

        userEvent.click(screen.getByRole('button', {
            name: /Clear all/i
        }));
        await waitForAsyncEvents();
        expect(onClear).toHaveBeenCalled();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Clicking will show the options', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => [ 'tales' ]) }
            onClear={ jestMock.fn() }
        />);

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        expect(screen.getByText('tales')).toBeVisible();
    });

    it('getRecipients is called on init', async () => {
        const getRecipient = jestMock.fn(async () => [ 'tales' ]);
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ getRecipient }
            onClear={ jestMock.fn() }
        />);

        await waitForAsyncEvents();
        expect(getRecipient).toHaveBeenCalledWith('');
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('When writing, getRecipients is called with the input', async () => {
        const getRecipient = jestMock.fn(async () => [ 'tales' ]);
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ getRecipient }
            onClear={ jestMock.fn() }
        />);

        await waitForAsyncEvents();
        await act(async () => {
            await userEvent.type(screen.getByRole('textbox'), 'guy');
        });
        expect(getRecipient).toHaveBeenCalledWith('guy');
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('onSelected GetsCalled when selecting an element', async () => {
        const onSelected = jest.fn();
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ onSelected }
            getRecipients={ jestMock.fn(async () => [ 'tales' ]) }
            onClear={ jestMock.fn() }
        />);

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(onSelected).toHaveBeenCalled();
    });
});
