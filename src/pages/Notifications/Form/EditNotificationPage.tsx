import * as React from 'react';
import { DefaultNotificationBehavior, Notification } from '../../../types/Notification';
import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';

interface EditNotificationPagePropsNotification {
    type: 'notification';
    data: Notification;
}

interface EditNotificationPagePropsDefault {
    type: 'default';
    data: DefaultNotificationBehavior;
}

export type EditNotificationPageProps = {
    onClose: (saved: boolean) => void;
} & (EditNotificationPagePropsNotification | EditNotificationPagePropsDefault);

export const EditNotificationPage: React.FunctionComponent<EditNotificationPageProps> = (props) => {
    return (
        <NotificationSaveModal
            isSaving={ false }
            { ...props }
        />
    );
};
