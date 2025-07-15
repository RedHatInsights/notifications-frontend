import { AlertProps } from '@patternfly/react-core';
import createNotificationAction from '@redhat-cloud-services/frontend-components-notifications/createNotificationAction';
import createClearNotificationsAction from '@redhat-cloud-services/frontend-components-notifications/createClearNotificationsAction';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export type NotificationType = AlertProps['variant'];
type ExplicitNotificationFunction = (
  title: string,
  description: React.ReactNode,
  dismissable?: boolean
) => void;

export const useNotification = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    const addNotification = (
      variant: NotificationType,
      title: string,
      description: React.ReactNode,
      dismissable?: boolean
    ) =>
      dispatch(
        createNotificationAction({
          variant,
          title,
          description,
          dismissable,
        })
      );

    const addSuccessNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('success', ...args);
    const addDangerNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('danger', ...args);
    const addInfoNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('info', ...args);
    const addWarningNotification: ExplicitNotificationFunction = (...args) =>
      addNotification('warning', ...args);
    const clearNotifications = () => dispatch(createClearNotificationsAction());

    return {
      addNotification,
      addSuccessNotification,
      addDangerNotification,
      addInfoNotification,
      addWarningNotification,
      clearNotifications,
    };
  }, [dispatch]);
};
