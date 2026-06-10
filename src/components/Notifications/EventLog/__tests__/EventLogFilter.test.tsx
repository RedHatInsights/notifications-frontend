import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EventPeriod } from '../../../../types/Event';
import { EventLogDateFilterValue } from '../EventLogDateFilter';
import { EventLogFilters, SetEventLogFilters } from '../EventLogFilter';
import { EventLogToolbar } from '../EventLogToolbar';
import { EventLogTreeFilter } from '../EventLogTreeFilter';

jest.mock('../../../../services/Notifications/GetSeverities', () => ({
  useGetSeverities: jest.fn(() => ({
    payload: {
      status: 200,
      value: ['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'],
    },
  })),
}));

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
  service: jest.fn(),
  endpointTypes: jest.fn(),
  status: jest.fn(),
  severities: jest.fn(),
};

const renderToolbar = () =>
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

describe('src/components/Notifications/EventLog', () => {
  it('Render and verify filtering options', async () => {
    renderToolbar();

    const filterDropdownBtn = screen.getAllByRole('button')[0];
    await userEvent.click(filterDropdownBtn);

    const filterDropdown = screen.getAllByRole('menuitem');

    expect(filterDropdown.length).toBe(5);
    expect(filterDropdown[0]).toHaveTextContent('Event');
    expect(filterDropdown[1]).toHaveTextContent('Service');
    expect(filterDropdown[2]).toHaveTextContent('Action Type');
    expect(filterDropdown[3]).toHaveTextContent('Action Status');
    expect(filterDropdown[4]).toHaveTextContent('Severity');
  });

  it('does not offer Undefined as a severity filter option', async () => {
    renderToolbar();

    const filterDropdownBtn = screen.getAllByRole('button')[0];
    await userEvent.click(filterDropdownBtn);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Severity' }));
    await userEvent.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeVisible();
    expect(screen.getByText('None')).toBeVisible();
  });

  it('Render custom Service filter and perform basic tree filtering', async () => {
    render(
      <EventLogTreeFilter
        groups={groups}
        placeholder={'Filter by service'}
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
