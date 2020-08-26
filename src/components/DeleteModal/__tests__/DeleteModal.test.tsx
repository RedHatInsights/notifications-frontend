import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DeleteModal } from '../DeleteModal';
import jestMock from 'jest-mock';
import { ouiaSelectors } from '../../../utils/OuiaSelectors';

describe('src/components/DeleteModal/DeleteModal', () => {
    it('it works', () => {
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


        expect(ouiaSelectors.getOuiaElement('Notifications/DeleteModal')).toBeEmptyDOMElement();
    });
});
