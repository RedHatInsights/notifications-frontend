import { AlertProps } from '@patternfly/react-core';
import { useNotifications } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { useMemo } from 'react';

export type NotificationType = AlertProps['variant'];
type ExplicitNotificationFunction = (
  title: string,
  description?: React.ReactNode,
  dismissable?: boolean
) => void;

export const useNotification = () => {
  const { addNotification, clearNotifications } = useNotifications();

  return useMemo(() => {
    const addSuccessNotification: ExplicitNotificationFunction = (
      title,
      description,
      dismissable = true
    ) =>
      addNotification({
        variant: 'success',
        title,
        description,
        dismissable,
      });

    const addDangerNotification: ExplicitNotificationFunction = (
      title,
      description,
      dismissable = true
    ) =>
      addNotification({
        variant: 'danger',
        title,
        description,
        dismissable,
      });

    const addInfoNotification: ExplicitNotificationFunction = (
      title,
      description,
      dismissable = true
    ) =>
      addNotification({
        variant: 'info',
        title,
        description,
        dismissable,
      });

    const addWarningNotification: ExplicitNotificationFunction = (
      title,
      description,
      dismissable = true
    ) =>
      addNotification({
        variant: 'warning',
        title,
        description,
        dismissable,
      });

    const clearAllNotifications: ExplicitNotificationFunction = () =>
      clearNotifications();

    return {
      addNotification,
      addSuccessNotification,
      addDangerNotification,
      addInfoNotification,
      addWarningNotification,
      clearAllNotifications,
    };
  }, [addNotification, clearNotifications]);
};
