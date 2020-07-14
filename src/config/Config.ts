import { DeepReadonly } from 'ts-essentials';

const apiVersion = 'v1.0';
const apiBaseUrl = `/api/notifications/${apiVersion}`;

export const withBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const Config = {
    appId: 'policies',
    pages: {
    }
};

const ReadonlyConfig: DeepReadonly<typeof Config> = Config;
export default ReadonlyConfig;
