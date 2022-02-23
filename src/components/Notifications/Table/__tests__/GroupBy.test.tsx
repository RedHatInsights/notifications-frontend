import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { GroupByEnum } from '../../Types';
import { GroupBy } from '../GroupBy';

describe('src/components/Notifications/Table/GroupBy', () => {
    it('renders None enum', () => {
        render(<GroupBy groupBy={ fn() } selected={ GroupByEnum.None } />);
        expect(screen.getByText(/None/)).toBeVisible();
    });

    it('renders Application enum', () => {
        render(<GroupBy groupBy={ fn() } selected={ GroupByEnum.Application } />);
        expect(screen.getByText(/Application/)).toBeVisible();
    });

    it('Calls groupBy when clicking an element', () => {
        const groupBy = fn();
        render(<GroupBy groupBy={ groupBy } selected={ GroupByEnum.None } />);
        userEvent.click(ouiaSelectors.getByOuia('PF4/DropdownToggle'));
        userEvent.click(ouiaSelectors.queryAllByOuia('PF4/DropdownItem')[0]);

        expect(groupBy).toHaveBeenCalledWith(GroupByEnum.Application);
    });
});
