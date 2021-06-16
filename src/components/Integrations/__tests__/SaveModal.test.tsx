import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { IntegrationType } from '../../../types/Integration';
import { IntegrationSaveModal } from '../SaveModal';

describe('src/components/Integrations/SaveModal', () => {
    it('Has Add integration title if isEdit is false', async () => {
        render(
            <IntegrationSaveModal
                onSave={ fn() }
                isSaving={ false }
                onClose={ fn() }
                initialIntegration={ {
                    name: 'foobar',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123'
                } }
                isEdit={ false }
            />
        );
        await waitForAsyncEvents();
        expect(screen.getByText(/Add integration/i)).toBeTruthy();
    });

    it('Has Edit integration title if isEdit is true', async () => {
        render(
            <IntegrationSaveModal
                onSave={ fn() }
                isSaving={ false }
                onClose={ fn() }
                initialIntegration={ {
                    name: 'foobar',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123'
                } }
                isEdit={ true }
            />
        );

        await waitForAsyncEvents();
        expect(screen.getByText(/Edit integration/i)).toBeTruthy();
    });

    it('Has the integration name in an input', async () => {
        render(
            <IntegrationSaveModal
                onSave={ fn() }
                isSaving={ false }
                onClose={ fn() }
                initialIntegration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123'
                } }
                isEdit={ false }
            />
        );

        await waitForAsyncEvents();
        expect(screen.getByDisplayValue('sdiofgjiofdsjgoifjso')).toBeTruthy();
    });

    it('When the integration.type is not specified, it uses Webhook', async () => {
        render(
            <IntegrationSaveModal
                onSave={ fn() }
                isSaving={ false }
                onClose={ fn() }
                initialIntegration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    isEnabled: true,
                    url: 'url',
                    id: '123'
                } }
                isEdit={ false }
            />
        );

        await waitForAsyncEvents();
        expect(screen.getByDisplayValue('Webhook')).toBeTruthy();
    });

    it('Clicking save button triggers onSave if return value is true it triggers onClose', async () => {
        const onSave = fn(() => true);
        const onClose = fn();
        render(
            <IntegrationSaveModal
                onSave={ onSave }
                isSaving={ false }
                onClose={ onClose }
                initialIntegration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'https://google.com',
                    id: '123'
                } }
                isEdit={ false }
            />
        );

        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/save/i));

        await waitForAsyncEvents();
        expect(onSave).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('Clicking save button triggers onSave if return value is false it does not trigger onClose', async () => {
        const onSave = fn(() => false);
        const onClose = fn();
        render(
            <IntegrationSaveModal
                onSave={ onSave }
                isSaving={ false }
                onClose={ onClose }
                initialIntegration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'https://google.com',
                    id: '123'
                } }
                isEdit={ false }
            />
        );

        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/save/i));

        await waitForAsyncEvents();
        expect(onSave).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});
