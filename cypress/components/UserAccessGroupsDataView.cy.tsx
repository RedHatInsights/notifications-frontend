import React from 'react';
import UserAccessGroupsDataView from '../../src/pages/Integrations/Create/CustomComponents/UserAccessGroupsDataView';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { IntlProvider } from 'react-intl';
import { RbacGroupContextProvider } from '../../src/app/rbac/RbacGroupContextProvider';
import { ClientContextProvider } from 'react-fetching-library';
import messages from '../../locales/data.json';

const mockGroups = [
  {
    uuid: '1',
    name: 'Admin Group',
    description: 'Admin default group',
    principalCount: 5,
    admin_default: true,
    platform_default: false,
    system: false,
  },
  {
    uuid: '2',
    name: 'Platform Default',
    description: 'Platform default group',
    principalCount: 100,
    admin_default: false,
    platform_default: true,
    system: false,
  },
  {
    uuid: '3',
    name: 'Engineering Team',
    description: 'Engineering team group',
    principalCount: 15,
    admin_default: false,
    platform_default: false,
    system: false,
  },
  {
    uuid: '4',
    name: 'QE Team',
    description: 'QE team group',
    principalCount: 8,
    admin_default: false,
    platform_default: false,
    system: false,
  },
  {
    uuid: '5',
    name: 'DevOps Team',
    description: 'DevOps team group',
    principalCount: 12,
    admin_default: false,
    platform_default: false,
    system: false,
  },
];

const mockPrincipals = [
  { username: 'user1@example.com' },
  { username: 'user2@example.com' },
  { username: 'user3@example.com' },
];

const TestWrapper = ({
  initialValues = {},
}: {
  initialValues?: Record<string, unknown>;
}) => {
  const mockClient = {
    query: async (action: any) => {
      // Mock GetPrincipalsFromGroup API call
      if (action.endpoint.includes('/groups/')) {
        return {
          payload: {
            type: 'PrincipalPagination',
            value: {
              data: mockPrincipals,
            },
          },
        };
      }
      return { payload: null };
    },
  };

  const schema = {
    fields: [
      {
        component: 'custom-component',
        name: 'user-access-groups',
        label: 'User Access Groups',
        isRequired: true,
      },
    ],
  };

  const customMapper = {
    ...componentMapper,
    'custom-component': UserAccessGroupsDataView,
  };

  return (
    <IntlProvider locale="en" messages={messages}>
      <ClientContextProvider client={mockClient as any}>
        <RbacGroupContextProvider groups={mockGroups} isLoading={false}>
          <FormRenderer
            schema={schema}
            componentMapper={customMapper}
            onSubmit={(values) => console.log('Form submitted:', values)}
            onCancel={() => console.log('Form cancelled')}
            initialValues={initialValues}
          />
        </RbacGroupContextProvider>
      </ClientContextProvider>
    </IntlProvider>
  );
};

describe('UserAccessGroupsDataView', () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
  });

  it('should render the user access groups table', () => {
    cy.mount(<TestWrapper />);
    cy.contains('User Access Groups').should('be.visible');
    cy.contains('Admin Group').should('be.visible');
    cy.contains('Engineering Team').should('be.visible');
  });

  it('should select a user group and show it in the label group', () => {
    cy.mount(<TestWrapper />);

    // Check that no labels are shown initially
    cy.get('.pf-v6-c-label-group').should('not.exist');

    // Select the Engineering Team checkbox
    cy.get('input[id="group-3"]').check();

    // Verify the label group appears with the selected group
    cy.get('.pf-v6-c-label-group').should('be.visible');
    cy.get('.pf-v6-c-label').contains('Engineering Team').should('be.visible');
  });

  it('should select multiple user groups', () => {
    cy.mount(<TestWrapper />);

    // Select multiple groups
    cy.get('input[id="group-3"]').check(); // Engineering Team
    cy.get('input[id="group-4"]').check(); // QE Team
    cy.get('input[id="group-5"]').check(); // DevOps Team

    // Verify all three labels appear
    cy.get('.pf-v6-c-label').should('have.length', 3);
    cy.get('.pf-v6-c-label').contains('Engineering Team').should('be.visible');
    cy.get('.pf-v6-c-label').contains('QE Team').should('be.visible');
    cy.get('.pf-v6-c-label').contains('DevOps Team').should('be.visible');
  });

  it('should remove a single group using the x button', () => {
    cy.mount(<TestWrapper />);

    // Select two groups
    cy.get('input[id="group-3"]').check();
    cy.get('input[id="group-4"]').check();

    // Verify both labels are present
    cy.get('.pf-v6-c-label').should('have.length', 2);

    // Click the X button on the first label (Engineering Team)
    cy.get('.pf-v6-c-label')
      .contains('Engineering Team')
      .parent()
      .find('button')
      .click();

    // Verify only one label remains
    cy.get('.pf-v6-c-label').should('have.length', 1);
    cy.get('.pf-v6-c-label').contains('QE Team').should('be.visible');
    cy.get('.pf-v6-c-label').contains('Engineering Team').should('not.exist');

    // Verify the checkbox is unchecked
    cy.get('input[id="group-3"]').should('not.be.checked');
    cy.get('input[id="group-4"]').should('be.checked');
  });

  it('should clear all selections by clicking on the label group', () => {
    cy.mount(<TestWrapper />);

    // Select multiple groups
    cy.get('input[id="group-3"]').check();
    cy.get('input[id="group-4"]').check();
    cy.get('input[id="group-5"]').check();

    // Verify labels are present
    cy.get('.pf-v6-c-label').should('have.length', 3);

    // Click on the label group's category name to clear all
    cy.get('.pf-v6-c-label-group__label').click();

    // Verify all labels are removed
    cy.get('.pf-v6-c-label-group').should('not.exist');
    cy.get('.pf-v6-c-label').should('not.exist');

    // Verify all checkboxes are unchecked
    cy.get('input[id="group-3"]').should('not.be.checked');
    cy.get('input[id="group-4"]').should('not.be.checked');
    cy.get('input[id="group-5"]').should('not.be.checked');
  });

  it('should filter groups by name', () => {
    cy.mount(<TestWrapper />);

    // Initially all groups should be visible
    cy.contains('Engineering Team').should('be.visible');
    cy.contains('QE Team').should('be.visible');
    cy.contains('DevOps Team').should('be.visible');

    // Type in the filter input
    cy.get('input[placeholder*="Filter by group name"]').type('Engineering');

    // Only Engineering Team should be visible
    cy.contains('Engineering Team').should('be.visible');
    cy.contains('QE Team').should('not.exist');
    cy.contains('DevOps Team').should('not.exist');

    // Clear the filter
    cy.get('button[aria-label*="Clear"]').click();

    // All groups should be visible again
    cy.contains('Engineering Team').should('be.visible');
    cy.contains('QE Team').should('be.visible');
    cy.contains('DevOps Team').should('be.visible');
  });

  it('should open drawer and display users when clicking view users', () => {
    cy.mount(<TestWrapper />);

    // Find and click the "View users" button for Engineering Team
    cy.contains('View users')
      .filter(':contains("15")')
      .first()
      .click({ force: true });

    // Verify drawer opens with the group name
    cy.get('.pf-v6-c-drawer__panel').should('be.visible');
    cy.get('.pf-v6-c-drawer__panel').contains('Engineering Team');

    // Verify users are displayed
    cy.contains('user1@example.com').should('be.visible');
    cy.contains('user2@example.com').should('be.visible');
    cy.contains('user3@example.com').should('be.visible');

    // Close the drawer
    cy.get('.pf-v6-c-drawer__close button').click();

    // Verify drawer is closed
    cy.get('.pf-v6-c-drawer__panel').should('not.be.visible');
  });

  it('should display special text for admin and platform default groups', () => {
    cy.mount(<TestWrapper />);

    // Admin default group should show "All org admins"
    cy.contains('Admin Group')
      .parent()
      .parent()
      .should('contain', 'All org admins');

    // Platform default group should show "All users"
    cy.contains('Platform Default')
      .parent()
      .parent()
      .should('contain', 'All users');
  });

  it('should persist selections when initializing with values', () => {
    cy.mount(
      <TestWrapper
        initialValues={{
          'user-access-groups': ['3', '4'],
        }}
      />
    );

    // Verify checkboxes are checked
    cy.get('input[id="group-3"]').should('be.checked');
    cy.get('input[id="group-4"]').should('be.checked');

    // Verify labels are displayed
    cy.get('.pf-v6-c-label').should('have.length', 2);
    cy.get('.pf-v6-c-label').contains('Engineering Team').should('be.visible');
    cy.get('.pf-v6-c-label').contains('QE Team').should('be.visible');
  });

  it('should handle pagination', () => {
    cy.mount(<TestWrapper />);

    // Check that pagination controls exist
    cy.get('.pf-v6-c-pagination').should('exist');

    // Verify current page shows groups
    cy.contains('Engineering Team').should('be.visible');

    // Note: With only 5 items and default page size of 10,
    // all items should be on the first page
    cy.get('.pf-v6-c-pagination__nav-page-select')
      .should('be.visible')
      .should('contain', '1 - 5');
  });

  it('should show validation error when no groups are selected', () => {
    cy.mount(<TestWrapper />);

    // Select a group
    cy.get('input[id="group-3"]').check();

    // Clear it by clicking on the label group
    cy.get('.pf-v6-c-label-group__label').click();

    // Trigger validation by attempting to interact with the form
    // The field should show an error message
    cy.get('.pf-v6-c-form__helper-text.pf-m-error').should('exist');
  });

  it('should show info alert when platform default group is selected', () => {
    cy.mount(<TestWrapper />);

    // Select platform default group (ID: 2)
    cy.get('input[id="group-2"]').check();

    // Verify the info alert appears
    cy.get('.pf-v6-c-alert.pf-m-info').should('be.visible');
    cy.contains('Platform default group selected').should('be.visible');
    cy.contains(
      'The platform default group includes all users in your organization'
    ).should('be.visible');
    cy.contains('Additional group selections are not necessary').should(
      'be.visible'
    );
  });

  it('should hide info alert when platform default group is deselected', () => {
    cy.mount(<TestWrapper />);

    // Select platform default group
    cy.get('input[id="group-2"]').check();

    // Verify alert is visible
    cy.get('.pf-v6-c-alert.pf-m-info').should('be.visible');

    // Deselect platform default group
    cy.get('input[id="group-2"]').uncheck();

    // Verify alert is hidden
    cy.get('.pf-v6-c-alert.pf-m-info').should('not.exist');
  });

  it('should show info alert when platform default is selected with other groups', () => {
    cy.mount(<TestWrapper />);

    // Select multiple groups including platform default
    cy.get('input[id="group-2"]').check(); // Platform default
    cy.get('input[id="group-3"]').check(); // Engineering Team

    // Verify alert is visible
    cy.get('.pf-v6-c-alert.pf-m-info').should('be.visible');

    // Verify both labels are shown
    cy.get('.pf-v6-c-label').should('have.length', 2);
  });
});
