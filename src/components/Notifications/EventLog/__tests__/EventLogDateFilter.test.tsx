import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EventPeriod } from '../../../../types/Event';
import {
  EventLogDateFilter,
  EventLogDateFilterValue,
} from '../EventLogDateFilter';
import {
  NotificationsLogDateFilter,
  NotificationsLogDateFilterValue,
} from '../../NotificationsLog/NotificationsLogDateFilter';

const expectedLabels = [
  'Today',
  'Yesterday',
  'Last 7 days',
  'Last 14 days',
  'Custom',
];

describe.each([
  {
    name: 'EventLogDateFilter',
    Component: EventLogDateFilter,
    FilterValue: EventLogDateFilterValue,
  },
  {
    name: 'NotificationsLogDateFilter',
    Component: NotificationsLogDateFilter,
    FilterValue: NotificationsLogDateFilterValue,
  },
])('$name', ({ Component, FilterValue }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DateFilter = Component as React.ComponentType<any>;
  const defaultProps = {
    value: FilterValue.TODAY,
    setValue: jest.fn(),
    retentionDays: 14,
    period: [undefined, undefined] as EventPeriod,
    setPeriod: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the current value label in the toggle', () => {
    render(<DateFilter {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Today' })).toBeVisible();
  });

  it('displays all dropdown options with correct labels', async () => {
    render(<DateFilter {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Today' }));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expectedLabels.forEach((label, i) => {
      expect(options[i]).toHaveTextContent(label);
    });
  });

  it('calls setValue when an option is selected', async () => {
    render(<DateFilter {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Today' }));
    await userEvent.click(screen.getByText('Last 7 days'));

    expect(defaultProps.setValue).toHaveBeenCalledWith(FilterValue.LAST_7);
  });

  it('shows custom date pickers when Custom is selected', () => {
    render(<DateFilter {...defaultProps} value={FilterValue.CUSTOM} />);

    expect(screen.getByPlaceholderText('Start')).toBeVisible();
    expect(screen.getByPlaceholderText('End')).toBeVisible();
  });

  it('does not show custom date pickers for non-custom values', () => {
    render(<DateFilter {...defaultProps} />);

    expect(screen.queryByPlaceholderText('Start')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('End')).not.toBeInTheDocument();
  });
});
