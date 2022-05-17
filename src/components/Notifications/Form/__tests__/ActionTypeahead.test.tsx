import { getByRole, getByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { UserIntegrationType } from '../../../../types/Integration';
import { Action, NotificationType } from '../../../../types/Notification';
import { NotificationUserRecipient } from '../../../../types/Recipient';
import { RecipientContext, RecipientContextProvider } from '../../RecipientContext';
import { ActionTypeahead } from '../ActionTypeahead';

const ALL_RECIPIENTS = [
    new NotificationUserRecipient(undefined, false),
    new NotificationUserRecipient(undefined, true)
] as ReadonlyArray<NotificationUserRecipient>;

const defaultRecipientContext = (): RecipientContext => ({
    getIntegrations: async (type: UserIntegrationType, _search?: string) => {
        return [
            {
                type,
                id: 'foo',
                isEnabled: true,
                name: 'My integration'
            }
        ];
    },
    getNotificationRecipients: async () => []
});

const InternalWrapper: React.FunctionComponent<any> = ({ getLocation, children }) => {
    const location = useLocation();
    if (getLocation) {
        getLocation.mockImplementation(() => location);
    }

    return children;
};

const Wrapper: React.FunctionComponent<any> = ({ value, children, getLocation }) => {
    return <MemoryRouter>
        <InternalWrapper getLocation={ getLocation }>
            <RecipientContextProvider value={ value }>
                { children }
            </RecipientContextProvider>
        </InternalWrapper>
    </MemoryRouter>;
};

describe('src/components/Notifications/Form/ActionTypeahead', () => {
    it('Renders the passed action type', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const context = defaultRecipientContext();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ fn() } />
            </Wrapper>
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();

        expect(screen.getByText(/Send to notification drawer/i, {
            selector: 'button'
        })).toBeVisible();
    });

    it('Renders disabled if isDisabled', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const context = defaultRecipientContext();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } action={ action } isDisabled={ true } onSelected={ fn() } />
            </Wrapper>
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();

        expect(screen.getByText(/Send to notification drawer/i).closest('button')).toBeDisabled();
    });

    it('Selected notification doesnt show except for Integrations', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const actionSelected = fn();
        const context = defaultRecipientContext();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead
                    selectedNotifications={ [ NotificationType.EMAIL_SUBSCRIPTION, NotificationType.DRAWER, NotificationType.INTEGRATION ] }
                    action={ action }
                    onSelected={ actionSelected }
                />
            </Wrapper>
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();

        expect(screen.queryByText(/send an email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/integration: webhook/i)).toBeInTheDocument();
        expect(screen.queryByText(/integration: splunk/i)).toBeInTheDocument();
    });

    it('Calls actionSelected when selecting any action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const actionSelected = fn();
        const context = defaultRecipientContext();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ actionSelected } />
            </Wrapper>
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(actionSelected).toHaveBeenCalled();
    });

    it('Closes selection list when clicking on an action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const actionSelected = fn();
        const context = defaultRecipientContext();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ actionSelected } />
            </Wrapper>
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('Actions are enabled if they have elements', async () => {
        const context = defaultRecipientContext();
        const onSelected = fn();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } onSelected={ onSelected } />
            </Wrapper>
        );
        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const webhookAction = screen.getByText('Integration: Webhook').closest('button')!;
        expect(webhookAction).toBeEnabled();
        userEvent.click(webhookAction);
        await waitForAsyncEvents();
        expect(onSelected).toHaveBeenCalled();
    });

    it('Actions are disabled if they have no elements', async () => {
        const context = {
            getIntegrations: async (_type: UserIntegrationType, _search?: string) => [],
            getNotificationRecipients: async () => []
        };
        const onSelected = fn();
        render(
            <Wrapper value={ context }>
                <ActionTypeahead selectedNotifications={ [] } onSelected={ onSelected } />
            </Wrapper>
        );
        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const webhookAction = screen.getByText('Integration: Webhook').closest('button')!;
        expect(getByText(webhookAction, /You have no integration configured/)).toBeTruthy();
        expect(webhookAction).toHaveClass('pf-m-disabled');
        userEvent.click(webhookAction);
        await waitForAsyncEvents();
        expect(onSelected).not.toHaveBeenCalled();
    });

    it('Disabled actions have a link to integrations', async () => {
        const context = {
            getIntegrations: async (_type: UserIntegrationType, _search?: string) => [],
            getNotificationRecipients: async () => []
        };
        const getLocation = fn<any, any>();
        const { rerender } = render(
            <Wrapper value={ context } getLocation={ getLocation }>
                <ActionTypeahead selectedNotifications={ [] } onSelected={ fn() } />
            </Wrapper>
        );
        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const webhookAction = screen.getByText('Integration: Webhook').closest('button')!;
        let link = getByRole(webhookAction, 'link', {
            name: 'Integrations'
        });

        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
        expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
        expect(link).toHaveAttribute('target', '_blank');

        // for the sake of the test - removing the rel and target so that we can pick up the url change in the router
        rerender(
            <Wrapper value={ context } getLocation={ getLocation }>
                <ActionTypeahead selectedNotifications={ [] } onSelected={ fn() } testNoIntegrationRenderWithoutRelAndTarget={ true } />
            </Wrapper>
        );

        link = getByRole(webhookAction, 'link', {
            name: 'Integrations'
        });

        expect(getLocation().pathname).toEqual('/');
        userEvent.click(link);
        expect(getLocation().pathname).toEqual('/integrations');
    });

});
