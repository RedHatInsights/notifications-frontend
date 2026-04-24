import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, within } from 'storybook/test';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import Review from './Review';
import { IntegrationCategory, IntegrationType } from '../../../types/Integration';
import {
  EMAIL_DETAILS,
  EVENT_TYPES_TABLE,
  GOOGLE_CHAT_DETAILS,
  INTEGRATION_TYPE,
  PAGERDUTY_DETAILS,
  REVIEW,
  SERVICE_NOW_DETAILS,
  SLACK_DETAILS,
  SPLUNK_DETAILS,
  TEAMS_DETAILS,
} from './helpers';
import { RbacGroup, RbacGroupContext } from '../../../app/rbac/RbacGroupContext';

// Mock RBAC groups
const mockRbacGroups: RbacGroup[] = [
  {
    id: 'group-1',
    name: 'Engineering Team',
    principalCount: 25,
    admin_default: false,
    platform_default: false,
    system: false,
  },
  {
    id: 'group-2',
    name: 'QA Team',
    principalCount: 10,
    admin_default: false,
    platform_default: false,
    system: false,
  },
  {
    id: 'group-3',
    name: 'Platform Admins',
    principalCount: 5,
    admin_default: true,
    platform_default: false,
    system: false,
  },
];

// Mock event types data
const mockEventTypes = {
  advisor: {
    'event-1': {
      eventTypeDisplayName: 'New recommendation',
      applicationDisplayName: 'Advisor',
    },
    'event-2': {
      eventTypeDisplayName: 'Critical recommendation',
      applicationDisplayName: 'Advisor',
    },
  },
  policies: {
    'event-3': {
      eventTypeDisplayName: 'Policy triggered',
      applicationDisplayName: 'Policies',
    },
  },
};

// Custom Review component mapper
const reviewComponentMapper = {
  ...componentMapper,
  review: Review,
};

interface ReviewWrapperProps {
  category: IntegrationCategory;
  initialValues: Record<string, unknown>;
  schema: {
    fields: Array<{
      name: string;
      label?: string;
      component?: string;
      fields?: unknown[];
      isVisibleOnReview?: boolean;
      category?: IntegrationCategory;
    }>;
  };
  rbacGroups?: RbacGroup[];
  isLoadingGroups?: boolean;
}

const ReviewWrapper: React.FC<ReviewWrapperProps> = ({
  category,
  initialValues,
  schema,
  rbacGroups = mockRbacGroups,
  isLoadingGroups = false,
}) => {
  return (
    <RbacGroupContext.Provider value={{ groups: rbacGroups, isLoading: isLoadingGroups }}>
      <FormRenderer
        componentMapper={reviewComponentMapper}
        FormTemplate={FormTemplate}
        schema={{
          fields: [
            ...(schema.fields as Array<{
              name: string;
              component: string;
              label?: string;
              fields?: unknown[];
              isVisibleOnReview?: boolean;
            }>),
            {
              name: REVIEW,
              component: 'review',
              category,
            },
          ],
        }}
        onSubmit={fn()}
        initialValues={initialValues}
      />
    </RbacGroupContext.Provider>
  );
};

const meta: Meta<typeof ReviewWrapper> = {
  component: ReviewWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Review** is a wizard review step component that displays a summary of all configured integration fields.

## Features
- Displays all form values in a DescriptionList format
- Filters out fields with \`isVisibleOnReview: false\`
- Maps integration type to display name
- Renders event types in a formatted grid
- Shows user access group names (not IDs)
- Supports all integration categories (Communications, Reporting, Webhooks)
        `,
      },
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
type Story = StoryObj<typeof ReviewWrapper>;

/**
 * Webhook integration review with all basic fields.
 * Shows name, type, URL, method, and SSL verification settings.
 */
export const WebhookReview: Story = {
  args: {
    category: IntegrationCategory.WEBHOOKS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.WEBHOOK,
      name: 'Production Webhook',
      url: 'https://api.example.com/webhooks/notifications',
      method: 'POST',
      'ssl-verification-enabled': true,
      'secret-token': 'secret-token-value',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'url', label: 'Endpoint URL' },
        { name: 'method', label: 'HTTP method' },
        { name: 'ssl-verification-enabled', label: 'Enable SSL verification' },
        { name: 'secret-token', label: 'Secret token', isVisibleOnReview: false },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type is displayed with mapped name
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Production Webhook')).resolves.toBeInTheDocument();

    // Verify URL
    await expect(canvas.findByText('Endpoint URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://api.example.com/webhooks/notifications')
    ).resolves.toBeInTheDocument();

    // Verify HTTP method
    await expect(canvas.findByText('HTTP method')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('POST')).resolves.toBeInTheDocument();

    // Verify SSL verification
    await expect(canvas.findByText('Enable SSL verification')).resolves.toBeInTheDocument();

    // Secret token should NOT be visible (isVisibleOnReview: false)
    expect(canvas.queryByText('Secret token')).not.toBeInTheDocument();
    expect(canvas.queryByText('secret-token-value')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Webhook integration review. Shows basic webhook configuration with URL, method, and SSL settings. Secret token is hidden.',
      },
    },
  },
};

/**
 * Slack integration review with channel configuration.
 * Demonstrates camel integration type with extras field.
 */
export const SlackReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SLACK,
      name: 'Engineering Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      channel: '#engineering-alerts',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: SLACK_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Webhook URL' },
            { name: 'channel', label: 'Channel' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Slack
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Slack')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Engineering Notifications')).resolves.toBeInTheDocument();

    // Verify webhook URL
    await expect(canvas.findByText('Webhook URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX')
    ).resolves.toBeInTheDocument();

    // Verify channel
    await expect(canvas.findByText('Channel')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('#engineering-alerts')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Slack integration review with channel configuration. Shows camel integration type.',
      },
    },
  },
};

/**
 * Microsoft Teams integration review.
 * Shows Teams-specific configuration fields.
 */
export const TeamsReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.TEAMS,
      name: 'Operations Team Channel',
      url: 'https://outlook.office.com/webhook/abc123/IncomingWebhook/def456',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: TEAMS_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Webhook URL' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Microsoft Teams
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Microsoft Teams')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Operations Team Channel')).resolves.toBeInTheDocument();

    // Verify webhook URL
    await expect(canvas.findByText('Webhook URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://outlook.office.com/webhook/abc123/IncomingWebhook/def456')
    ).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Microsoft Teams integration review. Shows Teams webhook configuration.',
      },
    },
  },
};

/**
 * Google Chat integration review.
 * Shows Google Chat-specific configuration.
 */
export const GoogleChatReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.GOOGLE_CHAT,
      name: 'Security Alerts',
      url: 'https://chat.googleapis.com/v1/spaces/AAAAAAAAAAA/messages?key=AIzaSy',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: GOOGLE_CHAT_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Webhook URL' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Google Chat
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Google Chat')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Security Alerts')).resolves.toBeInTheDocument();

    // Verify webhook URL
    await expect(canvas.findByText('Webhook URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://chat.googleapis.com/v1/spaces/AAAAAAAAAAA/messages?key=AIzaSy')
    ).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Google Chat integration review. Shows Google Chat webhook configuration.',
      },
    },
  },
};

/**
 * Splunk integration review with authentication.
 * Shows reporting integration with basic auth.
 */
export const SplunkReview: Story = {
  args: {
    category: IntegrationCategory.REPORTING,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SPLUNK,
      name: 'Production Splunk',
      url: 'https://splunk.example.com:8088/services/collector',
      'basic-authentication-enabled': true,
      'basic-user': 'splunk-user',
      'basic-pass': 'password123',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: SPLUNK_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Endpoint URL' },
            { name: 'basic-authentication-enabled', label: 'Enable basic authentication' },
            { name: 'basic-user', label: 'Username' },
            { name: 'basic-pass', label: 'Password', isVisibleOnReview: false },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Splunk
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Splunk')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Production Splunk')).resolves.toBeInTheDocument();

    // Verify endpoint URL
    await expect(canvas.findByText('Endpoint URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://splunk.example.com:8088/services/collector')
    ).resolves.toBeInTheDocument();

    // Verify basic auth is enabled
    await expect(canvas.findByText('Enable basic authentication')).resolves.toBeInTheDocument();

    // Verify username is shown
    await expect(canvas.findByText('Username')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('splunk-user')).resolves.toBeInTheDocument();

    // Password should NOT be visible
    expect(canvas.queryByText('Password')).not.toBeInTheDocument();
    expect(canvas.queryByText('password123')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Splunk integration review with basic authentication. Password is hidden in review step.',
      },
    },
  },
};

/**
 * ServiceNow integration review.
 * Shows ServiceNow-specific configuration.
 */
export const ServiceNowReview: Story = {
  args: {
    category: IntegrationCategory.REPORTING,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SERVICE_NOW,
      name: 'Incident Management',
      url: 'https://dev12345.service-now.com/api/now/table/incident',
      'basic-authentication-enabled': true,
      'basic-user': 'servicenow-admin',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: SERVICE_NOW_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Instance URL' },
            { name: 'basic-authentication-enabled', label: 'Enable basic authentication' },
            { name: 'basic-user', label: 'Username' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows ServiceNow
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('ServiceNow')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Incident Management')).resolves.toBeInTheDocument();

    // Verify instance URL
    await expect(canvas.findByText('Instance URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://dev12345.service-now.com/api/now/table/incident')
    ).resolves.toBeInTheDocument();

    // Verify basic auth settings
    await expect(canvas.findByText('Enable basic authentication')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Username')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('servicenow-admin')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'ServiceNow integration review. Shows ServiceNow incident management configuration.',
      },
    },
  },
};

/**
 * PagerDuty integration review.
 * Shows PagerDuty-specific fields including severity.
 */
export const PagerDutyReview: Story = {
  args: {
    category: IntegrationCategory.REPORTING,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.PAGERDUTY,
      name: 'On-Call Alerts',
      'integration-key': 'abc123def456ghi789',
      severity: 'critical',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: PAGERDUTY_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'integration-key', label: 'Integration key', isVisibleOnReview: false },
            { name: 'severity', label: 'Severity' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows PagerDuty
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('PagerDuty')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('On-Call Alerts')).resolves.toBeInTheDocument();

    // Verify severity
    await expect(canvas.findByText('Severity')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('critical')).resolves.toBeInTheDocument();

    // Integration key should NOT be visible
    expect(canvas.queryByText('Integration key')).not.toBeInTheDocument();
    expect(canvas.queryByText('abc123def456ghi789')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'PagerDuty integration review. Shows severity configuration. Integration key is hidden.',
      },
    },
  },
};

/**
 * Email integration review with user access groups.
 * Shows email subscription with selected RBAC groups.
 */
export const EmailIntegrationReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.EMAIL_SUBSCRIPTION,
      name: 'Team Email Notifications',
      'user-access-groups': ['group-1', 'group-2'],
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: EMAIL_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'user-access-groups', label: 'User access groups' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Email
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Team Email Notifications')).resolves.toBeInTheDocument();

    // Verify user access groups show names, not IDs
    await expect(canvas.findByText('User access groups')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Engineering Team, QA Team')).resolves.toBeInTheDocument();

    // Group IDs should NOT be visible
    expect(canvas.queryByText('group-1')).not.toBeInTheDocument();
    expect(canvas.queryByText('group-2')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Email integration review with user access groups. Shows group names instead of IDs.',
      },
    },
  },
};

/**
 * Email integration with no groups selected.
 * Shows "None selected" when user access groups array is empty.
 */
export const EmailWithNoGroupsReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.EMAIL_SUBSCRIPTION,
      name: 'Admin Email Notifications',
      'user-access-groups': [],
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: EMAIL_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'user-access-groups', label: 'User access groups' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type shows Email
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email')).resolves.toBeInTheDocument();

    // Verify integration name
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Admin Email Notifications')).resolves.toBeInTheDocument();

    // Verify user access groups shows "None selected"
    await expect(canvas.findByText('User access groups')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('None selected')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Email integration with no user access groups selected. Shows "None selected" text.',
      },
    },
  },
};

/**
 * Integration review with event types.
 * Shows event types table when behavior groups are enabled.
 */
export const WithEventTypesReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SLACK,
      name: 'Notifications with Events',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      [EVENT_TYPES_TABLE]: mockEventTypes,
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'url', label: 'Webhook URL' },
        { name: EVENT_TYPES_TABLE, label: 'event types' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify basic fields
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Slack')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Notifications with Events')).resolves.toBeInTheDocument();

    // Verify event types table headers
    await expect(canvas.findByText(/advisor event types/i)).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Event type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Service')).resolves.toBeInTheDocument();

    // Verify advisor event types
    await expect(canvas.findByText('New recommendation')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Critical recommendation')).resolves.toBeInTheDocument();

    // Verify policies event types
    await expect(canvas.findByText(/policies event types/i)).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Policy triggered')).resolves.toBeInTheDocument();

    // Verify service names appear
    const advisorServices = await canvas.findAllByText('Advisor');
    expect(advisorServices.length).toBeGreaterThan(0);
    await expect(canvas.findByText('Policies')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Integration review with event types. Shows event types table grouped by application.',
      },
    },
  },
};

/**
 * Integration review with empty event types.
 * Shows how empty event types are filtered out.
 */
export const WithEmptyEventTypesReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.TEAMS,
      name: 'Teams without Events',
      url: 'https://outlook.office.com/webhook/abc123/IncomingWebhook/def456',
      [EVENT_TYPES_TABLE]: {
        advisor: {},
        policies: {},
      },
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'url', label: 'Webhook URL' },
        { name: EVENT_TYPES_TABLE, label: 'event types' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify basic fields are shown
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Microsoft Teams')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Teams without Events')).resolves.toBeInTheDocument();

    // Event types table should NOT be shown (empty objects filtered out)
    expect(canvas.queryByText('Event type')).not.toBeInTheDocument();
    expect(canvas.queryByText('Service')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Integration review with empty event types. Empty event type groups are filtered out.',
      },
    },
  },
};

/**
 * Minimal integration review.
 * Shows review with only required fields (name and type).
 */
export const MinimalReview: Story = {
  args: {
    category: IntegrationCategory.WEBHOOKS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.WEBHOOK,
      name: 'Simple Webhook',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify only integration type and name are shown
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Simple Webhook')).resolves.toBeInTheDocument();

    // No other fields should be visible
    const descriptionTerms = await canvas.findAllByRole('term');
    expect(descriptionTerms).toHaveLength(2); // Only 2 fields
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal integration review with only name and type. Demonstrates required fields.',
      },
    },
  },
};

/**
 * Review with nested field structure.
 * Shows how nested fields are flattened correctly.
 */
export const NestedFieldsReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SLACK,
      name: 'Multi-level Config',
      url: 'https://hooks.slack.com/services/TEST',
      channel: '#alerts',
      'ssl-verification-enabled': true,
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: SLACK_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            {
              name: 'connection-details',
              fields: [
                { name: 'url', label: 'Webhook URL' },
                { name: 'ssl-verification-enabled', label: 'Enable SSL verification' },
              ],
            },
            { name: 'channel', label: 'Channel' },
          ],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all fields are flattened and displayed
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Slack')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Multi-level Config')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook URL')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('https://hooks.slack.com/services/TEST')
    ).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Enable SSL verification')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Channel')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('#alerts')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Review with nested field structure. Shows how deeply nested fields are flattened correctly.',
      },
    },
  },
};

/**
 * Review with fields filtered by isVisibleOnReview.
 * Demonstrates which fields are hidden in review step.
 */
export const FilteredFieldsReview: Story = {
  args: {
    category: IntegrationCategory.WEBHOOKS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.WEBHOOK,
      name: 'Filtered Fields Example',
      url: 'https://api.example.com/webhook',
      'secret-token': 'super-secret-value',
      'internal-id': '12345',
      description: 'Test webhook for review',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'url', label: 'Endpoint URL' },
        { name: 'secret-token', label: 'Secret token', isVisibleOnReview: false },
        { name: 'internal-id', label: 'Internal ID', isVisibleOnReview: false },
        { name: 'description', label: 'Description' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify visible fields
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Filtered Fields Example')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Endpoint URL')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('https://api.example.com/webhook')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Description')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Test webhook for review')).resolves.toBeInTheDocument();

    // Verify hidden fields are NOT shown
    expect(canvas.queryByText('Secret token')).not.toBeInTheDocument();
    expect(canvas.queryByText('super-secret-value')).not.toBeInTheDocument();
    expect(canvas.queryByText('Internal ID')).not.toBeInTheDocument();
    expect(canvas.queryByText('12345')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Review with filtered fields. Fields with isVisibleOnReview: false are hidden (secrets, internal IDs).',
      },
    },
  },
};

/**
 * Review with empty/null values filtered.
 * Shows how empty values are excluded from review.
 */
export const EmptyValuesFilteredReview: Story = {
  args: {
    category: IntegrationCategory.WEBHOOKS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.WEBHOOK,
      name: 'Webhook with Empty Values',
      url: 'https://api.example.com/webhook',
      description: '', // Empty string
      tags: null, // Null value
      method: 'POST',
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'url', label: 'Endpoint URL' },
        { name: 'description', label: 'Description' },
        { name: 'tags', label: 'Tags' },
        { name: 'method', label: 'HTTP method' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify non-empty fields are shown
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook with Empty Values')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Endpoint URL')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('https://api.example.com/webhook')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('HTTP method')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('POST')).resolves.toBeInTheDocument();

    // Empty/null fields should NOT be shown
    expect(canvas.queryByText('Description')).not.toBeInTheDocument();
    expect(canvas.queryByText('Tags')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Review with empty/null values filtered. Fields with empty strings or null values are excluded.',
      },
    },
  },
};

/**
 * Review with RBAC groups loading state.
 * Shows behavior when user access groups are still loading.
 */
export const RbacGroupsLoadingReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.EMAIL_SUBSCRIPTION,
      name: 'Email with Loading Groups',
      'user-access-groups': ['group-1', 'group-2'],
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'user-access-groups', label: 'User access groups' },
      ],
    },
    rbacGroups: [],
    isLoadingGroups: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify basic fields
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email with Loading Groups')).resolves.toBeInTheDocument();

    // When groups are loading, the IDs should show "None selected"
    // because groups array is empty and the IDs don't match any loaded groups
    await expect(canvas.findByText('User access groups')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('None selected')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Review with RBAC groups loading. Shows "None selected" when groups are still being fetched.',
      },
    },
  },
};

/**
 * Review with invalid group IDs.
 * Shows behavior when selected group IDs don't exist in RBAC groups.
 */
export const InvalidGroupIdsReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.EMAIL_SUBSCRIPTION,
      name: 'Email with Invalid Groups',
      'user-access-groups': ['nonexistent-group-1', 'nonexistent-group-2'],
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        { name: 'name', label: 'Integration name' },
        { name: 'user-access-groups', label: 'User access groups' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify basic fields
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Email with Invalid Groups')).resolves.toBeInTheDocument();

    // When group IDs don't match any loaded groups, shows "None selected"
    await expect(canvas.findByText('User access groups')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('None selected')).resolves.toBeInTheDocument();

    // Invalid IDs should not be displayed
    expect(canvas.queryByText('nonexistent-group-1')).not.toBeInTheDocument();
    expect(canvas.queryByText('nonexistent-group-2')).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Review with invalid group IDs. Shows "None selected" when group IDs don\'t exist in RBAC groups.',
      },
    },
  },
};

/**
 * Complex integration review with all field types.
 * Comprehensive example showing multiple integration features.
 */
export const ComplexIntegrationReview: Story = {
  args: {
    category: IntegrationCategory.COMMUNICATIONS,
    initialValues: {
      [INTEGRATION_TYPE]: IntegrationType.SLACK,
      name: 'Complex Production Integration',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      channel: '#critical-alerts',
      'ssl-verification-enabled': true,
      'user-access-groups': ['group-1', 'group-3'],
      [EVENT_TYPES_TABLE]: mockEventTypes,
    },
    schema: {
      fields: [
        { name: INTEGRATION_TYPE, label: 'Type' },
        {
          name: SLACK_DETAILS,
          fields: [
            { name: 'name', label: 'Integration name' },
            { name: 'url', label: 'Webhook URL' },
            { name: 'channel', label: 'Channel' },
            { name: 'ssl-verification-enabled', label: 'Enable SSL verification' },
            { name: 'user-access-groups', label: 'User access groups' },
          ],
        },
        { name: EVENT_TYPES_TABLE, label: 'event types' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify integration type
    await expect(canvas.findByText('Integration type')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Slack')).resolves.toBeInTheDocument();

    // Verify integration details
    await expect(canvas.findByText('Integration name')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Complex Production Integration')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Webhook URL')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Channel')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('#critical-alerts')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Enable SSL verification')).resolves.toBeInTheDocument();

    // Verify user access groups
    await expect(canvas.findByText('User access groups')).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText('Engineering Team, Platform Admins')
    ).resolves.toBeInTheDocument();

    // Verify event types are shown
    await expect(canvas.findByText(/advisor event types/i)).resolves.toBeInTheDocument();
    await expect(canvas.findByText('New recommendation')).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Critical recommendation')).resolves.toBeInTheDocument();
    await expect(canvas.findByText(/policies event types/i)).resolves.toBeInTheDocument();
    await expect(canvas.findByText('Policy triggered')).resolves.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complex integration review showing all field types: basic config, user access groups, and event types.',
      },
    },
  },
};
