import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { RecipientTypeahead } from '../RecipientTypeahead';
import { Action, NotificationType } from '../../../../types/Notification';
import jestMock from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { ouiaSelectors } from 'insights-common-typescript-dev';

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

    it('Renders the selected even if getRecipients does not yield it', async () => {
        render(<RecipientTypeahead
            selected={ [ 'comi' ] }
            onSelected={ jestMock.fn() }
            getRecipients={ jestMock.fn(async () => []) }
            onClear={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(screen.getByText('comi')).toBeVisible();
    });

    it('Renders multiple selected ', async () => {
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

    it('Clicking clear button will call onClear ', async () => {
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

    it('Clicking will show the options ', async () => {
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

    it('getRecipients is called on init ', async () => {
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
});
