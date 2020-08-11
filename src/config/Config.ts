import { DeepReadonly } from 'ts-essentials';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/notifications/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    integrations: {
        appId: 'integrations',
        title: 'Integrations'
    },
    notifications: {
        appId: 'notifications',
        title: 'Notifications'
    },
    pages: {
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
