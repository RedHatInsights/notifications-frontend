import { DeepReadonly } from 'ts-essentials';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/notifications/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    appId: 'notifications',
    defaultElementsPerPage: 20,
    integrations: {
        subAppId: 'integrations',
        title: 'Integrations'
    },
    notifications: {
        subAppId: 'notifications',
        title: 'Notifications'
    },
    pages: {
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
