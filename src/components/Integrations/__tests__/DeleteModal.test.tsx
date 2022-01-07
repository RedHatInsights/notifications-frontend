import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { Schemas } from '../../../generated/OpenapiIntegrations';
import { IntegrationType } from '../../../types/Integration';
import { IntegrationDeleteModal } from '../DeleteModal';

describe('src/components/Integrations/DeleteModal', () => {
    it('Has Delete integration title', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ fn() }
                isDeleting={ false }
                onClose={ fn() }
                integration={ {
                    name: 'foobar',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        expect(screen.getByText('Delete integration')).toBeTruthy();
    });

    it('Passing notifications renders the expanded content with the number of elements', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ fn() }
                isDeleting={ false }
                onClose={ fn() }
                behaviorGroups={ [
                    {
                        actions: [],
                        id: '1',
                        bundleId: 'bundle-id',
                        displayName: 'Foo stuff',
                        bundleName: 'b1'
                    },
                    {
                        actions: [],
                        id: '2',
                        bundleId: 'bundle-id',
                        displayName: 'Bar application',
                        bundleName: 'b1'
                    },
                    {
                        actions: [],
                        id: '3',
                        bundleId: 'other-id',
                        displayName: 'Baz peek',
                        bundleName: 'ABC'
                    },
                    {
                        actions: [],
                        id: '4',
                        bundleId: '24446666688888888000000000',
                        displayName: 'Password',
                        bundleName: 'Fake'
                    }
                ] }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
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
                onDelete={ fn() }
                isDeleting={ false }
                onClose={ fn() }
                behaviorGroups={ [] }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
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
                onDelete={ fn() }
                isDeleting={ false }
                onClose={ fn() }
                behaviorGroups={ [
                    {
                        actions: [],
                        id: '1',
                        bundleId: 'bundle-id',
                        displayName: 'Foo stuff',
                        bundleName: 'b1'
                    },
                    {
                        actions: [],
                        id: '2',
                        bundleId: 'bundle-id',
                        displayName: 'Bar application',
                        bundleName: 'b1'
                    },
                    {
                        actions: [],
                        id: '3',
                        bundleId: 'other-id',
                        displayName: 'Baz peek',
                        bundleName: 'ABC'
                    },
                    {
                        actions: [],
                        id: '4',
                        bundleId: '24446666688888888000000000',
                        displayName: 'Password',
                        bundleName: 'Fake'
                    }
                ] }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'url',
                    id: '123',
                    secretToken: 'foo',
                    method: Schemas.HttpType.Enum.GET,
                    sslVerificationEnabled: false
                } }
            />
        );

        userEvent.click(screen.getByText(/View 4 behavior groups./i));
        expect(screen.getByText('b1: Foo stuff')).toBeVisible();
        expect(screen.getByText('b1: Bar application')).toBeVisible();
        expect(screen.getByText('ABC: Baz peek')).toBeVisible();
        expect(screen.getByText('Fake: Password')).toBeVisible();
    });

    it('Does not render if integration is undefined', () => {
        render(
            <IntegrationDeleteModal
                onDelete={ fn() }
                isDeleting={ false }
                onClose={ fn() }
            />
        );

        expect(document.body.lastChild).toBeEmptyDOMElement();
    });

    it('Clicking delete calls onDelete, if returns true calls onClose', async () => {
        const onDelete = fn(() => true);
        const onClose = fn();
        render(
            <IntegrationDeleteModal
                onDelete={ onDelete }
                isDeleting={ false }
                onClose={ onClose }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
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
        const onDelete = fn(() => false);
        const onClose = fn();
        render(
            <IntegrationDeleteModal
                onDelete={ onDelete }
                isDeleting={ false }
                onClose={ onClose }
                integration={ {
                    name: 'sdiofgjiofdsjgoifjso',
                    type: IntegrationType.WEBHOOK,
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
