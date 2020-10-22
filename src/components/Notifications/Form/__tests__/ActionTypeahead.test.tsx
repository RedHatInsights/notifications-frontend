import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { ActionTypeahead } from '../ActionTypeahead';
import { Action, NotificationType } from '../../../../types/Notification';
import jestMock from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

const getWrapper = () => {
    const Wrapper: React.FunctionComponent = (props) => (
        <Formik initialValues={ {} } onSubmit={ jestMock.fn<any, any>() }>
            <Form>{ props.children }</Form>
        </Formik>
    );

    return {
        Wrapper
    };
};

describe('src/components/Notifications/Form/ActionTypeahead', () => {
    it('Renders the passed action type', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const { Wrapper } = getWrapper();
        render(
            <ActionTypeahead action={ action } actionSelected={ jestMock.fn() }/>,
            {
                wrapper: Wrapper
            }
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeVisible();
    });

    it('Renders disabled if isDisabled', () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const { Wrapper } = getWrapper();
        render(
            <ActionTypeahead action={ action } isDisabled={ true } actionSelected={ jestMock.fn() }/>,
            {
                wrapper: Wrapper
            }
        );

        expect(screen.getByDisplayValue(/Send to notification drawer/i)).toBeDisabled();
    });

    it('Calls actionSelected when selecting any action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const actionSelected = jestMock.fn();
        const { Wrapper } = getWrapper();
        render(
            <ActionTypeahead action={ action } actionSelected={ actionSelected }/>,
            {
                wrapper: Wrapper
            }
        );

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(actionSelected).toHaveBeenCalled();
    });

    it('Closes selection list when clicking on an action', async () => {
        const action: Action = {
            type: NotificationType.DRAWER,
            recipient: [
                'Foo', 'Bar'
            ]
        };
        const actionSelected = jestMock.fn();
        const { Wrapper } = getWrapper();
        render(
            <ActionTypeahead action={ action } actionSelected={ actionSelected }/>,
            {
                wrapper: Wrapper
            }
        );

        userEvent.click(screen.getByRole('button'));
        userEvent.click(screen.getAllByRole('option')[0]);
        await waitForAsyncEvents();
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

});
