import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { HttpResponse, http } from 'msw';
import { expect, fn, waitFor, within } from 'storybook/test';
import SelectableTable from './SelectableTable';

const mockBundleFacets = [
  {
    id: 'bundle-openshift',
    name: 'openshift',
    displayName: 'OpenShift',
    children: [{ id: 'app-1', displayName: 'Cluster Manager', name: 'cluster-manager' }],
  },
  {
    id: 'bundle-rhel',
    name: 'rhel',
    displayName: 'Red Hat Enterprise Linux',
    children: [{ id: 'app-2', displayName: 'Advisor', name: 'advisor' }],
  },
  {
    id: 'bundle-console',
    name: 'console',
    displayName: 'Console',
    children: [],
  },
];

const mockEndpointWithEventTypes = {
  id: 'integration-123',
  name: 'Test Integration',
  type: 'webhook',
  enabled: true,
  event_types_group_by_bundles_and_applications: [
    {
      display_name: 'OpenShift',
      applications: [
        {
          display_name: 'Cluster Manager',
          event_types: [
            {
              id: 'evt-1',
              display_name: 'New cluster',
              description: 'A new cluster was created',
            },
            {
              id: 'evt-2',
              display_name: 'Cluster deleted',
              description: 'A cluster was removed',
            },
          ],
        },
      ],
    },
  ],
};

const mockEndpointNoEventTypes = {
  id: 'integration-789',
  name: 'Empty Integration',
  type: 'webhook',
  enabled: true,
  event_types_group_by_bundles_and_applications: undefined,
};

const bundleFacetsHandler = http.get('*/api/notifications/v1/notifications/facets/bundles*', () =>
  HttpResponse.json(mockBundleFacets)
);

const endpointNoEventsHandler = http.get('*/api/integrations/v2/endpoints/:id', () =>
  HttpResponse.json(mockEndpointNoEventTypes)
);

const mockEventTypesData = [
  {
    id: 'evt-1',
    application_id: 'app-1',
    application: {
      id: 'app-1',
      display_name: 'Cluster Manager',
      name: 'cluster-manager',
      bundle_id: 'bundle-openshift',
    },
    display_name: 'New cluster',
    name: 'new-cluster',
    description: 'A new cluster was created',
  },
  {
    id: 'evt-2',
    application_id: 'app-1',
    application: {
      id: 'app-1',
      display_name: 'Cluster Manager',
      name: 'cluster-manager',
      bundle_id: 'bundle-openshift',
    },
    display_name: 'Cluster deleted',
    name: 'cluster-deleted',
    description: 'A cluster was removed',
  },
];

const eventTypesHandler = http.get('*/api/notifications/v2/notifications/eventTypes', () =>
  HttpResponse.json({
    data: mockEventTypesData,
    meta: { count: mockEventTypesData.length },
    links: {},
  })
);

const customMapper = {
  ...componentMapper,
  'selectable-table': SelectableTable,
};

interface TestWrapperProps {
  initialValues?: Record<string, unknown>;
}

const schema = {
  fields: [
    {
      component: 'selectable-table',
      name: 'event-types-table',
      bundleFieldName: 'product-family',
    },
  ],
};

const TestWrapper: React.FC<TestWrapperProps> = ({ initialValues = {} }) => (
  <FormRenderer
    schema={schema}
    componentMapper={customMapper}
    onSubmit={() => {}}
    onCancel={() => {}}
    initialValues={initialValues}
  >
    {(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
  </FormRenderer>
);

const meta: Meta<typeof SelectableTable> = {
  title: 'Integrations/SelectableTable',
  component: SelectableTable,
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
type Story = StoryObj<typeof SelectableTable>;

const getEndpointSpy = fn();

const endpointWithEventsSpy = http.get('*/api/integrations/v2/endpoints/:id', ({ params }) => {
  getEndpointSpy(params.id);
  return HttpResponse.json(mockEndpointWithEventTypes);
});

export const NoBundleSelected: Story = {
  parameters: {
    msw: {
      handlers: [bundleFacetsHandler, eventTypesHandler],
    },
  },
  render: () => {
    getEndpointSpy.mockClear();
    return <TestWrapper />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Select product family')).toBeVisible());
    expect(getEndpointSpy).not.toHaveBeenCalled();
  },
};

export const EditWithEventTypes: Story = {
  parameters: {
    msw: {
      handlers: [bundleFacetsHandler, endpointWithEventsSpy, eventTypesHandler],
    },
  },
  render: () => {
    getEndpointSpy.mockClear();
    return (
      <TestWrapper
        initialValues={{
          'product-family': 'openshift',
          id: 'integration-123',
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByText('Associate event types')).toBeVisible();
      },
      { timeout: 5000 }
    );
    await waitFor(() => {
      expect(getEndpointSpy).toHaveBeenCalledTimes(1);
    });
    expect(getEndpointSpy).toHaveBeenCalledWith('integration-123');
    await waitFor(() => {
      const selected = canvas.getAllByLabelText('Selectable row - selected');
      expect(selected).toHaveLength(2);
    });
  },
};

export const EditWithNoEventGroups: Story = {
  parameters: {
    msw: {
      handlers: [bundleFacetsHandler, endpointNoEventsHandler, eventTypesHandler],
    },
  },
  render: () => (
    <TestWrapper
      initialValues={{
        'product-family': 'openshift',
        id: 'integration-789',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByText('New cluster')).toBeVisible();
      },
      { timeout: 5000 }
    );
    expect(canvas.queryByLabelText('Selectable row - selected')).not.toBeInTheDocument();
    expect(canvas.getAllByLabelText('Selectable row - not selected').length).toBeGreaterThanOrEqual(
      1
    );
  },
};

export const WithoutIntegrationIdSkipsEndpointFetch: Story = {
  parameters: {
    msw: {
      handlers: [bundleFacetsHandler, eventTypesHandler],
    },
  },
  render: () => {
    getEndpointSpy.mockClear();
    return (
      <TestWrapper
        initialValues={{
          'product-family': 'openshift',
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => {
        expect(canvas.getByText('Associate event types')).toBeVisible();
      },
      { timeout: 5000 }
    );
    expect(getEndpointSpy).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(canvas.getByText('New cluster')).toBeVisible();
    });
  },
};
