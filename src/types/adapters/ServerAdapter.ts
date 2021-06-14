import { Schemas } from '../../generated/OpenapiNotifications';
import { Server, ServerStatus } from '../Server';

// Todo: This could be added to the common code
const fromUtc = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

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
