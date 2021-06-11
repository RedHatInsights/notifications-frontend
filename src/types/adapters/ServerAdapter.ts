import { Schemas } from '../../generated/OpenapiNotifications';
import { Server, ServerStatus } from '../Server';

export const toServer = (currentStatus: Schemas.CurrentStatus): Server => {
    if (currentStatus.status === Schemas.Status.Enum.MAINTENANCE) {
        return {
            status: ServerStatus.MAINTENANCE,
            from: currentStatus.startTime ? new Date(currentStatus.startTime) : new Date(),
            to: currentStatus.endTime ? new Date(currentStatus.endTime) : new Date()
        };
    }

    return {
        status: ServerStatus.RUNNING
    };
};
