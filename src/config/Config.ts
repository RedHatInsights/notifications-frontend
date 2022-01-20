import { DeepReadonly } from 'ts-essentials';

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
    [IntegrationType.ANYCAMEL]: {
        name: 'AnyCamel'
    },
    [IntegrationType.SPLUNK]: {
        name: 'Splunk'
    },
    [IntegrationType.WEBHOOK]: {
        name: 'Webhook'
    },
    [IntegrationType.EMAIL_SUBSCRIPTION]: {
        name: 'Email'
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
        integrationActions: {
            released: [
                UserIntegrationType.WEBHOOK
            ],
            experimental: [
                UserIntegrationType.WEBHOOK,
                UserIntegrationType.SPLUNK,
                UserIntegrationType.ANYCAMEL
            ]
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
                NotificationType.EMAIL_SUBSCRIPTION, NotificationType.DRAWER
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
export default ReadonlyConfig;
