import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import { IntlProvider } from 'react-intl';
import { Client, ClientContextProvider } from 'react-fetching-library';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import UserAccessGroupsDataView from './UserAccessGroupsDataView';
import { RbacGroupContextProvider } from '../../../../app/rbac/RbacGroupContextProvider';
import { KesselRbacAccessProvider } from '../../../../app/rbac/KesselRbacAccessProvider';
import {
  kesselRbacGrantedHandlers,
  kesselRbacNoRbacHandlers,
} from '../../../../app/rbac/msw/kesselRbacStoryHandlers';
import { HttpResponse, http } from 'msw';
import messagesData from '../../../../../locales/data.json';

const messages = messagesData['en-US'];

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
    platform_default: true,
    admin_default: false,
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
];

const mockPrincipals = [
  { username: 'user1@example.com' },
  { username: 'user2@example.com' },
  { username: 'user3@example.com' },
];

// MSW handler for RBAC groups list
const rbacGroupsHandler = http.get('/api/rbac/v1/groups/', () => {
  return HttpResponse.json({
    meta: { count: mockGroups.length },
    data: mockGroups,
  });
});

// MSW handler for group principals
const rbacPrincipalsHandler = http.get('/api/rbac/v1/groups/:uuid/principals/', () => {
  return HttpResponse.json({
    meta: { count: mockPrincipals.length },
    data: mockPrincipals,
  });
});

// Mock client for react-fetching-library
const mockClient = {
  query: async () => ({
    error: false,
    status: 200,
    payload: null,
  }),
  suspenseCache: new Map(),
  cache: new Map(),
} as unknown as Client;

interface WrapperProps {
  initialValues?: Record<string, unknown>;
  children?: React.ReactNode;
}

const TestWrapper: React.FC<WrapperProps> = ({ initialValues = {}, children }) => {
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
    <AccessCheck.Provider baseUrl="http://localhost:8002" apiPath="/api/rbac/v2">
      <KesselRbacAccessProvider>
        <IntlProvider locale="en" messages={messages}>
          <ClientContextProvider client={mockClient}>
            <RbacGroupContextProvider>
              <FormRenderer
                schema={schema}
                componentMapper={customMapper}
                onSubmit={(values) => console.log('Form submitted:', values)}
                onCancel={() => console.log('Form cancelled')}
                initialValues={initialValues}
              />
              {children}
            </RbacGroupContextProvider>
          </ClientContextProvider>
        </IntlProvider>
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
};

const meta: Meta<typeof UserAccessGroupsDataView> = {
  title: 'Integrations/UserAccessGroupsDataView',
  component: UserAccessGroupsDataView,
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
type Story = StoryObj<typeof UserAccessGroupsDataView>;

/**
 * Default story with all permissions granted.
 * Users can view group details and select groups.
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [...kesselRbacGrantedHandlers, rbacGroupsHandler, rbacPrincipalsHandler],
    },
  },
  render: () => <TestWrapper />,
};

/**
 * Permission denied: User cannot read RBAC principals.
 * Shows static user count instead of "View" button.
 */
export const PermissionDenied: Story = {
  parameters: {
    msw: {
      handlers: [...kesselRbacNoRbacHandlers, rbacGroupsHandler, rbacPrincipalsHandler],
    },
  },
  render: () => <TestWrapper />,
};

/**
 * Story with groups pre-selected
 */
export const WithSelection: Story = {
  parameters: {
    msw: {
      handlers: [...kesselRbacGrantedHandlers, rbacGroupsHandler, rbacPrincipalsHandler],
    },
  },
  render: () => (
    <TestWrapper initialValues={{ 'user-access-groups': ['3', '4'] }}>
      {/* Pre-select Engineering Team and QE Team */}
    </TestWrapper>
  ),
};

/**
 * Empty state when no groups are available
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        ...kesselRbacGrantedHandlers,
        http.get('/api/rbac/v1/groups/', () => {
          return HttpResponse.json({
            meta: { count: 0 },
            data: [],
          });
        }),
      ],
    },
  },
  render: () => <TestWrapper />,
};
