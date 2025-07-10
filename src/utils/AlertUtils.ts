import { AlertProps } from '@patternfly/react-core';
import { createStore } from '@redhat-cloud-services/frontend-components-notifications';
import { useMemo } from 'react';

export type NotificationType = AlertProps['variant'];
type ExplicitNotificationFunction = (
  title: string,
  description: React.ReactNode,
  dismissable?: boolean
) => void;

// Create a notification store instance
const notificationStore = createStore();

// Todo: Create a PR over frontend-components with a similar hook
export const useNotification = () => {
  return useMemo(() => {
    const addNotification = (
      variant: NotificationType,
      title: string,
      description: React.ReactNode,
      dismissable?: boolean
    ) =>
      notificationStore.addNotification({
        variant,
        title,
        description,
        dismissable,
      });

    const addSuccessNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('success', ...args);
    const addDangerNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('danger', ...args);
    const addInfoNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('info', ...args);
    const addWarningNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('warning', ...args);
    const clearNotifications = () => notificationStore.clearNotifications();

    return {
      addNotification,
      addSuccessNotification,
      addDangerNotification,
      addInfoNotification,
      addWarningNotification,
      clearNotifications,
    };
  }, []);
};
