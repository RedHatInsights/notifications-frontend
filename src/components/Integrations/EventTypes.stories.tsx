import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import EventTypes from './EventTypes';
import { EventType, Facet } from '../../types/Notification';

const mockBundle: Facet = {
  id: 'bundle-1',
  displayName: 'Red Hat Enterprise Linux',
  name: 'rhel',
};

const mockApplications: Facet[] = [
  { id: 'app-1', displayName: 'Advisor', name: 'advisor' },
  { id: 'app-2', displayName: 'Compliance', name: 'compliance' },
  { id: 'app-3', displayName: 'Drift', name: 'drift' },
];

const mockEventTypes = [
  {
    id: 'evt-1',
    application_id: 'app-1',
    application: { id: 'app-1', display_name: 'Advisor', name: 'advisor', bundle_id: 'bundle-1' },
    display_name: 'New recommendation',
    name: 'new-recommendation',
    description: 'Triggered when a new recommendation is available for your systems.',
    default_severity: 'CRITICAL' as const,
  },
  {
    id: 'evt-2',
    application_id: 'app-1',
    application: { id: 'app-1', display_name: 'Advisor', name: 'advisor', bundle_id: 'bundle-1' },
    display_name: 'Resolved recommendation',
    name: 'resolved-recommendation',
    description: 'Triggered when a recommendation is resolved.',
    default_severity: 'LOW' as const,
  },
  {
    id: 'evt-3',
    application_id: 'app-2',
    application: {
      id: 'app-2',
      display_name: 'Compliance',
      name: 'compliance',
      bundle_id: 'bundle-1',
    },
    display_name: 'Policy updated',
    name: 'policy-updated',
    description: 'Triggered when a compliance policy is updated.',
    default_severity: 'MODERATE' as const,
  },
  {
    id: 'evt-4',
    application_id: 'app-2',
    application: {
      id: 'app-2',
      display_name: 'Compliance',
      name: 'compliance',
      bundle_id: 'bundle-1',
    },
    display_name: 'System non-compliant',
    name: 'system-non-compliant',
    default_severity: 'IMPORTANT' as const,
  },
  {
    id: 'evt-5',
    application_id: 'app-3',
    application: { id: 'app-3', display_name: 'Drift', name: 'drift', bundle_id: 'bundle-1' },
    display_name: 'Baseline updated',
    name: 'baseline-updated',
    description: 'Triggered when a drift baseline is updated.',
    default_severity: 'NONE' as const,
  },
  {
    id: 'evt-6',
    application_id: 'app-3',
    application: { id: 'app-3', display_name: 'Drift', name: 'drift', bundle_id: 'bundle-1' },
    display_name: 'Comparison completed',
    name: 'comparison-completed',
    // No severity — tests the fallback
  },
];

const eventTypesHandler = http.get(
  '/api/notifications/v2.0/notifications/eventTypes',
  ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const eventTypeName = url.searchParams.get('eventTypeName');

    let filtered = [...mockEventTypes];

    if (eventTypeName) {
      filtered = filtered.filter((et) =>
        et.display_name.toLowerCase().includes(eventTypeName.toLowerCase())
      );
    }

    return HttpResponse.json({
      data: filtered.slice(offset, offset + limit),
      meta: { count: filtered.length },
      links: {},
    });
  }
);

const EventTypesWrapper: React.FC<{ preSelected?: EventType[] }> = ({ preSelected }) => {
  const [selectedEvents, setSelectedEvents] = useState<EventType[] | undefined>(preSelected);

  return (
    <EventTypes
      currBundle={mockBundle}
      applications={mockApplications}
      selectedEvents={selectedEvents}
      setSelectedEvents={setSelectedEvents}
    />
  );
};

const meta: Meta<typeof EventTypes> = {
  title: 'Notifications/BehaviorGroupWizard/EventTypes',
  component: EventTypes,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventTypes>;

/**
 * Default view showing event types with severity column.
 * Demonstrates severity labels with icons for CRITICAL, IMPORTANT,
 * MODERATE, LOW, NONE, and the fallback for undefined severity.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [eventTypesHandler],
    },
  },
  render: () => <EventTypesWrapper />,
};

/**
 * Event types with some pre-selected rows.
 */
export const WithSelection: Story = {
  parameters: {
    msw: {
      handlers: [eventTypesHandler],
    },
  },
  render: () => (
    <EventTypesWrapper
      preSelected={[
        {
          id: 'evt-1',
          applicationDisplayName: 'Advisor',
          eventTypeDisplayName: 'New recommendation',
          defaultSeverity: 'CRITICAL',
        },
      ]}
    />
  ),
};

/**
 * Empty state when no event types match filters.
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v2.0/notifications/eventTypes', () => {
          return HttpResponse.json({
            data: [],
            meta: { count: 0 },
            links: {},
          });
        }),
      ],
    },
  },
  render: () => <EventTypesWrapper />,
};
