/* eslint-disable testing-library/no-unnecessary-act */
import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import EventsWidget from './EventsWidget';

const notifications = [
  {
    id: '1',
    event_type: 'Policy triggered',
    application: 'Policies',
    bundle: 'Red Hat Enterprise Linux',
    read: false,
    description: 'Policy triggered event',
    created: '2023-05-02T11:43:00Z',
  },
  {
    id: '2',
    event_type: 'New advisory',
    application: 'Patch',
    bundle: 'Red Hat Enterprise Linux',
    read: false,
    description: 'New advisory event',
    created: '2023-05-02T11:43:00Z',
  },
  {
    id: '3',
    event_type: 'New recommendation',
    application: 'Advisor',
    bundle: 'Red Hat Enterprise Linux',
    read: false,
    description: 'New recommendation event',
    created: '2023-05-02T11:43:00Z',
  },
  {
    id: '4',
    event_type: 'New advisory',
    application: 'Patch',
    bundle: 'Red Hat Enterprise Linux',
    read: false,
    description: 'New advisory event',
    created: '2023-05-02T11:43:00Z',
  },
  {
    id: '5',
    event_type: 'New recommendation',
    application: 'Advisor',
    bundle: 'Red Hat Enterprise Linux',
    read: false,
    description: 'New recommendation event',
    created: '2023-05-02T11:43:00Z',
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
                meta: { count: 0 },
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
                meta: { count: notifications.length },
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
    // 1 header row + 5 data rows
    expect(screen.getAllByRole('row')).toHaveLength(6);
    // Check that pagination is rendered (only bottom pagination)
    expect(
      screen.getByLabelText('Events widget footer pagination')
    ).toBeVisible();
  });
});
