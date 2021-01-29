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

    it('Passing notifications renders the expanded content with the number of elements', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
                notifications={ [
                    {
                        useDefault: false,
                        actions: [],
                        id: 1,
                        applicationDisplayName: 'Foo application',
                        eventTypeDisplayName: 'Foo event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 2,
                        applicationDisplayName: 'Bar application',
                        eventTypeDisplayName: 'Bar event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 3,
                        applicationDisplayName: 'Baz application',
                        eventTypeDisplayName: 'Baz event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 4,
                        applicationDisplayName: '24446666688888888000000000',
                        eventTypeDisplayName: 'Password'
                    }
                ] }
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
        expect(screen.getByTestId(/removing-integration-with-notifications-4/)).toBeTruthy();
    });

    it('Passing empty notifications renders a different message', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
                notifications={ [] }
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
        expect(screen.getByTestId(/removing-integration-without-notifications/)).toBeTruthy();
    });

    it('Opening the expandable reveals the notifications', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ jestMock.fn() }
                isDeleting={ false }
                onClose={ jestMock.fn() }
                notifications={ [
                    {
                        useDefault: false,
                        actions: [],
                        id: 1,
                        applicationDisplayName: 'Foo application',
                        eventTypeDisplayName: 'Foo event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 2,
                        applicationDisplayName: 'Bar application',
                        eventTypeDisplayName: 'Bar event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 3,
                        applicationDisplayName: 'Baz application',
                        eventTypeDisplayName: 'Baz event type'
                    },
                    {
                        useDefault: false,
                        actions: [],
                        id: 4,
                        applicationDisplayName: '24446666688888888000000000',
                        eventTypeDisplayName: 'Password'
                    }
                ] }
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

        userEvent.click(screen.getByText(/View 4 events./i));
        expect(screen.getByText('Foo application: Foo event type')).toBeVisible();
        expect(screen.getByText('Bar application: Bar event type')).toBeVisible();
        expect(screen.getByText('Baz application: Baz event type')).toBeVisible();
        expect(screen.getByText('24446666688888888000000000: Password')).toBeVisible();
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
