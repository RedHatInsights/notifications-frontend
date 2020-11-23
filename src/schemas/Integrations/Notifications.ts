import * as Yup from 'yup';
import { NotificationType } from '../../types/Notification';

const ActionIntegration = Yup.object({
    type: Yup.mixed().oneOf([ NotificationType.INTEGRATION ]).required(),
    integration: Yup.object({
        id: Yup.string().required()
    }).required()
});

const ActionNotify = Yup.object({
    type: Yup.mixed().oneOf([ NotificationType.EMAIL_SUBSCRIPTION, NotificationType.DRAWER, NotificationType.PLATFORM_ALERT ]).required(),
    recipient: Yup.array(Yup.string()).min(1)
});

export const WithActions = Yup.object({
    actions: Yup.array(Yup.lazy(obj => {
        if ((obj as any).hasOwnProperty('type')) {
            if ((obj as any).type === NotificationType.INTEGRATION) {
                return ActionIntegration;
            }
        }

        return ActionNotify;
    }))
});
