import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { NotificationUserRecipient } from '../../../../types/Recipient';
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

const SELECTED_ALL = [
    new NotificationUserRecipient(undefined, false),
    new NotificationUserRecipient(undefined, true)
] as ReadonlyArray<NotificationUserRecipient>;

const SELECTED_SEND_TO_ADMIN = [
    new NotificationUserRecipient(undefined, true)
] as ReadonlyArray<NotificationUserRecipient>;

const createDefaultGetMock = () => fn(async () => [ new NotificationUserRecipient(undefined, true) ]);

describe('src/components/Notifications/Form/RecipientTypeAhead', () => {

    it('Renders disabled if isDisabled', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ fn() }
            isDisabled={ true }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('Renders the selected even if getRecipients does not yield it', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_SEND_TO_ADMIN }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByText('Users: Admins')).toBeVisible();
    });

    it('Renders multiple selected', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(createDefaultGetMock())
        });
        await waitForAsyncEvents();
        expect(screen.getByText('Users: Admins')).toBeVisible();
        expect(screen.getByText('Users: All')).toBeVisible();
    });

    it('Clicking clear button will call onClear', async () => {
        const onClear = fn();
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ onClear }
        />, {
            wrapper: getConfiguredWrapper(createDefaultGetMock())
        });

        userEvent.click(screen.getByRole('button', {
            name: /Clear all/i
        }));
        await waitForAsyncEvents();
        expect(onClear).toHaveBeenCalled();
    });

    it('Clicking will show the options', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(createDefaultGetMock())
        });

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        screen.getAllByText('Users: Admins').map(e => expect(e).toBeVisible());
        screen.getAllByText('Users: All').map(e => expect(e).toBeVisible());
    });

    it('getRecipients is called on init', async () => {
        const getRecipient = createDefaultGetMock();
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(getRecipient)
        });

        await waitForAsyncEvents();
        expect(getRecipient).toHaveBeenCalledWith('');
    });

    it('When writing, getRecipients is called with the input', async () => {
        const getRecipient = createDefaultGetMock();
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(getRecipient)
        });

        await waitForAsyncEvents();
        userEvent.type(screen.getByRole('textbox'), 'guy');
        await waitForAsyncEvents();
        expect(getRecipient).toHaveBeenCalledWith('guy');
    });

    it('onSelected GetsCalled when selecting an element', async () => {
        const onSelected = jest.fn();
        render(<RecipientTypeahead
            selected={ SELECTED_ALL }
            onSelected={ onSelected }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper(createDefaultGetMock())
        });

        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));
        await waitForAsyncEvents();
        act(() => userEvent.click(screen.getAllByRole('option')[0]));
        expect(onSelected).toHaveBeenCalled();
    });
});
