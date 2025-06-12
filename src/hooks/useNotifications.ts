import { getNotificationActions } from '../config/Config';
import { NotificationType } from '../types/Notification';
import {
  getInsights,
  getInsightsEnvironment,
} from '../utils/insights-common-typescript';

export const useNotifications = (): ReadonlyArray<NotificationType> => {
  const insights = getInsights();
  const environment = getInsightsEnvironment(insights);

  return getNotificationActions(environment);
};
