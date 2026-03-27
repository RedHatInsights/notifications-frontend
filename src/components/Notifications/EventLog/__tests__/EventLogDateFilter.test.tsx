import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  EventLogDateFilter,
  EventLogDateFilterValue,
} from '../EventLogDateFilter';

describe('EventLogDateFilter', () => {
  it('renders all timespan option labels in the dropdown', async () => {
    render(
      <EventLogDateFilter
        value={EventLogDateFilterValue.LAST_14}
        setValue={jest.fn()}
        retentionDays={14}
        period={[undefined, undefined]}
        setPeriod={jest.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button'));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('Today');
    expect(options[1]).toHaveTextContent('Yesterday');
    expect(options[2]).toHaveTextContent('Last 7 days');
    expect(options[3]).toHaveTextContent('Last 14 days');
    expect(options[4]).toHaveTextContent('Custom');
  });
});
