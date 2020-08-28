import * as React from 'react';
import { render } from '@testing-library/react';
import jestMock from 'jest-mock';
import { ouiaSelectors } from '../../../utils/OuiaSelectors';
import { SaveModal } from '../SaveModal';

describe('src/components/Modals/SaveModal', () => {
    it('Shows action modal with Save action button', () => {
        render(
            <SaveModal
                isSaving={ false }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isOpen={ true }
                title={ 'foobar' }
                content={ 'content' }
            />
        );

        expect(
            ouiaSelectors.getOuiaElement('PF4/Button', 'action')!
        ).toHaveTextContent('Save');
    });

    it('Shows action modal with action button style of Primary', () => {
        render(
            <SaveModal
                isSaving={ false }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isOpen={ true }
                title={ 'foobar' }
                content={ 'content' }
            />
        );

        expect(
            ouiaSelectors.getOuiaElement('PF4/Button', 'action')!
        ).toHaveClass('pf-m-primary');
    });

    it('Allows to change the action button text', () => {
        render(
            <SaveModal
                isSaving={ false }
                onSave={ jestMock.fn() }
                onClose={ jestMock.fn() }
                isOpen={ true }
                title={ 'foobar' }
                content={ 'content' }
                actionButtonTitle="Foo"
            />
        );

        expect(
            ouiaSelectors.getOuiaElement('PF4/Button', 'action')!
        ).toHaveTextContent('Foo');
    });
});
