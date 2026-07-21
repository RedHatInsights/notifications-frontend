/**
 * Test data generators for Playwright E2E tests
 * Generates unique, identifiable test data with cleanup-friendly naming
 */

/**
 * Generate a unique integration name with timestamp
 */
export function generateIntegrationName(type: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `PW_INT_${timestamp}_${type}_${random}`;
}

/**
 * Generate a unique behavior group name with timestamp
 */
export function generateBehaviorGroupName(bundle?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const bundlePrefix = bundle ? `${bundle}_` : '';
  return `PW_BG_${timestamp}_${bundlePrefix}${random}`;
}

/**
 * Generate webhook payload for creation
 */
export interface WebhookPayload {
  name: string;
  url: string;
  eventTypes?: string[];
}

export function generateWebhookPayload(
  options: {
    eventTypes?: string[];
  } = {}
): WebhookPayload {
  return {
    name: generateIntegrationName('webhook'),
    url: `https://webhook.site/test-${Date.now()}`,
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Generate communication integration payload
 */
export interface CommunicationPayload {
  name: string;
  type: 'slack' | 'teams' | 'gchat' | 'email';
  url?: string;
  eventTypes?: string[];
}

export function generateCommunicationPayload(
  type: 'slack' | 'teams' | 'gchat' | 'email',
  options: { eventTypes?: string[] } = {}
): CommunicationPayload {
  const urlMap: Record<string, string> = {
    slack: `https://hooks.slack.com/services/T00/B00/test-${Date.now()}`,
    teams: `https://outlook.office.com/webhook/test-${Date.now()}`,
    gchat: `https://chat.googleapis.com/v1/spaces/test-${Date.now()}`,
  };

  return {
    name: generateIntegrationName(type),
    type,
    ...(urlMap[type] && { url: urlMap[type] }),
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Generate PagerDuty integration payload
 */
export interface PagerDutyPayload {
  name: string;
  secretToken: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  eventTypes?: string[];
}

export function generatePagerDutyPayload(
  options: {
    severity?: 'critical' | 'error' | 'warning' | 'info';
    eventTypes?: string[];
  } = {}
): PagerDutyPayload {
  return {
    name: generateIntegrationName('pagerduty'),
    secretToken: `test-token-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`,
    severity: options.severity || 'critical',
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Generate ServiceNow integration payload
 */
export interface ServiceNowPayload {
  name: string;
  instanceUrl: string;
  username: string;
  password: string;
  eventTypes?: string[];
}

export function generateServiceNowPayload(
  options: {
    eventTypes?: string[];
  } = {}
): ServiceNowPayload {
  return {
    name: generateIntegrationName('servicenow'),
    instanceUrl: `https://dev${Date.now()}.service-now.com`,
    username: `test-user-${Date.now()}`,
    password: `test-password-${randomString(12)}`,
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Generate Splunk integration payload
 */
export interface SplunkPayload {
  name: string;
  url: string;
  token: string;
  eventTypes?: string[];
}

export function generateSplunkPayload(
  options: {
    eventTypes?: string[];
  } = {}
): SplunkPayload {
  return {
    name: generateIntegrationName('splunk'),
    url: `https://splunk-${Date.now()}.example.com:8088/services/collector`,
    token: `test-hec-token-${randomString(32)}`,
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Generate Ansible Automation Platform integration payload
 */
export interface AnsiblePayload {
  name: string;
  url: string;
  token: string;
  eventTypes?: string[];
}

export function generateAnsiblePayload(
  options: {
    eventTypes?: string[];
  } = {}
): AnsiblePayload {
  return {
    name: generateIntegrationName('ansible'),
    url: `https://ansible-${Date.now()}.example.com/api/v2/job_templates/123/launch`,
    token: `test-ansible-token-${randomString(32)}`,
    ...(options.eventTypes && { eventTypes: options.eventTypes }),
  };
}

/**
 * Random string generator (alternative utility)
 */
export function randomString(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
