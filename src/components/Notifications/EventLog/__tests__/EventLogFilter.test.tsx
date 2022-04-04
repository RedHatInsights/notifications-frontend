import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EventLogTreeFilter } from '../EventLogTreeFilter';

const groups = [
    {
        id: '1',
        name: 'rhel',
        displayName: 'Red Hat Enterprise Linux'
    },
    {
        id: '2',
        name: 'openshift',
        displayName: 'OpenShift'
    }
];

const applications = [
    {
        id: '3',
        name: 'policies',
        displayName: 'Policies'
    },
    {
        id: '4',
        name: 'drift',
        displayName: 'Drift'
    }
];

describe('src/components/Notifications/EventLog', () => {
    it('Render and perform basic tree filtering', async () => {
        render(<EventLogTreeFilter
            groups={ groups }
            items={ applications }
            placeholder={ 'Filter by application' }
            filters={ [] }
            updateFilters={ jest.fn() }
        />
        );

        userEvent.click(screen.getByRole('button'));
        expect(screen.getByText(/Red Hat Enterprise Linux/i)).toBeVisible();

        const firstCheckbox = screen.getAllByRole('checkbox')[0];
        userEvent.click(firstCheckbox);
        expect(firstCheckbox).toBeChecked();

        const firstDropdown = screen.getAllByRole('button')[1];
        userEvent.click(firstDropdown);
        expect(screen.getByText(/Policies/i)).toBeVisible();
    });
});
