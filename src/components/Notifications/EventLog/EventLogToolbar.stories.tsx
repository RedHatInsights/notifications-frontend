import React, { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { EventPeriod, EventSeverity, NotificationEvent } from '../../../types/Event';
import { IntegrationType } from '../../../types/Integration';
import { Facet } from '../../../types/Notification';
import { arrayValue } from '../../../utils/insights-common-typescript';
import { EventLogDateFilterValue } from './EventLogDateFilter';
import { EventLogFilters } from './EventLogFilter';
import { EventLogTable, EventLogTableColumns, SortDirection } from './EventLogTable';
import { EventLogToolbar } from './EventLogToolbar';

const mockBundleOptions: Facet[] = [
  {
    id: 'bundle-1',
    displayName: 'Red Hat Enterprise Linux',
    name: 'rhel',
    children: [
      { id: 'app-1', displayName: 'Advisor', name: 'advisor' },
      { id: 'app-2', displayName: 'Compliance', name: 'compliance' },
      { id: 'app-3', displayName: 'Drift', name: 'drift' },
    ],
  },
  {
    id: 'bundle-2',
    displayName: 'OpenShift',
    name: 'openshift',
    children: [{ id: 'app-os', displayName: 'OpenShift', name: 'openshift' }],
  },
  {
    id: 'bundle-3',
    displayName: 'Ansible Automation Platform',
    name: 'ansible',
    children: [],
  },
];

const mockSeverities: EventSeverity[] = [
  'CRITICAL',
  'IMPORTANT',
  'MODERATE',
  'LOW',
  'NONE',
  'UNDEFINED',
];

const severitiesHandler = http.get('*/api/notifications/v1.0/notifications/severities', () => {
  return HttpResponse.json(mockSeverities);
});

const bundlesHandler = http.get('*/api/notifications/v1.0/notifications/facets/bundles', () => {
  return HttpResponse.json(mockBundleOptions);
});

const mockEvents: NotificationEvent[] = [
  {
    id: 'evt-1',
    event: 'New recommendation',
    application: 'advisor',
    bundle: 'rhel',
    date: new Date('2024-06-01T12:00:00Z'),
    severity: 'CRITICAL',
    actions: [
      {
        id: 'a1',
        endpointType: IntegrationType.DRAWER,
        status: { last: 'SUCCESS', isDegraded: false },
        successCount: 1,
        errorCount: 0,
      },
    ],
  },
  {
    id: 'evt-2',
    event: 'Policy updated',
    application: 'compliance',
    bundle: 'rhel',
    date: new Date('2024-06-02T09:30:00Z'),
    severity: 'IMPORTANT',
    actions: [
      {
        id: 'a2',
        endpointType: IntegrationType.SLACK,
        status: { last: 'SENT', isDegraded: false },
        successCount: 1,
        errorCount: 0,
      },
    ],
  },
  {
    id: 'evt-3',
    event: 'Baseline drift detected',
    application: 'drift',
    bundle: 'rhel',
    date: new Date('2024-06-03T16:00:00Z'),
    severity: 'MODERATE',
    actions: [
      {
        id: 'a3',
        endpointType: IntegrationType.WEBHOOK,
        status: { last: 'FAILED', isDegraded: false },
        successCount: 0,
        errorCount: 1,
      },
    ],
  },
  {
    id: 'evt-4',
    event: 'Informative note',
    application: 'advisor',
    bundle: 'rhel',
    date: new Date('2024-06-04T11:15:00Z'),
    severity: 'LOW',
    actions: [],
  },
  {
    id: 'evt-5',
    event: 'Debug ping',
    application: 'drift',
    bundle: 'rhel',
    date: new Date('2024-06-05T08:00:00Z'),
    severity: 'NONE',
    actions: [],
  },
  {
    id: 'evt-6',
    event: 'Legacy event (no severity)',
    application: 'advisor',
    bundle: 'rhel',
    date: new Date('2024-06-06T10:00:00Z'),
    severity: undefined,
    actions: [],
  },
  {
    id: 'evt-os-1',
    event: 'Cluster upgrade available',
    application: 'openshift',
    bundle: 'openshift',
    date: new Date('2024-06-07T10:00:00Z'),
    severity: 'LOW',
    actions: [
      {
        id: 'a-os',
        endpointType: IntegrationType.PAGERDUTY,
        status: { last: 'UNKNOWN', isDegraded: false },
        successCount: 0,
        errorCount: 0,
      },
    ],
  },
];

function effectiveSeverity(severity: NotificationEvent['severity']): EventSeverity {
  return severity ?? 'UNDEFINED';
}

function filterMockEvents(
  filters: EventLogFilters,
  events: NotificationEvent[]
): NotificationEvent[] {
  const severitySelected = arrayValue(filters.severities);
  const bundleSelected = arrayValue(filters.bundle);
  const serviceSelected = arrayValue(filters.service);
  const endpointTypesSelected = arrayValue(filters.endpointTypes).map((s) => s.toUpperCase());
  const statusSelected = arrayValue(filters.status);
  const eventText = typeof filters.event === 'string' ? filters.event.trim().toLowerCase() : '';

  return events.filter((e) => {
    if (severitySelected.length > 0 && !severitySelected.includes(effectiveSeverity(e.severity))) {
      return false;
    }
    if (bundleSelected.length > 0 && !bundleSelected.includes(e.bundle)) {
      return false;
    }
    if (serviceSelected.length > 0) {
      const matchesService = serviceSelected.some((token) => {
        const [bundleName, appName] = token.split('.');
        return e.bundle === bundleName && e.application === appName;
      });
      if (!matchesService) {
        return false;
      }
    }
    if (endpointTypesSelected.length > 0) {
      const matchesType = e.actions.some((a) =>
        endpointTypesSelected.includes(a.endpointType.toUpperCase())
      );
      if (!matchesType) {
        return false;
      }
    }
    if (statusSelected.length > 0) {
      const matchesStatus = e.actions.some((a) => statusSelected.includes(a.status.last));
      if (!matchesStatus) {
        return false;
      }
    }
    if (eventText && !e.event.toLowerCase().includes(eventText)) {
      return false;
    }
    return true;
  });
}

function rowsOnCurrentPage(count: number, page: number, perPage: number): number {
  if (count <= 0) {
    return 0;
  }
  const start = (page - 1) * perPage;
  return Math.max(0, Math.min(perPage, count - start));
}

async function openConditionalFilterTypeMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByRole('button', { name: 'Conditional filter toggle' }));
}

async function selectConditionalFilterType(canvasElement: HTMLElement, label: string) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  await openConditionalFilterTypeMenu(canvasElement);
  // PF v6: ConditionalFilter uses DropdownItem → MenuItem (role="menuitem"), not role="button".
  try {
    await userEvent.click(
      await canvas.findByRole(
        'menuitem',
        {
          name: label,
        },
        { timeout: 1500 }
      )
    );
  } catch {
    await userEvent.click(
      await page.findByRole('menuitem', {
        name: label,
      })
    );
  }
}

/** Checkbox filters in toolbar column order (see `EventLogToolbar` metadata); used when mobile layout shows several "Options menu" toggles. */
type CheckboxToolbarFilter = 'Action Type' | 'Action Status' | 'Severity';

const CHECKBOX_FILTER_OPTIONS_MENU_INDEX: Record<CheckboxToolbarFilter, number> = {
  'Action Type': 0,
  'Action Status': 1,
  Severity: 2,
};

/**
 * Opens the value multi-select for the given checkbox-style filter.
 * On desktop only one "Options menu" exists; on narrow viewports ConditionalFilter renders every filter and there are several — pick by column order.
 */
async function openFilterValueOptionsMenu(
  canvasElement: HTMLElement,
  activeCheckboxFilter: CheckboxToolbarFilter
) {
  const canvas = within(canvasElement);
  await waitFor(() => {
    expect(canvas.queryAllByRole('button', { name: /^options menu$/i }).length).toBeGreaterThan(0);
  });
  const toggles = canvas.getAllByRole('button', { name: /^options menu$/i });
  const index = toggles.length === 1 ? 0 : CHECKBOX_FILTER_OPTIONS_MENU_INDEX[activeCheckboxFilter];
  await userEvent.click(toggles[index]);
}

/** CheckboxFilter uses PF SelectOption `hasCheckbox`; clicking the checkbox is more reliable than the outer `menuitem`. */
async function selectFilterValueOption(canvasElement: HTMLElement, name: RegExp) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  try {
    await userEvent.click(await canvas.findByRole('checkbox', { name }, { timeout: 1500 }));
  } catch {
    try {
      await userEvent.click(await page.findByRole('checkbox', { name }, { timeout: 8000 }));
    } catch {
      await userEvent.click(await page.findByRole('menuitem', { name }, { timeout: 8000 }));
    }
  }
}

interface ToolbarWithEventsProps {
  initialFilters?: Partial<EventLogFilters>;
  perPage?: number;
  retentionDays?: number;
}

const ToolbarWithEvents: React.FC<ToolbarWithEventsProps> = ({
  initialFilters = {},
  perPage = 20,
  retentionDays = 90,
}) => {
  const [filters, setFilters] = useState<EventLogFilters>({
    event: initialFilters.event,
    bundle: initialFilters.bundle,
    service: initialFilters.service,
    endpointTypes: initialFilters.endpointTypes,
    status: initialFilters.status,
    severities: initialFilters.severities,
  });

  const [dateFilter, setDateFilter] = useState<EventLogDateFilterValue>(
    EventLogDateFilterValue.LAST_14
  );

  const [period, setPeriod] = useState<EventPeriod>([undefined, undefined]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPerPage, setCurrentPerPage] = useState(perPage);
  const [sortColumn, setSortColumn] = useState(EventLogTableColumns.DATE);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const setFiltersObj = React.useMemo(() => {
    const createSetter = (key: string) => (value: unknown) => {
      setFilters((prev) => {
        const prevValue = prev[key as keyof EventLogFilters];
        const newValue = typeof value === 'function' ? value(prevValue) : value;
        if (JSON.stringify(newValue) === JSON.stringify(prevValue)) {
          return prev;
        }
        return { ...prev, [key]: newValue };
      });
    };

    return {
      event: createSetter('event'),
      bundle: createSetter('bundle'),
      service: createSetter('service'),
      endpointTypes: createSetter('endpointTypes'),
      status: createSetter('status'),
      severities: createSetter('severities'),
    };
  }, []);

  const clearFilter = (columns: Partial<EventLogFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev };
      Object.keys(columns).forEach((key) => {
        updated[key as keyof EventLogFilters] = undefined;
      });
      return updated;
    });
  };

  const filtered = useMemo(() => filterMockEvents(filters, mockEvents), [filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortColumn === EventLogTableColumns.DATE) {
      copy.sort((a, b) =>
        sortDirection === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime()
      );
    }
    return copy;
  }, [filtered, sortColumn, sortDirection]);

  const pageCount = rowsOnCurrentPage(sorted.length, currentPage, currentPerPage);
  const pageStart = (currentPage - 1) * currentPerPage;
  const pageEvents = sorted.slice(pageStart, pageStart + currentPerPage);

  const onSort = useCallback((column: EventLogTableColumns, direction: SortDirection) => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  const getIntegrationRecipient = useCallback(async () => 'Mock integration', []);

  return (
    <EventLogToolbar
      filters={filters}
      setFilters={setFiltersObj as never}
      clearFilter={clearFilter as never}
      bundleOptions={mockBundleOptions}
      pageCount={pageCount}
      count={sorted.length}
      page={currentPage}
      perPage={currentPerPage}
      pageChanged={setCurrentPage}
      perPageChanged={setCurrentPerPage}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      retentionDays={retentionDays}
      period={period}
      setPeriod={setPeriod}
    >
      <EventLogTable
        events={pageEvents}
        loading={false}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        getIntegrationRecipient={getIntegrationRecipient}
        showSeverity={false}
      />
    </EventLogToolbar>
  );
};

const meta: Meta<typeof EventLogToolbar> = {
  title: 'Notifications/EventLog/EventLogToolbar',
  component: EventLogToolbar,
  parameters: {
    layout: 'fullwidth',
    msw: {
      handlers: [severitiesHandler, bundlesHandler],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventLogToolbar>;

/** Toolbar + table with mock data; no filter changes (initial “Event” filter only). */
export const Default: Story = {
  render: () => <ToolbarWithEvents />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await waitFor(() => expect(canvas.getByText('New recommendation')).toBeVisible());
    expect(canvas.getByText('Policy updated')).toBeVisible();
  },
};

/** Severity filter (e.g. from URL): CRITICAL + IMPORTANT; table and chips match mock filter logic. */
export const WithSeverityFilter: Story = {
  render: () => (
    <ToolbarWithEvents
      initialFilters={{
        severities: ['CRITICAL', 'IMPORTANT'],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await waitFor(() => expect(canvas.getByText('New recommendation')).toBeVisible());
    expect(canvas.getByText('Policy updated')).toBeVisible();
    expect(canvas.queryByText('Baseline drift detected')).not.toBeInTheDocument();
  },
};

/** Event (text): type a substring; table narrows to matching event titles. */
export const EventTextFilter: Story = {
  render: () => <ToolbarWithEvents />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByPlaceholderText('Filter by event');
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'policy', { delay: 10 });
    await waitFor(() => expect(canvas.getByText('Policy updated')).toBeVisible());
    expect(canvas.queryByText('New recommendation')).not.toBeInTheDocument();
  },
};

/** Action status: Failure → only events with a FAILED action. */
export const ActionStatusFilter: Story = {
  render: () => <ToolbarWithEvents />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await selectConditionalFilterType(canvasElement, 'Action Status');
    await canvas.findByText('Filter by action status');
    await openFilterValueOptionsMenu(canvasElement, 'Action Status');
    await selectFilterValueOption(canvasElement, /failure/i);
    await waitFor(() => expect(canvas.getByText('Baseline drift detected')).toBeVisible());
    expect(canvas.queryByText('New recommendation')).not.toBeInTheDocument();
    expect(canvas.queryByText('Policy updated')).not.toBeInTheDocument();
  },
};

/** Action type: Slack integration → only events with a Slack action. */
export const ActionTypeFilter: Story = {
  render: () => <ToolbarWithEvents />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await selectConditionalFilterType(canvasElement, 'Action Type');
    await canvas.findByText('Filter by action type');
    await openFilterValueOptionsMenu(canvasElement, 'Action Type');
    await selectFilterValueOption(canvasElement, /slack/i);
    await waitFor(() => expect(canvas.getByText('Policy updated')).toBeVisible());
    expect(canvas.queryByText('New recommendation')).not.toBeInTheDocument();
  },
};

/** Bundle chip (e.g. from tree “select all” for one bundle): only that bundle’s events. */
export const WithBundleFilter: Story = {
  render: () => (
    <ToolbarWithEvents
      initialFilters={{
        bundle: ['openshift'],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await waitFor(() => expect(canvas.getByText('Cluster upgrade available')).toBeVisible());
    expect(canvas.queryByText('New recommendation')).not.toBeInTheDocument();
  },
};

/** Service / application (`bundle.application`): only matching app rows. */
export const WithServiceFilter: Story = {
  render: () => (
    <ToolbarWithEvents
      initialFilters={{
        service: ['rhel.compliance'],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByPlaceholderText('Filter by event');
    await waitFor(() => expect(canvas.getByText('Policy updated')).toBeVisible());
    expect(canvas.queryByText('New recommendation')).not.toBeInTheDocument();
  },
};
