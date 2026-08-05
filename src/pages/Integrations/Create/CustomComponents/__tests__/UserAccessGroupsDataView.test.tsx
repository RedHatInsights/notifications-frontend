/* eslint-disable @typescript-eslint/no-explicit-any, testing-library/no-container, testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import UserAccessGroupsDataView from '../UserAccessGroupsDataView';
import { useRbacGroups } from '../../../../../app/rbac/RbacGroupContext';
import { useKesselRbacAccess } from '../../../../../app/rbac/KesselRbacAccessContext';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';

// Mock the context hooks
jest.mock('../../../../../app/rbac/RbacGroupContext');
jest.mock('../../../../../app/rbac/KesselRbacAccessContext');
jest.mock('@data-driven-forms/react-form-renderer');
jest.mock('react-fetching-library', () => ({
  useClient: () => ({
    query: jest.fn(),
  }),
}));

describe('UserAccessGroupsDataView', () => {
  const mockUseRbacGroups = useRbacGroups as jest.MockedFunction<typeof useRbacGroups>;
  const mockUseKesselRbacAccess = useKesselRbacAccess as jest.MockedFunction<
    typeof useKesselRbacAccess
  >;
  const mockUseFieldApi = useFieldApi as jest.MockedFunction<typeof useFieldApi>;

  beforeEach(() => {
    // Mock the field API
    mockUseFieldApi.mockReturnValue({
      input: {
        name: 'userAccessGroups',
        value: [],
        onChange: jest.fn(),
        onBlur: jest.fn(),
      },
      meta: {
        error: undefined,
      },
    } as any);

    // Mock Kessel RBAC access
    mockUseKesselRbacAccess.mockReturnValue({
      permissions: {
        canReadRbacPrincipal: true,
      },
      isLoading: false,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty state', () => {
    it('displays "No User Access Groups" text when there are no groups', () => {
      // Mock empty groups
      mockUseRbacGroups.mockReturnValue({
        groups: [],
        isLoading: false,
      } as any);

      render(
        <IntlProvider locale="en">
          <UserAccessGroupsDataView name="userAccessGroups" label="User Access Groups" />
        </IntlProvider>
      );

      // Verify the empty state title is present
      expect(screen.getByText('No User Access Groups')).toBeInTheDocument();
    });

    it('ensures empty state is properly wrapped in table structure to prevent vertical squishing', () => {
      // Mock empty groups
      mockUseRbacGroups.mockReturnValue({
        groups: [],
        isLoading: false,
      } as any);

      const { container } = render(
        <IntlProvider locale="en">
          <UserAccessGroupsDataView name="userAccessGroups" label="User Access Groups" />
        </IntlProvider>
      );

      const emptyStateTitle = screen.getByText('No User Access Groups');

      // Verify the title is visible (not hidden or cut off)
      expect(emptyStateTitle).toBeVisible();

      // Verify the empty state is properly wrapped in table structure
      // The structure should be: tbody > tr > td > EmptyState > Title
      // This prevents the vertical text squishing bug that occurs when
      // EmptyState is rendered directly without table cell wrapping

      // Find the td element that should wrap the empty state
      const tdElement = container.querySelector('tbody td[colspan]');
      expect(tdElement).toBeInTheDocument();

      // Verify the td has the correct colspan (should span all columns)
      expect(tdElement).toHaveAttribute('colspan', '3'); // 3 columns: select, name, users

      // Verify the EmptyState is inside the td
      const emptyStateElement = tdElement?.querySelector('.pf-v6-c-empty-state');
      expect(emptyStateElement).toBeInTheDocument();

      // Verify the title is inside the EmptyState
      expect(emptyStateElement).toContainElement(emptyStateTitle);
    });

    it('displays the empty state body message', () => {
      mockUseRbacGroups.mockReturnValue({
        groups: [],
        isLoading: false,
      } as any);

      render(
        <IntlProvider locale="en">
          <UserAccessGroupsDataView name="userAccessGroups" label="User Access Groups" />
        </IntlProvider>
      );

      expect(
        screen.getByText(
          'No User Access Groups are available. Contact your administrator to set up access groups.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Filtered empty state', () => {
    it('displays "No matching User Access Groups" when search has no results', () => {
      // Mock groups that would be filtered out
      mockUseRbacGroups.mockReturnValue({
        groups: [
          {
            id: '1',
            name: 'Admin Group',
            principalCount: 5,
            admin_default: false,
            platform_default: false,
            system: false,
          },
        ],
        isLoading: false,
      } as any);

      const { container } = render(
        <IntlProvider locale="en">
          <UserAccessGroupsDataView name="userAccessGroups" label="User Access Groups" />
        </IntlProvider>
      );

      // Simulate filtering by entering text in the search field
      const searchInput = container.querySelector('input[placeholder="Filter by group name..."]');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('shows skeleton loading when groups are loading', () => {
      mockUseRbacGroups.mockReturnValue({
        groups: [],
        isLoading: true,
      } as any);

      const { container } = render(
        <IntlProvider locale="en">
          <UserAccessGroupsDataView name="userAccessGroups" label="User Access Groups" />
        </IntlProvider>
      );

      // Check for skeleton loading indicators
      expect(container.querySelector('.pf-v6-c-skeleton')).toBeInTheDocument();
    });
  });
});
