import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import jestMock from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { UserIntegrationType } from '../../../../types/Integration';
import { IntegrationRef } from '../../../../types/Notification';
import { IntegrationRecipientTypeahead } from '../IntegrationRecipientTypeahead';

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

    it('When writing, getIntegrations is called with the input', async () => {
        const guyRef: IntegrationRef = {
            id: '1234',
            type: UserIntegrationType.WEBHOOK,
            isEnabled: true,
            name: 'guy integration'
        };

        const getIntegrations = jestMock.fn<any, any>(async (type, search) => {
            if (search === 'guy') {
                return [ guyRef ];
            }

            return [ ref1, ref2 ];
        });

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
        expect(screen.getByText('guy integration')).toBeTruthy();
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
