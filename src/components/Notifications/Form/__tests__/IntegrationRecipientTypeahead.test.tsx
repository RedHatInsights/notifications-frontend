import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import jestMock from 'jest-mock';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { IntegrationRecipientTypeahead } from '../IntegrationRecipientTypeahead';
import { IntegrationType } from '../../../../types/Integration';
import { IntegrationRef } from '../../../../types/Notification';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import userEvent from '@testing-library/user-event';

const ref1: IntegrationRef = {
    id: '1234',
    type: IntegrationType.WEBHOOK,
    isEnabled: true,
    name: 'Integration 1234'
};

const ref2: IntegrationRef = {
    id: 'abcd',
    type: IntegrationType.WEBHOOK,
    isEnabled: true,
    name: 'ABCD'
};

describe('src/components/Notifications/Form/IntegrationRecipientTypeAhead', () => {
    it('Renders', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ IntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
    });

    it('Renders disabled if isDisabled', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ IntegrationType.WEBHOOK }
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
            integrationType={ IntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);

        await waitForAsyncEvents();
        expect(screen.getByDisplayValue('Integration 1234')).toBeVisible();
    });

    it('Clicking will show the options ', async () => {
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ IntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        userEvent.click(screen.getByRole('button', {
            name: /Options menu/i
        }));

        await waitForAsyncEvents();
        expect(screen.getByText('Integration 1234')).toBeVisible();
    });

    it('getIntegrations is called on init ', async () => {
        const getIntegrations = jestMock.fn<any, any>(async () => [ ref1, ref2 ]);
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ getIntegrations }
            integrationType={ IntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        expect(getIntegrations).toHaveBeenCalledWith(IntegrationType.WEBHOOK, '');
    });

    it('When writing, getRecipients is called with the input', async () => {
        const getIntegrations = jestMock.fn<any, any>(async () => [ ref1, ref2 ]);
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ getIntegrations }
            integrationType={ IntegrationType.WEBHOOK }
            onSelected={ jestMock.fn() }
        />);
        await waitForAsyncEvents();
        await act(async () => {
            await userEvent.type(screen.getByRole('textbox'), 'guy');
        });
        expect(getIntegrations).toHaveBeenCalledWith(IntegrationType.WEBHOOK, 'guy');
    });

    it('onSelected GetsCalled when selecting an element', async () => {
        const onSelected = jestMock.fn();
        render(<IntegrationRecipientTypeahead
            selected={ undefined }
            getIntegrations={ jestMock.fn<any, any>(async () => [ ref1, ref2 ]) }
            integrationType={ IntegrationType.WEBHOOK }
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
