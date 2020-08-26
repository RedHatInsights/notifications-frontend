import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DeleteModal } from '../DeleteModal';
import jestMock from 'jest-mock';
import { ouiaSelectors } from '../../../utils/OuiaSelectors';
import userEvent from '@testing-library/user-event';
import { waitForAsyncEvents } from '../../../../test/TestUtils';

describe('src/components/DeleteModal/DeleteModal', () => {
    it('Is empty when isOpen is false', () => {
        render(
            <DeleteModal
                isOpen={ false }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onDelete={ jestMock.fn() }
            />
        );
        expect(document.body.lastChild).toBeEmptyDOMElement();
    });

    it('Is not empty when isOpen is true', () => {
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onDelete={ jestMock.fn() }
            />
        );

        expect(document.body.lastChild).not.toBeEmptyDOMElement();
    });

    it('Buttons are enabled when isDeleting is false', () => {
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onDelete={ jestMock.fn() }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'submit')).toBeEnabled();
        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toBeEnabled();
    });

    it('Buttons are disabled when isDeleting is true', () => {
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onDelete={ jestMock.fn() }
            />
        );

        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'submit')).toBeDisabled();
        expect(ouiaSelectors.getOuiaElement('PF4/Button', 'cancel')).toBeDisabled();
    });

    it('Modal contains the title and content', () => {
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ true }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ jestMock.fn() }
                onDelete={ jestMock.fn() }
            />
        );

        expect(screen.getByText('foo')).toBeTruthy();
        expect(screen.getByText('bar')).toBeTruthy();
    });

    it('onClose is called with false when clicking the cancel and the x button', async () => {
        const onClose = jestMock.fn();
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onDelete={ jestMock.fn() }
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

    it('onDelete is called when clicking the delete button, it calls onClose (with true) if returns true', async () => {
        const onClose = jestMock.fn();
        const onDelete = jestMock.fn(() => true);
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onDelete={ onDelete }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'submit')!);
        await waitForAsyncEvents();
        expect(onDelete).toHaveBeenCalled();
        expect(onClose).toHaveBeenLastCalledWith(true);
    });

    it('onDelete also supports returning a Promise<boolean>', async () => {
        const onClose = jestMock.fn();
        const onDelete = jestMock.fn(() => Promise.resolve(true));
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onDelete={ onDelete }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'submit')!);
        await waitForAsyncEvents();
        expect(onDelete).toHaveBeenCalled();
        expect(onClose).toHaveBeenLastCalledWith(true);
    });

    it('onDelete is called when clicking the delete button, it does not call onClose if returns false', async () => {
        const onClose = jestMock.fn();
        const onDelete = jestMock.fn(() => false);
        render(
            <DeleteModal
                isOpen={ true }
                isDeleting={ false }
                title={ 'foo' }
                content={ 'bar' }
                onClose={ onClose }
                onDelete={ onDelete }
            />
        );

        userEvent.click(ouiaSelectors.getOuiaElement('PF4/Button', 'submit')!);
        await waitForAsyncEvents();
        expect(onDelete).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

});
