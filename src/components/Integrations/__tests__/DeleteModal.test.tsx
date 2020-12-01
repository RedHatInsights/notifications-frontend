import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import jestMock from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { Schemas } from '../../../generated/OpenapiIntegrations';
import { UserIntegrationType } from '../../../types/Integration';
import { IntegrationDeleteModal } from '../DeleteModal';

describe('src/components/Integrations/DeleteModal', () => {
    it('Has Remove integration title', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
                integration={ {
                    name: 'foobar',
                    type: UserIntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        expect(screen.getByText('Remove integration')).toBeTruthy();
    });

    it('Has the integration name in the content', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: UserIntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        expect(screen.getByText(/sdiofgjiofdsjgoifjso/)).toBeTruthy();
    });

    it('Does not render if integration is undefined', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
            />
        );

        expect(document.body.lastChild).toBeEmptyDOMElement();
    });

    it('Clicking delete calls onDelete, if returns true calls onClose', async () => {
        const onDelete = jestMock.fn(() => true);
        const onClose = jestMock.fn();
        render(
            <IntegrationDeleteModal
                onDelete={ onDelete }
                isDeleting={ false }
                onClose={ onClose }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: UserIntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        userEvent.click(ouiaSelectors.getByOuia('PF4/Button', 'action'));

        await waitForAsyncEvents();
        expect(onDelete).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('Clicking delete calls onDelete, if returns false it does not call onClose', async () => {
        const onDelete = jestMock.fn(() => false);
        const onClose = jestMock.fn();
        render(
            <IntegrationDeleteModal
                onDelete={ onDelete }
                isDeleting={ false }
                onClose={ onClose }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: UserIntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        userEvent.click(ouiaSelectors.getByOuia('PF4/Button', 'action'));

        await waitForAsyncEvents();
        expect(onDelete).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});
