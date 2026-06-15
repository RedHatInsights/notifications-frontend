import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { getNotificationActions } from '../config/Config';
import { NotificationType } from '../types/Notification';
import { getInsightsEnvironment } from '../utils/insights-common-typescript';

export const useNotifications = (): ReadonlyArray<NotificationType> => {
  const { getEnvironment, isBeta } = useChrome();
  const environment = getInsightsEnvironment(isBeta(), getEnvironment());

  return getNotificationActions(environment);
};
