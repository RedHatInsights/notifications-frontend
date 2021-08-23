import { UUID } from './Notification';

export interface NotificationEvent {
    id: UUID;
    event: string;
    application: string;
    bundle: string;
    date: Date;
}
