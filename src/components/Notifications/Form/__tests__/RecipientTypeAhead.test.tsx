import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { BaseNotificationRecipient, NotificationRbacGroupRecipient, NotificationUserRecipient } from '../../../../types/Recipient';
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
] as ReadonlyArray<BaseNotificationRecipient>;

const SELECTED_SEND_TO_ADMIN = [
    new NotificationUserRecipient(undefined, true)
] as ReadonlyArray<BaseNotificationRecipient>;

const SELECTED_LOADED_GROUP = [
    new NotificationRbacGroupRecipient(undefined, 'valid-group', 'I am real')
] as ReadonlyArray<BaseNotificationRecipient>;

const SELECTED_LOADING_GROUP = [
    new NotificationRbacGroupRecipient(undefined, 'loading-group', true)
] as ReadonlyArray<BaseNotificationRecipient>;

const SELECTED_NON_EXISTING_GROUP = [
    new NotificationRbacGroupRecipient(undefined, 'does-not-exists-group', false)
] as ReadonlyArray<BaseNotificationRecipient>;

const createDefaultGetMock = () => fn(async () => [ new NotificationUserRecipient(undefined, true) ]);

describe('src/components/Notifications/Form/RecipientTypeAhead', () => {

    beforeEach(() => {
        jest.useRealTimers();
    });

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
        expect(screen.getByRole('button', {
            name: 'Options menu'
        })).toBeDisabled();
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
        expect(screen.getByText('Admins')).toBeVisible();
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
        expect(screen.getByText('Admins')).toBeVisible();
        expect(screen.getByText('All')).toBeVisible();
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
        screen.getAllByText('Admins').map(e => expect(e).toBeVisible());
        screen.getAllByText('All').map(e => expect(e).toBeVisible());
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
        expect(getRecipient).toHaveBeenCalledWith();
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
        act(() => userEvent.click(screen.getAllByRole('checkbox')[0]));
        expect(onSelected).toHaveBeenCalled();
    });

    it('Renders selected loaded group with its name', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_LOADED_GROUP }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByText('I am real')).toBeVisible();
    });

    it('Renders selected loading group as a loading', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_LOADING_GROUP }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByTestId('loading-group')).toBeVisible();
    });

    it('Renders selected non existent group as a does not exist', async () => {
        render(<RecipientTypeahead
            selected={ SELECTED_NON_EXISTING_GROUP }
            onSelected={ fn() }
            onClear={ fn() }
        />, {
            wrapper: getConfiguredWrapper()
        });
        await waitForAsyncEvents();
        expect(screen.getByText(/User Access group \(Not found\)/i)).toBeVisible();

        userEvent.hover(screen.getByText(/User Access group \(Not found\)/i));
        await waitForAsyncEvents();
        expect(await screen.findByText(/This User Access group was not found, and may have been deleted/i)).toBeVisible();
    });
});
