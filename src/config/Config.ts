import { Environment } from '@redhat-cloud-services/insights-common-typescript';
import { DeepReadonly } from 'ts-essentials';

import {
  fedramp,
  stagingAndProd,
  stagingAndProdBeta,
  stagingAndProdStable,
} from '../types/Environments';
import {
  IntegrationCategory,
  IntegrationIcon,
  IntegrationIconTypes,
  IntegrationType,
  UserIntegrationType,
} from '../types/Integration';
import { NotificationType } from '../types/Notification';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/notifications/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

interface IntegrationTypeConfigBase {
  name: string;
}

interface IntegrationTypeConfig extends IntegrationTypeConfigBase {
  action: string;
}

interface NotificationTypeConfig {
  name: string;
}

export const integrationTypes: Record<
  IntegrationType,
  IntegrationTypeConfigBase
> = {
  [IntegrationType.SPLUNK]: {
    name: 'Splunk',
  },
  [IntegrationType.SERVICE_NOW]: {
    name: 'ServiceNow',
  },
  [IntegrationType.SLACK]: {
    name: 'Slack',
  },
  [IntegrationType.WEBHOOK]: {
    name: 'Webhook',
  },
  [IntegrationType.ANSIBLE]: {
    name: 'Event-Driven Ansible',
  },
  [IntegrationType.EMAIL_SUBSCRIPTION]: {
    name: 'Email',
  },
  [IntegrationType.TEAMS]: {
    name: 'Microsoft Teams',
  },
  [IntegrationType.GOOGLE_CHAT]: {
    name: 'Google Chat',
  },
  [IntegrationType.DRAWER]: {
    name: 'Drawer',
  },
  [IntegrationType.PAGERDUTY]: {
    name: 'PagerDuty',
  },
};

const notificationTypes: Record<NotificationType, NotificationTypeConfig> = {
  [NotificationType.EMAIL_SUBSCRIPTION]: {
    name: 'Send an email',
  },
  [NotificationType.DRAWER]: {
    name: 'Send to notification drawer',
  },
  [NotificationType.INTEGRATION]: {
    name: 'Integration',
  },
};

const computeIntegrationConfig = (
  base: Record<IntegrationType, IntegrationTypeConfigBase>
): Record<IntegrationType, IntegrationTypeConfig> => {
  const complete = {} as Record<IntegrationType, IntegrationTypeConfig>;

  const transform = (
    type: IntegrationType,
    element: IntegrationTypeConfigBase
  ): IntegrationTypeConfig => ({
    ...element,
    action: [
      IntegrationType.EMAIL_SUBSCRIPTION,
      IntegrationType.DRAWER,
    ].includes(type)
      ? element.name
      : `Integration: ${element.name}`,
  });

  Object.keys(base).forEach((key) => {
    complete[key] = transform(key as IntegrationType, base[key]);
  });

  return complete;
};

export const sortedIntegrationList = (
  integrations: Array<UserIntegrationType>
): Array<UserIntegrationType> => {
  return [...integrations].sort(
    (first: UserIntegrationType, second: UserIntegrationType) => {
      const firstName = integrationTypes[first].name;
      const secondName = integrationTypes[second].name;

      if (firstName < secondName) {
        return -1;
      } else if (firstName > secondName) {
        return 1;
      }

      return 0;
    }
  );
};

export const defaultIconList = {
  [IntegrationCategory.COMMUNICATIONS]: <IntegrationIconTypes>{
    [UserIntegrationType.GOOGLE_CHAT]: <IntegrationIcon>{
      name: IntegrationType.GOOGLE_CHAT,
      product_name: 'Google Chat',
      icon_url: '/apps/frontend-assets/sources-integrations/google-chat.svg',
    },
    [UserIntegrationType.TEAMS]: <IntegrationIcon>{
      name: IntegrationType.TEAMS,
      product_name: 'Microsoft Office Teams',
      icon_url:
        '/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg',
    },
    [UserIntegrationType.SLACK]: <IntegrationIcon>{
      name: IntegrationType.SLACK,
      product_name: 'Slack',
      icon_url: '/apps/frontend-assets/sources-integrations/slack.svg',
    },
  },
  [IntegrationCategory.REPORTING]: <IntegrationIconTypes>{
    [UserIntegrationType.SERVICE_NOW]: <IntegrationIcon>{
      name: IntegrationType.SERVICE_NOW,
      product_name: 'ServiceNow',
      icon_url: '/apps/frontend-assets/sources-integrations/service-now.svg',
    },
    [UserIntegrationType.SPLUNK]: <IntegrationIcon>{
      name: IntegrationType.SPLUNK,
      product_name: 'Splunk',
      icon_url: '/apps/frontend-assets/sources-integrations/splunk.svg',
    },
    [UserIntegrationType.ANSIBLE]: <IntegrationIcon>{
      name: IntegrationType.ANSIBLE,
      product_name: 'Event-Driven Ansible',
      icon_url: '/apps/frontend-assets/sources-integrations/ansible.svg',
    },
    [UserIntegrationType.PAGERDUTY]: <IntegrationIcon>{
      name: IntegrationType.PAGERDUTY,
      product_name: 'PagerDuty',
      icon_url: '/apps/frontend-assets/sources-integrations/pagerduty.svg',
    },
  },
};

const defaultIntegrationList = {
  [IntegrationCategory.COMMUNICATIONS]: sortedIntegrationList([
    UserIntegrationType.GOOGLE_CHAT,
    UserIntegrationType.TEAMS,
    UserIntegrationType.SLACK,
  ]),
  [IntegrationCategory.REPORTING]: sortedIntegrationList([
    UserIntegrationType.SERVICE_NOW,
    UserIntegrationType.SPLUNK,
    UserIntegrationType.ANSIBLE,
    UserIntegrationType.PAGERDUTY,
  ]),
  [IntegrationCategory.WEBHOOKS]: sortedIntegrationList([
    UserIntegrationType.WEBHOOK,
  ]),
  all: sortedIntegrationList([
    UserIntegrationType.ANSIBLE,
    UserIntegrationType.GOOGLE_CHAT,
    UserIntegrationType.PAGERDUTY,
    UserIntegrationType.TEAMS,
    UserIntegrationType.SERVICE_NOW,
    UserIntegrationType.SLACK,
    UserIntegrationType.SPLUNK,
    UserIntegrationType.WEBHOOK,
  ]),
};

const Config = {
  integrations: {
    subAppId: 'integrations',
    title: 'Integrations | Settings',
    types: computeIntegrationConfig(integrationTypes),
    actions: {
      stable: defaultIntegrationList,
      beta: defaultIntegrationList,
      experimental: defaultIntegrationList,
      fedramp: {
        [IntegrationCategory.COMMUNICATIONS]: [],
        [IntegrationCategory.REPORTING]: [],
        [IntegrationCategory.WEBHOOKS]: [],
        all: [],
      },
    },
  },
  notifications: {
    subAppId: 'notifications',
    title: 'Notifications | Settings',
    types: notificationTypes,
    actions: {
      released: [NotificationType.EMAIL_SUBSCRIPTION],
      experimental: [
        NotificationType.EMAIL_SUBSCRIPTION,
        NotificationType.DRAWER,
      ],
      fedramp: [NotificationType.EMAIL_SUBSCRIPTION],
    },
  },
  pages: {},
  paging: {
    defaultPerPage: 20,
  },
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;

export const getIntegrationActions = (
  environment: Environment,
  category?: IntegrationCategory
): ReadonlyArray<UserIntegrationType> => {
  const selectedCategory = category ?? 'all';
  if (stagingAndProdStable.includes(environment)) {
    return ReadonlyConfig.integrations.actions.stable[selectedCategory];
  } else if (stagingAndProdBeta.includes(environment)) {
    return ReadonlyConfig.integrations.actions.beta[selectedCategory];
  } else if (fedramp.includes(environment)) {
    return ReadonlyConfig.integrations.actions.fedramp[selectedCategory];
  }

  return ReadonlyConfig.integrations.actions.experimental[selectedCategory];
};

export const getNotificationActions = (
  environment: Environment
): ReadonlyArray<NotificationType> => {
  if (stagingAndProd.includes(environment)) {
    return ReadonlyConfig.notifications.actions.released;
  } else if (fedramp.includes(environment)) {
    return ReadonlyConfig.notifications.actions.fedramp;
  }

  return ReadonlyConfig.notifications.actions.experimental;
};

export default ReadonlyConfig;
