import { Schemas } from '../../generated/OpenapiNotifications';
import { fromUtc } from '../../utils';
import { Server, ServerStatus } from '../Server';

export const toServer = (currentStatus: Schemas.CurrentStatus): Server => {
    if (currentStatus.status === Schemas.Status.Enum.MAINTENANCE) {
        return {
            status: ServerStatus.MAINTENANCE,
            from: fromUtc(currentStatus.start_time ? new Date(currentStatus.start_time) : new Date()),
            to: fromUtc(currentStatus.end_time ? new Date(currentStatus.end_time) : new Date())
        };
    }

    return {
        status: ServerStatus.RUNNING
    };
};
