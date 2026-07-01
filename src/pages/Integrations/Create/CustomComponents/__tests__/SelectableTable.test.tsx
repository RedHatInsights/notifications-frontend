import { render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../../test/TestUtils';

const mockOnChange = jest.fn();
const mockGetState = jest.fn();

jest.mock('@data-driven-forms/react-form-renderer/use-field-api', () => ({
  __esModule: true,
  default: () => ({
    input: {
      onChange: mockOnChange,
      value: {},
      name: 'event-types-table',
    },
    meta: {},
  }),
}));

jest.mock('@data-driven-forms/react-form-renderer/use-form-api', () => ({
  __esModule: true,
  default: () => ({
    getState: mockGetState,
  }),
}));

jest.mock('@data-driven-forms/react-form-renderer/form-spy', () => ({
  __esModule: true,
  default: ({ children }: { children: () => React.ReactNode }) => <>{children()}</>,
}));

const mockGetEndpoint = jest.fn();
jest.mock('../../../../../api/helpers/integrations/endpoints-helper', () => ({
  getEndpoint: (...args) => mockGetEndpoint(...args),
}));

const mockGetBundleFacets = jest.fn();
jest.mock('../../../../../api/helpers/notifications/bundle-facets-helper', () => ({
  getBundleFacets: (...args) => mockGetBundleFacets(...args),
}));

jest.mock('../../../../../components/Integrations/EventTypes', () => ({
  __esModule: true,
  default: () => <div data-testid="event-types-component">EventTypes</div>,
}));

import SelectableTable from '../SelectableTable';

describe('SelectableTable', () => {
  const defaultProps = {
    name: 'event-types-table',
    bundleFieldName: 'product-family',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBundleFacets.mockResolvedValue([]);
  });

  it('shows empty state when no bundle is selected', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': undefined },
    });

    render(<SelectableTable {...defaultProps} />);
    await waitForAsyncEvents();

    expect(screen.getByText('Select product family')).toBeVisible();
    expect(mockGetEndpoint).not.toHaveBeenCalled();
  });

  it('does not call getEndpoint when creating a new integration', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': 'openshift' },
    });

    render(<SelectableTable {...defaultProps} />);
    await waitForAsyncEvents();

    expect(mockGetEndpoint).not.toHaveBeenCalled();
  });

  it('calls getEndpoint exactly once when editing an integration', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': 'openshift', id: 'integration-123' },
    });

    mockGetBundleFacets.mockResolvedValue([
      { name: 'openshift', displayName: 'OpenShift', children: [] },
    ]);

    mockGetEndpoint.mockResolvedValue({
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
              ],
            },
          ],
        },
      ],
    });

    render(<SelectableTable {...defaultProps} />);
    await waitFor(() => {
      expect(mockGetEndpoint).toHaveBeenCalledTimes(1);
    });

    expect(mockGetEndpoint).toHaveBeenCalledWith('integration-123');

    await waitForAsyncEvents();
    expect(mockGetEndpoint).toHaveBeenCalledTimes(1);
  });

  it('maps fetched event types to form input on edit', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': 'openshift', id: 'integration-456' },
    });

    mockGetBundleFacets.mockResolvedValue([
      { name: 'openshift', displayName: 'OpenShift', children: [] },
    ]);

    mockGetEndpoint.mockResolvedValue({
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
              ],
            },
          ],
        },
      ],
    });

    render(<SelectableTable {...defaultProps} />);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });

    const onChangeArg = mockOnChange.mock.calls[0][0];
    expect(onChangeArg).toHaveProperty('OpenShift');
    expect(onChangeArg.OpenShift).toHaveProperty('evt-1');
    expect(onChangeArg.OpenShift['evt-1']).toEqual(
      expect.objectContaining({
        id: 'evt-1',
        eventTypeDisplayName: 'New cluster',
        applicationDisplayName: 'Cluster Manager',
        description: 'A new cluster was created',
        isSelected: true,
      })
    );
  });

  it('sets BUNDLE_DEFAULTS when endpoint has no event groups', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': 'openshift', id: 'integration-789' },
    });

    mockGetBundleFacets.mockResolvedValue([
      { name: 'openshift', displayName: 'OpenShift', children: [] },
    ]);

    mockGetEndpoint.mockResolvedValue({
      event_types_group_by_bundles_and_applications: undefined,
    });

    render(<SelectableTable {...defaultProps} />);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      OpenShift: {},
      'Red Hat Enterprise Linux': {},
      Console: {},
    });
  });

  it('renders EventTypes component when bundle is loaded in edit mode', async () => {
    mockGetState.mockReturnValue({
      values: { 'product-family': 'openshift', id: 'integration-123' },
    });

    mockGetBundleFacets.mockResolvedValue([
      { name: 'openshift', displayName: 'OpenShift', children: [] },
    ]);

    mockGetEndpoint.mockResolvedValue({
      event_types_group_by_bundles_and_applications: [],
    });

    render(<SelectableTable {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('event-types-component')).toBeVisible();
    });
  });
});
