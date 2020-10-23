import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { GroupBy } from '../GroupBy';
import { GroupByEnum } from '../../Types';
import jestMock from 'jest-mock';
import userEvent from '@testing-library/user-event';
import { ouiaSelectors } from 'insights-common-typescript-dev';

describe('src/components/Notifications/Table/GroupBy', () => {
    it('renders None enum', () => {
        render(<GroupBy groupBy={ jestMock.fn() } selected={ GroupByEnum.None }/>);
        expect(screen.getByText(/None/)).toBeVisible();
    });

    it('renders Application enum', () => {
        render(<GroupBy groupBy={ jestMock.fn() } selected={ GroupByEnum.Application }/>);
        expect(screen.getByText(/Application/)).toBeVisible();
    });

    it('Calls groupBy when clicking an element', () => {
        const groupBy = jestMock.fn();
        render(<GroupBy groupBy={ groupBy } selected={ GroupByEnum.None }/>);
        userEvent.click(ouiaSelectors.getByOuia('PF4/DropdownToggle'));
        userEvent.click(ouiaSelectors.queryAllByOuia('PF4/DropdownItem')[0]);

        expect(groupBy).toHaveBeenCalledWith(GroupByEnum.Application);
    });
});
