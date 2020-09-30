/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { getByText, render, screen } from '@testing-library/react';
import jestMock from 'jest-mock';
import { ouiaSelectors } from '@redhat-cloud-services/insights-common-typescript/dev';
import { IntegrationRow, IntegrationsTable } from '../Table';
import { IntegrationType } from '../../../types/Integration';
import { HttpType } from '../../../generated/Openapi';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../test/TestUtils';

describe('components/Integrations/Table', () => {

    const integrationTemplate: Readonly<IntegrationRow> = {
        id: 'integration-id',
        name: 'integration-name',
        type: IntegrationType.WEBHOOK,
        isEnabled: true,
        method: HttpType.Enum.GET,
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
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, name: 'foobar123456' }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText(/foobar123456/)).toBeVisible();
    });

    it('Renders webhook type as Webhook', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, type: IntegrationType.WEBHOOK }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText(/Webhook/)).toBeVisible();
    });

    it('If integration is enabled, the switch is on', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isEnabled: true }] }
            actionResolver={ jest.fn(() => []) }
        />);

        const input = ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id').querySelector('input');
        expect(input).toBeChecked();
    });

    it('If integration is disabled, the switch is off', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isEnabled: false }] }
            actionResolver={ jest.fn(() => []) }
        />);

        const input = ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id').querySelector('input');
        expect(input).not.toBeChecked();
    });

    it('Last connection attempt show as success and success icon if all are success', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: [
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
            ]}] }
            actionResolver={ jest.fn(() => []) }
        />);

        const lastConnectionAttemptText = screen.getByText('Success');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('success-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show last attempt status with degraded connection if there is at least one success and at ' +
        'least one failure (last=success)', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: [
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
            ]}] }
            actionResolver={ jest.fn(() => []) }
        />);

        const lastConnectionAttemptText = screen.getByText('Success');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('success-icon')).toBeVisible();
        expect(screen.getByText(/degraded connection/i)).toBeVisible();
    });

    it('Last connection attempt show last attempt status with degraded connection if there is at least one success ' +
        'and at least one failure (last=fail)',
    () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: [
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
            ]}] }
            actionResolver={ jest.fn(() => []) }
        />);

        const lastConnectionAttemptText = screen.getByText('Fail');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('fail-icon')).toBeVisible();
        expect(screen.getByText(/degraded connection/i)).toBeVisible();
    });

    it('Last connection attempt show as failed with fail icon if all are failed', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: [
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
            ]}] }
            actionResolver={ jest.fn(() => []) }
        />);

        const lastConnectionAttemptText = screen.getByText('Fail');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('fail-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show as unknown with off icon if there are no attempts', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: []}] }
            actionResolver={ jest.fn(() => []) }
        />);

        const lastConnectionAttemptText = screen.getByText('Unknown');

        expect(lastConnectionAttemptText).toBeVisible();
        expect(screen.getByTestId('off-icon')).toBeVisible();
        expect(screen.queryByText(/degraded connection/i)).toBeFalsy();
    });

    it('Last connection attempt show an error if attempts is undefined', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, lastConnectionAttempts: undefined }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText('Error fetching connection attempts')).toBeVisible();
    });

    it('Last connection attempt show as loading if isConnectionAttemptLoading is true', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isConnectionAttemptLoading: true }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByRole('progressbar')).toBeVisible();
    });

    it('If isEnabledLoading is true, shows a loading spinner', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isEnabledLoading: true }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByRole('progressbar')).toBeVisible();
    });

    it('Expanded content is hidden if isOpen is false', () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isOpen: false }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText('Endpoint URL')).not.toBeVisible();
    });

    it('Expanded content is showing if isOpen is true', async () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isOpen: true }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText('Endpoint URL')).toBeVisible();
    });

    it('Show webhook details in expanded content', async () => {
        render(<IntegrationsTable
            integrations={ [{ ...integrationTemplate, isOpen: true, url: 'my-url', secretToken: 'fooo', sslVerificationEnabled: true }] }
            actionResolver={ jest.fn(() => []) }
        />);

        expect(screen.getByText('Endpoint URL')).toBeVisible();
        expect(screen.getByText('Endpoint URL').nextElementSibling!).toHaveTextContent('my-url');
        expect(screen.getByText('SSL verification')).toBeVisible();
        expect(screen.getByText('SSL verification').nextElementSibling!).toHaveTextContent('Enabled');
        expect(screen.getByText('Authentication type')).toBeVisible();
        expect(screen.getByText('Authentication type').nextElementSibling!).toHaveTextContent('Secret token');

    });

    it('Clicking Details arrow calls onCollapse with the integration, index and opposite of isOpen', async () => {
        const integration = { ...integrationTemplate, isOpen: true };
        const onCollapse = jestMock.fn();
        render(<IntegrationsTable
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
            onCollapse={ onCollapse }
        />);

        userEvent.click(screen.getByLabelText('Details'));

        await waitForAsyncEvents();

        expect(onCollapse).toHaveBeenLastCalledWith(integration, 0, false);
    });

    it('Clicking Enable Switch calls onEnable with the integration, index and opposite of isEnabled', async () => {
        const integration = { ...integrationTemplate, isEnabled: true };
        const onEnable = jestMock.fn();
        render(<IntegrationsTable
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
            onEnable={ onEnable }
        />);

        userEvent.click(ouiaSelectors.getByOuia('PF4/Switch', 'enabled-integration-id'));

        await waitForAsyncEvents();

        expect(onEnable).toHaveBeenLastCalledWith(integration, 0, false);
    });

    it('Show connection alert degraded if there is any failure on expanded content', async () => {
        const integration = { ...integrationTemplate, isOpen: true, lastConnectionAttempts: [
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
        ]};

        render(<IntegrationsTable
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
        />);

        const alert = ouiaSelectors.getByOuia('Notifications/ConnectionAlert');

        expect(alert).toBeVisible();
        expect(getByText(alert, /Connection is degraded/i)).toBeVisible();
    });

    it('Show connection alert failed if all are failure on expanded content', async () => {
        const integration = { ...integrationTemplate, isOpen: true, lastConnectionAttempts: [
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
        ]};

        render(<IntegrationsTable
            integrations={ [ integration ] }
            actionResolver={ jest.fn(() => []) }
        />);

        const alert = ouiaSelectors.getByOuia('Notifications/ConnectionAlert');

        expect(alert).toBeVisible();
        expect(getByText(alert, /Failed connection/i)).toBeVisible();
    });
});
