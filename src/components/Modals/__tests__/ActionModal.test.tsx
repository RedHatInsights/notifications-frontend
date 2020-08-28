/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { getByText, render, screen } from '@testing-library/react';
import { ActionModal } from '../ActionModal';
import jestMock from 'jest-mock';
import { ouiaSelectors } from '../../../utils/OuiaSelectors';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { ButtonVariant, ModalVariant } from '@patternfly/react-core';

describe('src/components/Modals/ActionModal', () => {
    it('Is empty when isOpen is false', () => {
        render(
            <ActionModal
                isOpen={ false }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );
        expect(document.body.lastChild).toBeEmptyDOMElement();
    });

    it('Is not empty when isOpen is true', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        expect(document.body.lastChild).not.toBeEmptyDOMElement();
    });

    it('cancelButtonTitle defaults to cancel', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonVariant={ ButtonVariant.primary }
                actionButtonTitle={ 'do it' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toHaveTextContent(/cancel/i);
    });

    it('cancel button has the cancelButtonTitle text', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonVariant={ ButtonVariant.primary }
                actionButtonTitle={ 'do it' }
                cancelButtonTitle={ 'nooooo' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toHaveTextContent(/nooooo/i);
    });

    it('actionButton uses passed actionButtonVariant', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonVariant={ ButtonVariant.danger }
                actionButtonTitle={ 'do it' }
                cancelButtonTitle={ 'nooooo' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'action')).toHaveClass('pf-m-danger');
    });

    it('modal variant defaults to small', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonVariant={ ButtonVariant.danger }
                actionButtonTitle={ 'do it' }
                cancelButtonTitle={ 'nooooo' }
            />
        );

        expect(
            ouiaSelectors.getOuiaElement('PF4/ModalContent')
        ).toHaveClass('pf-m-sm');
    });

    it('modal uses the given variant', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonVariant={ ButtonVariant.danger }
                actionButtonTitle={ 'do it' }
                cancelButtonTitle={ 'nooooo' }
                variant={ ModalVariant.large }
            />
        );

        expect(
            ouiaSelectors.getOuiaElement('PF4/ModalContent')
        ).toHaveClass('pf-m-lg');
    });

    it('Buttons are enabled when isPerformingAction is false', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'action')).toBeEnabled();
        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toBeEnabled();
    });

    it('Buttons are disabled when isPerformingAction is true', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'action')).toBeDisabled();
        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toBeDisabled();
    });

    it('Modal contains the title and content', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        expect(screen.getByText('foo')).toBeTruthy();
        expect(screen.getByText('bar')).toBeTruthy();
    });

    it('No error is shown if error prop is not passed', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Alert')).toBeUndefined();
    });

    it('Show error if error prop is passed', () => {
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
                error={ {
                    title: 'This is an error',
                    description: 'And its description'
                } }
            />
        );

        const alert = ouiaSelectors.getOuiaElement('PF4/Alert');

        expect(alert).toBeTruthy();
        expect(getByText(alert!, /this is an error/i)).toBeTruthy();
        expect(getByText(alert!, /And its description/i)).toBeTruthy();
    });

    it('onClose is called with false when clicking the cancel and the x button', async () => {
        const onClose = jestMock.fn();
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onAction={ jestMock.fn() }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')!);
        expect(onClose).toHaveBeenLastCalledWith(false);

        userEvent.click(screen.getByLabelText(/close/i, {
            selector: 'button'
        }));
        expect(onClose).toHaveBeenLastCalledWith(false);

        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('onAction is called when clicking the delete button, it calls onClose (with true) if returns true', async () => {
        const onClose = jestMock.fn();
        const onAction = jestMock.fn(() => true);
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onAction={ onAction }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'action')!);
        await waitForAsyncEvents();
        expect(onAction).toHaveBeenCalled();
        expect(onClose).toHaveBeenLastCalledWith(true);
    });

    it('onAction also supports returning a Promise<boolean>', async () => {
        const onClose = jestMock.fn();
        const onAction = jestMock.fn(() => Promise.resolve(true));
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onAction={ onAction }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'action')!);
        await waitForAsyncEvents();
        expect(onAction).toHaveBeenCalled();
        expect(onClose).toHaveBeenLastCalledWith(true);
    });

    it('onAction is called when clicking the delete button, it does not call onClose if returns false', async () => {
        const onClose = jestMock.fn();
        const onAction = jestMock.fn(() => false);
        render(
            <ActionModal
                isOpen={ true }
                isPerformingAction={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onAction={ onAction }
                actionButtonTitle={ 'do it' }
                actionButtonVariant={ ButtonVariant.primary }
                cancelButtonTitle={ 'no!' }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'action')!);
        await waitForAsyncEvents();
        expect(onAction).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

});
