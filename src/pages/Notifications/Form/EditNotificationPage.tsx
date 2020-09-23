import * as React from 'react';
import { Action, Notification } from '../../../types/Notification';
import { NotificationSaveModal } from '../../../components/Notifications/SaveModal';

interface EditNotificationPagePropsNotification {
    type: 'notification';
    notification: Notification;
}

interface EditNotificationPagePropsDefault {
    type: 'default';
    actions: Array<Action>;
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
