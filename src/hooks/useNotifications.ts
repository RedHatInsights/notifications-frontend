import { getInsights, getInsightsEnvironment } from '@redhat-cloud-services/insights-common-typescript';

import { getNotificationActions } from '../config/Config';
import { NotificationType } from '../types/Notification';

export const useNotifications = (): ReadonlyArray<NotificationType> => {
    const insights = getInsights();
    const environment = getInsightsEnvironment(insights);

    return getNotificationActions(environment);
};
