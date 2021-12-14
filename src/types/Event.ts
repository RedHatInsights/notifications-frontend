import { IntegrationType } from './Integration';
import { UUID } from './Notification';

export interface NotificationEvent {
    id: UUID;
    event: string;
    application: string;
    bundle: string;
    actions: ReadonlyArray<{
        id?: UUID;
        success: boolean;
        endpointType: IntegrationType;
    }>;
    date: Date;
}

export type EventPeriod = [ Date | undefined, Date | undefined ];
