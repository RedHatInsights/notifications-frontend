import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Action, NotificationType } from '../../../../types/Notification';
import { ActionTypeahead } from '../ActionTypeahead';
import { NotificationRecipient } from '../../../../types/Recipient';

const ALL_RECIPIENTS = [
    new NotificationRecipient(undefined, false),
    new NotificationRecipient(undefined, true)
] as ReadonlyArray<NotificationRecipient>;

describe('src/components/Notifications/Form/ActionTypeahead', () => {
    it('Renders the passed action type', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        render(
            <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ fn() } />
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeVisible();
    });

    it('Renders disabled if isDisabled', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        render(
            <ActionTypeahead selectedNotifications={ [] } action={ action } isDisabled={ true } onSelected={ fn() } />
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeDisabled();
    });

    it('Selected notification doesnt show except for Integrations', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const actionSelected = fn();
        render(
            <ActionTypeahead
                selectedNotifications={ [ NotificationType.EMAIL_SUBSCRIPTION, NotificationType.DRAWER, NotificationType.INTEGRATION ] }
                action={ action }
                onSelected={ actionSelected }
            />
        );

        userEvent.click(screen.getByRole('button'));
        expect(screen.queryByText(/send an email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/integration:/i)).toBeInTheDocument();
    });

    it('Calls actionSelected when selecting any action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: ALL_RECIPIENTS
        };
        const actionSelected = fn();
        render(
            <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ actionSelected } />
        );

        userEvent.click(screen.getByRole('button'));
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
        render(
            <ActionTypeahead selectedNotifications={ [] } action={ action } onSelected={ actionSelected } />
        );

        userEvent.click(screen.getByRole('button'));
        await waitForAsyncEvents();
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

});
