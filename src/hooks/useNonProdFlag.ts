import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';

export const useNonProdFlag = (flag: string) => {
    const { isBeta, getEnvironment } = useChrome();
    const notificationsOverhaul = useFlag(flag);

    if (getEnvironment() === 'prod' && isBeta() === false) {
        return false;
    }

    return notificationsOverhaul;
};
