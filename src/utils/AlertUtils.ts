import { AlertProps } from '@patternfly/react-core';
import {
    addNotification as createNotificationAction,
    clearNotifications as createClearNotificationsAction
} from '@redhat-cloud-services/frontend-components-notifications';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

export type NotificationType = AlertProps['variant'];
type ExplicitNotificationFunction = (title: string, description: React.ReactNode, dismissable?: boolean) => void;

// Todo: Create a PR over frontend-components with a similar hook
export const useNotification = () => {
    const dispatch = useDispatch();
    return useMemo(() => {

        const addNotification = (
            variant: NotificationType,
            title: string,
            description: React.ReactNode,
            dismissable?: boolean
        ) => {
            console.log('adding notification');
            console.log('dispatch', dispatch);
            console.log(createNotificationAction({
                variant,
                title,
                description,
                dismissable
            }));
            dispatch(createNotificationAction({
                variant,
                title,
                description,
                dismissable
            }));
        };

        const addSuccessNotification: ExplicitNotificationFunction = (...args) => addNotification('success', ...args);
        const addDangerNotification: ExplicitNotificationFunction = (...args) => addNotification('danger', ...args);
        const addInfoNotification: ExplicitNotificationFunction = (...args) => addNotification('info', ...args);
        const addWarningNotification: ExplicitNotificationFunction = (...args) => addNotification('warning', ...args);
        const addDefaultNotification: ExplicitNotificationFunction = (...args) => addNotification('default', ...args);
        const clearNotifications = () => dispatch(createClearNotificationsAction());

        return {
            addNotification,
            addSuccessNotification,
            addDangerNotification,
            addInfoNotification,
            addWarningNotification,
            addDefaultNotification,
            clearNotifications
        };
    }, [ dispatch ]);
};
