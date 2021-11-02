import { DeepReadonly } from 'ts-essentials';

import { IntegrationType } from '../types/Integration';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/notifications/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    integrations: {
        subAppId: 'integrations',
        title: 'Integrations | Settings'
    },
    notifications: {
        subAppId: 'notifications',
        title: 'Notifications | Settings'
    },
    integrationNames: {
        [IntegrationType.CAMEL]: 'Integration: Camel',
        [IntegrationType.WEBHOOK]: 'Integration: Webhook',
        [IntegrationType.EMAIL_SUBSCRIPTION]: 'Email'
    } as Record<IntegrationType, string>,
    pages: {
    },
    paging: {
        defaultPerPage: 20
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
