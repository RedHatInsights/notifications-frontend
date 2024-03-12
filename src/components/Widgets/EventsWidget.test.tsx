/* eslint-disable testing-library/no-unnecessary-act */
import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import EventsWidget from './EventsWidget';

const notifications = [
  {
    id: '1',
    title: 'Policy triggered',
    source: 'Policies - Red Hat Enterprise Linux',
    created: '2 May 2023, 11:43 UTC',
  },
  {
    id: '2',
    title: 'New advisory',
    source: 'Patch - Red Hat Enterprise Linux',
    created: '2 May 2023, 11:43 UTC',
  },
  {
    id: '3',
    title: 'New recommendation',
    source: 'Advisor - Red Hat Enterprise Linux',
    created: '2 May 2023, 11:43 UTC',
  },
  {
    id: '4',
    title: 'New advisory',
    source: 'Patch - Red Hat Enterprise Linux',
    created: '2 May 2023, 11:43 UTC',
  },
  {
    id: '5',
    title: 'New recommendation',
    source: 'Advisor - Red Hat Enterprise Linux',
    created: '2 May 2023, 11:43 UTC',
  },
];

describe('EventsWidget component', () => {
  it('should render empty', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve({
            status: 200,
            json: () =>
              Promise.resolve({
                data: [],
              }),
          } as Response);
        })
    );
    await act(async () => {
      render(<EventsWidget />);
    });

    expect(screen.getByText('No fired events')).toBeVisible();
    expect(
      screen.getByText(
        'Either you have not set up any events on the Hybrid Cloud Console or no have been fired yet.'
      )
    ).toBeVisible();
    expect(screen.getByText('Manage events')).toBeVisible();
  });

  it('should render with data', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolve({
            status: 200,
            json: () =>
              Promise.resolve({
                data: notifications,
              }),
          } as Response);
        })
    );

    await act(async () => {
      render(<EventsWidget />);
    });

    expect(screen.getByText('Event')).toBeVisible();
    expect(screen.getByText('Service')).toBeVisible();
    expect(screen.getByText('Date')).toBeVisible();
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });
});
