import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EventPeriod } from '../../../../types/Event';
import { EventLogDateFilterValue } from '../EventLogDateFilter';
import { EventLogFilters, SetEventLogFilters } from '../EventLogFilter';
import { EventLogToolbar } from '../EventLogToolbar';
import { EventLogTreeFilter } from '../EventLogTreeFilter';

const applications = [
  {
    id: '3',
    name: 'policies',
    displayName: 'Policies',
  },
  {
    id: '4',
    name: 'drift',
    displayName: 'Drift',
  },
];

const groups = [
  {
    id: '1',
    name: 'rhel',
    displayName: 'Red Hat Enterprise Linux',
    children: applications,
  },
  {
    id: '2',
    name: 'openshift',
    displayName: 'OpenShift',
    children: applications,
  },
];

const setFilters = {
  event: jest.fn(),
  bundle: jest.fn(),
  application: jest.fn(),
  actionType: jest.fn(),
  actionState: jest.fn(),
};

describe('src/components/Notifications/EventLog', () => {
  it('Render and verify filtering options', async () => {
    render(
      <EventLogToolbar
        filters={{} as EventLogFilters}
        setFilters={setFilters as unknown as SetEventLogFilters}
        clearFilter={jest.fn()}
        bundleOptions={[]}
        pageCount={0}
        count={0}
        page={0}
        perPage={0}
        pageChanged={jest.fn()}
        perPageChanged={jest.fn()}
        dateFilter={{} as EventLogDateFilterValue}
        setDateFilter={jest.fn()}
        retentionDays={0}
        period={{} as EventPeriod}
        setPeriod={jest.fn()}
      />
    );

    const filterDropdownBtn = screen.getAllByRole('button')[0];
    await userEvent.click(filterDropdownBtn);

    const filterDropdown = screen.getAllByRole('menuitem');

    expect(filterDropdown.length).toBe(4);
    expect(filterDropdown[0]).toHaveTextContent('Event');
    expect(filterDropdown[1]).toHaveTextContent('Application');
    expect(filterDropdown[2]).toHaveTextContent('Action Type');
    expect(filterDropdown[3]).toHaveTextContent('Action Status');
  });

  it('Render custom Application filter and perform basic tree filtering', async () => {
    render(
      <EventLogTreeFilter
        groups={groups}
        placeholder={'Filter by application'}
        filters={[]}
        updateFilters={jest.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Red Hat Enterprise Linux/i)).toBeVisible();

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    const firstDropdown = screen.getAllByRole('button')[1];
    await userEvent.click(firstDropdown);
    expect(screen.getByText(/Policies/i)).toBeVisible();
  });
});
