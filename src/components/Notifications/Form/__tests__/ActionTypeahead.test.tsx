import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionTypeahead } from '../ActionTypeahead';
import { Action, NotificationType } from '../../../../types/Notification';
import jestMock from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

describe('src/components/Notifications/Form/ActionTypeahead', () => {
    it('Renders the passed action type', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            integrationId: '123-4567-8901',
            recipient: [
                'Foo', 'Bar'
            ]
        };
        render(
            <ActionTypeahead action={ action } onSelected={ jestMock.fn() }/>
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeVisible();
    });

    it('Renders disabled if isDisabled', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            integrationId: '123-4567-8901',
            recipient: [
                'Foo', 'Bar'
            ]
        };
        render(
            <ActionTypeahead action={ action } isDisabled={ true } onSelected={ jestMock.fn() }/>
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeDisabled();
    });

    it('Calls actionSelected when selecting any action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            integrationId: '123-4567-8901',
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const actionSelected = jestMock.fn();
        render(
            <ActionTypeahead action={ action } onSelected={ actionSelected }/>
        );

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(actionSelected).toHaveBeenCalled();
    });

    it('Closes selection list when clicking on an action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            integrationId: '123-4567-8901',
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const actionSelected = jestMock.fn();
        render(
            <ActionTypeahead action={ action } onSelected={ actionSelected }/>
        );

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

});
