/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import { getByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { Schemas } from '../../../generated/OpenapiIntegrations';
import { IntegrationType } from '../../../types/Integration';
import { IntegrationRow, IntegrationsTable } from '../Table';

describe('components/Integrations/Table', () => {

    const integrationTemplate: Readonly<IntegrationRow> = {
        id: 'integration-id',
        name: 'integration-name',
        type: IntegrationType.WEBHOOK,
        isEnabled: true,
        method: Schemas.HttpType.Enum.GET,
        url: 'http://foobar.com',
        isOpen: false,
        secretToken: 'my secret',
        sslVerificationEnabled: true,
        isSelected: false,
        isEnabledLoading: false,
        isConnectionAttemptLoading: false,
        lastConnectionAttempts: [
            {
                isSuccess: true,
                date: new Date(Date.parse('2020-01-22'))
            },
            {
                isSuccess: true,
                date: new Date(Date.parse('2020-01-21'))
            },
            {
                isSuccess: true,
                date: new Date(Date.parse('2020-01-20'))
            },
            {
                isSuccess: true,
                date: new Date(Date.parse('2020-01-19'))
            },
            {
                isSuccess: true,
                date: new Date(Date.parse('2020-01-15'))
            }
        ]
    };

    it('Renders the name', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, name: 'foobar123456' }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider >);

        expect(screen.getByText(/foobar123456/)).toBeVisible();
    });

    it('Renders webhook type as Webhook', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, type: IntegrationType.WEBHOOK }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByText(/Webhook/)).toBeVisible();
    });

    it('If integration is enabled, the switch is on', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isEnabled: true }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const input = ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id').querySelector('input');
        expect(input).toBeChecked();
    });

    it('If integration is disabled, the switch is off', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isEnabled: false }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const input = ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id').querySelector('input');
        expect(input).not.toBeChecked();
    });

    it('Last connection attempt show as success and success icon if all are success', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{
                ...integrationTemplate, lastConnectionAttempts: [
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-22'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-21'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-20'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-19'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-15'))
                    }
                ]
            }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const lastConnectionAttemptText = screen.getByText('Success');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('success-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show last attempt status with degraded connection if there is at least one success and at ' +
        'least one failure (last=success)', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{
                ...integrationTemplate, lastConnectionAttempts: [
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-22'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-21'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-20'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-19'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-15'))
                    }
                ]
            }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const lastConnectionAttemptText = screen.getByText('Success');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('success-icon')).toBeVisible();
        expect(screen.getByText(/degraded connection/i)).toBeVisible();
    });

    it('Last connection attempt show last attempt status with degraded connection if there is at least one success ' +
        'and at least one failure (last=fail)',
    () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{
                ...integrationTemplate, lastConnectionAttempts: [
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-22'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-21'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-20'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-19'))
                    },
                    {
                        isSuccess: true,
                        date: new Date(Date.parse('2020-01-15'))
                    }
                ]
            }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const lastConnectionAttemptText = screen.getByText('Failure');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('fail-icon')).toBeVisible();
        expect(screen.getByText(/degraded connection/i)).toBeVisible();
    });

    it('Last connection attempt show as failed with fail icon if all are failed', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{
                ...integrationTemplate, lastConnectionAttempts: [
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-22'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-21'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-20'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-19'))
                    },
                    {
                        isSuccess: false,
                        date: new Date(Date.parse('2020-01-15'))
                    }
                ]
            }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const lastConnectionAttemptText = screen.getByText('Failure');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('fail-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show as unknown with off icon if there are no attempts', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: []}] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const lastConnectionAttemptText = screen.getByText('Unknown');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('off-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show an error if attempts is undefined', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: undefined }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByText('Error fetching connection attempts')).toBeVisible();
    });

    it('Last connection attempt show as loading if isConnectionAttemptLoading is true', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isConnectionAttemptLoading: true }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByRole('progressbar')).toBeVisible();
    });

    it('If isEnabledLoading is true, shows a loading spinner', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isEnabledLoading: true }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByRole('progressbar')).toBeVisible();
    });

    it('Expanded content is hidden if isOpen is false', () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isOpen: false }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByText('Endpoint URL')).not.toBeVisible();
    });

    it('Expanded content is showing if isOpen is true', async () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isOpen: true }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByText('Endpoint URL')).toBeVisible();
    });

    it('Show webhook details in expanded content', async () => {
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [{ ...integrationTemplate, isOpen: true, url: 'my-url', secretToken: 'fooo', sslVerificationEnabled: true }] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        expect(screen.getByText('Endpoint URL')).toBeVisible();
        expect(screen.getByText('Endpoint URL').nextElementSibling!).toHaveTextContent('my-url');
        expect(screen.getByText('SSL verification')).toBeVisible();
        expect(screen.getByText('SSL verification').nextElementSibling!).toHaveTextContent('Enabled');
        expect(screen.getByText('Authentication type')).toBeVisible();
        expect(screen.getByText('Authentication type').nextElementSibling!).toHaveTextContent('Secret token');

    });

    it('Clicking Details arrow calls onCollapse with the integration, index and opposite of isOpen', async () => {
        const integration = { ...integrationTemplate, isOpen: true };
        const onCollapse = fn();
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
            onCollapse={ onCollapse }
        /></IntlProvider>);

        userEvent.click(screen.getByLabelText('Details'));

        await waitForAsyncEvents();

        expect(onCollapse).toHaveBeenLastCalledWith(integration, 0, false);
    });

    it('Clicking Enable Switch calls onEnable with the integration, index and opposite of isEnabled', async () => {
        const integration = { ...integrationTemplate, isEnabled: true };
        const onEnable = fn();
        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
            onEnable={ onEnable }
        /></IntlProvider>);

        userEvent.click(ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id'));

        await waitForAsyncEvents();

        expect(onEnable).toHaveBeenLastCalledWith(integration, 0, false);
    });

    it('Show connection alert degraded if there is any failure on expanded content', async () => {
        const integration = {
            ...integrationTemplate, isOpen: true, lastConnectionAttempts: [
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-22'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-21'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-20'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-19'))
                },
                {
                    isSuccess: true,
                    date: new Date(Date.parse('2020-01-15'))
                }
            ]
        };

        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const alert = ouiaSelectors.getByOuia('Notifications/ConnectionAlert');

        expect(alert).toBeVisible();
        expect(getByText(alert, /Connection is degraded/i)).toBeVisible();
    });

    it('Show connection alert failed if all are failure on expanded content', async () => {
        const integration = {
            ...integrationTemplate, isOpen: true, lastConnectionAttempts: [
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-22'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-21'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-20'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-19'))
                },
                {
                    isSuccess: false,
                    date: new Date(Date.parse('2020-01-15'))
                }
            ]
        };

        render(<IntlProvider locale={ navigator.language }><IntegrationsTable
            isLoading={ false }
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
        /></IntlProvider>);

        const alert = ouiaSelectors.getByOuia('Notifications/ConnectionAlert');

        expect(alert).toBeVisible();
        expect(getByText(alert, /Failed connection/i)).toBeVisible();
    });
});
