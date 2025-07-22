import { AlertProps } from '@patternfly/react-core';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks/useNotifications';
import { useMemo } from 'react';

export type NotificationType = AlertProps['variant'];
type ExplicitNotificationFunction = (
  title: string,
  description?: React.ReactNode,
  dismissable?: boolean
) => void;

export const useNotification = () => {
  const addNotification = useAddNotification();

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

    return {
      addNotification,
      addSuccessNotification,
      addDangerNotification,
      addInfoNotification,
      addWarningNotification,
    };
  }, [addNotification]);
};
