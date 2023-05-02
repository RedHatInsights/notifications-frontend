import { Environment } from '@redhat-cloud-services/insights-common-typescript';
import { DeepReadonly } from 'ts-essentials';

import { fedramp, stagingAndProd, stagingAndProdBeta, stagingAndProdStable } from '../types/Environments';
import { IntegrationType, UserIntegrationType } from '../types/Integration';
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

const integrationTypes: Record<IntegrationType, IntegrationTypeConfigBase> = {
    [IntegrationType.SPLUNK]: {
        name: 'Splunk'
    },
    [IntegrationType.SERVICE_NOW]: {
        name: 'ServiceNow'
    },
    [IntegrationType.SLACK]: {
        name: 'Slack'
    },
    [IntegrationType.WEBHOOK]: {
        name: 'Webhook'
    },
    [IntegrationType.ANSIBLE]: {
        name: 'Event-Driven Ansible'
    },
    [IntegrationType.EMAIL_SUBSCRIPTION]: {
        name: 'Email'
    },
    [IntegrationType.TEAMS]: {
        name: 'Microsoft Teams'
    },
    [IntegrationType.GOOGLE_CHAT]: {
        name: 'Google Chat'
    }
};

const notificationTypes: Record<NotificationType, NotificationTypeConfig> = {
    [NotificationType.EMAIL_SUBSCRIPTION]: {
        name: 'Send an email'
    },
    [NotificationType.DRAWER]: {
        name: 'Send to notification drawer'
    },
    [NotificationType.INTEGRATION]: {
        name: 'Integration'
    }
};

const computeIntegrationConfig = (base: Record<IntegrationType, IntegrationTypeConfigBase>) : Record<IntegrationType, IntegrationTypeConfig> => {
    const complete = {} as Record<IntegrationType, IntegrationTypeConfig>;

    const transform = (type: IntegrationType, element: IntegrationTypeConfigBase): IntegrationTypeConfig => ({
        ...element,
        action: type === IntegrationType.EMAIL_SUBSCRIPTION ? element.name : `Integration: ${element.name}`
    });

    Object.keys(base).forEach((key) => {
        complete[key] = transform(key as IntegrationType, base[key]);
    });

    return complete;
};

const Config = {
    integrations: {
        subAppId: 'integrations',
        title: 'Integrations | Settings',
        types: computeIntegrationConfig(integrationTypes),
        actions: {
            stable: [
                UserIntegrationType.WEBHOOK,
                UserIntegrationType.SPLUNK,
                UserIntegrationType.SLACK,
                UserIntegrationType.SERVICE_NOW
            ],
            beta: [
                UserIntegrationType.WEBHOOK,
                UserIntegrationType.SPLUNK,
                UserIntegrationType.SLACK,
                UserIntegrationType.SERVICE_NOW
            ],
            experimental: [
                UserIntegrationType.WEBHOOK,
                UserIntegrationType.SPLUNK,
                UserIntegrationType.SLACK,
                UserIntegrationType.SERVICE_NOW,
                UserIntegrationType.TEAMS,
                UserIntegrationType.GOOGLE_CHAT,
                UserIntegrationType.ANSIBLE
            ],
            fedramp: []
        }
    },
    notifications: {
        subAppId: 'notifications',
        title: 'Notifications | Settings',
        types: notificationTypes,
        actions: {
            released: [
                NotificationType.EMAIL_SUBSCRIPTION
            ],
            experimental: [
                NotificationType.EMAIL_SUBSCRIPTION,
                NotificationType.DRAWER
            ],
            fedramp: [
                NotificationType.EMAIL_SUBSCRIPTION
            ]
        }
    },
    pages: {
    },
    paging: {
        defaultPerPage: 20
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;

export const getIntegrationActions = (environment: Environment): ReadonlyArray<UserIntegrationType> => {
    if (stagingAndProdStable.includes(environment)) {
        return ReadonlyConfig.integrations.actions.stable;
    } else if (stagingAndProdBeta.includes(environment)) {
        return ReadonlyConfig.integrations.actions.beta;
    } else if (fedramp.includes(environment)) {
        return ReadonlyConfig.integrations.actions.fedramp;
    }

    return ReadonlyConfig.integrations.actions.experimental;
};

export const getNotificationActions = (environment: Environment): ReadonlyArray<NotificationType> => {
    if (stagingAndProd.includes(environment)) {
        return ReadonlyConfig.notifications.actions.released;
    } else if (fedramp.includes(environment)) {
        return ReadonlyConfig.notifications.actions.fedramp;
    }

    return ReadonlyConfig.notifications.actions.experimental;
};

export default ReadonlyConfig;
