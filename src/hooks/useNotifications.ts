import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { getNotificationActions } from '../config/Config';
import { NotificationType } from '../types/Notification';

export const useNotifications = (): ReadonlyArray<NotificationType> => {
    const { getEnvironment, isBeta } = useChrome();
    const environment = `${getEnvironment()}-${isBeta() ? 'beta' : 'stable'}`;

    return getNotificationActions(environment);
};
