import Config from '../config/Config';
import { isReleased } from '../types/Environments';
import { NotificationType } from '../types/Notification';

export const useNotifications = (): ReadonlyArray<NotificationType> => {
    const released = isReleased();

    if (released) {
        return Config.notifications.actions.released;
    }

    return Config.notifications.actions.experimental;
};
