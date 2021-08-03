import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { GetNotificationRecipients, RecipientContext, RecipientContextProvider } from '../../RecipientContext';
import { RecipientTypeahead } from '../RecipientTypeahead';

const getConfiguredWrapper = (getRecipients?: GetNotificationRecipients) => {
    const context: RecipientContext = {
        getIntegrations: fn(),
        getNotificationRecipients: getRecipients ?? fn(async () => [])
    };

    const Wrapper: React.FunctionComponent = props => <RecipientContextProvider value={ context }>{ props.children }</RecipientContextProvider>;
    return Wrapper;
};

describe('src/components/Notifications/Form/RecipientTypeAhead', () => {
    it('Renders if selected is undefined', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
    });

    // Remove this once we support selecting the recipients
    it('Appears as disabled', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    // Remove this once we support selecting the recipients
    it('Has text "All registered users"', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByText('All registered users')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders disabled if isDisabled', async () => {
        render(<RecipientTypeahead
            selected={ undefined }
            onSelected={ fn() }
            onClear={ fn() }
            isDisabled={ true }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders the selected even if getRecipients does not yield it', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi' ] }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByText('comi')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Renders multiple selected', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi', 'tales' ] }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(fn(async () => [ 'tales' ]))
        });
        await waitForAsyncEvents();
        expect(screen.getByText('comi')).toBeVisible();
        expect(screen.getByText('tales')).toBeVisible();
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Clicking clear button will call onClear', async () => {
        const onClear = fn();
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ fn() }
            onClear={ onClear }
        />, {
            wrapper: getConfiguredWrapper(fn(async () => [ 'tales' ]))
        });

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
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(fn(async () => [ 'tales' ]))
        });

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        expect(screen.getByText('tales')).toBeVisible();
    });

    it('getRecipients is called on init', async () => {
        const getRecipient = fn(async () => [ 'tales' ]);
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(getRecipient)
        });

        await waitForAsyncEvents();
        expect(getRecipient).toHaveBeenCalledWith('');
    });

    // Removing until we support selecting the recipients
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('When writing, getRecipients is called with the input', async () => {
        const getRecipient = fn(async () => [ 'tales' ]);
        render(<RecipientTypeahead
            selected={ [ 'comi', 'murray' ] }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(getRecipient)
        });

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
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(fn(async () => [ 'tales' ]))
        });

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(onSelected).toHaveBeenCalled();
    });
});
