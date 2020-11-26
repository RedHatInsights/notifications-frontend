import * as React from 'react';

import { act, render, screen } from '@testing-library/react';

import { IntegrationRecipientTypeahead } from '../IntegrationRecipientTypeahead';
import { IntegrationRef } from '../../../../types/Notification';
import { UserIntegrationType } from '../../../../types/Integration';
import jestMock from 'jest-mock';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

const ref1: IntegrationRef = {
    id: '1234',
    type: UserIntegrationType.WEBHOOK,
    isEnabled: true,
    name: 'Integration 1234'
};

const ref2: IntegrationRef = {
    id: 'abcd',
    type: UserIntegrationType.WEBHOOK,
    isEnabled: true,
    name: 'ABCD'
};

describe('src/components/Notifications/Form/IntegrationRecipientTypeAhead', () => {
    it('Renders', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
    });

    it('Renders disabled if isDisabled', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
            isDisabled={ true }
        />);
        await waitForAsyncEvents();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('Renders the selected even if getIntegrations does not yield it', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ ref1 }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ]) }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);

        await waitForAsyncEvents();
        expect(screen.getByDisplayValue('Integration 1234')).toBeVisible();
    });

    it('Clicking will show the options', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));

        await waitForAsyncEvents();
        expect(screen.getByText('Integration 1234')).toBeVisible();
    });

    it('getIntegrations is called on init', async () => {
        const getIntegrations = jestMock.fn<any, any>(async () => [ ref1, ref2 ]);
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ getIntegrations }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(getIntegrations).toHaveBeenCalledWith(UserIntegrationType.WEBHOOK, '');
    });

    it('When writing, getRecipients is called with the input', async () => {
        const getIntegrations = jestMock.fn<any, any>(async () => [ ref1, ref2 ]);
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ getIntegrations }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        await act(async () => {
            await userEvent.type(screen.getByRole('textbox'), 'guy');
        });
        expect(getIntegrations).toHaveBeenCalledWith(UserIntegrationType.WEBHOOK, 'guy');
    });

    it('onSelected GetsCalled when selecting an element', async () => {
        const onSelected = jestMock.fn();
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ UserIntegrationType.WEBHOOK }
            onSelected={ onSelected }
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
