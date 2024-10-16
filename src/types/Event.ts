import { Schemas } from '../generated/OpenapiNotifications';
import { IntegrationType } from './Integration';
import { UUID } from './Notification';

export interface NotificationEventStatus {
  last: Schemas.EventLogEntryActionStatus;
  isDegraded: boolean;
}

export interface NotificationEventAction {
  id?: UUID;
  status: NotificationEventStatus;
  endpointType: IntegrationType;
  successCount: number;
  errorCount: number;
}

export interface NotificationEvent {
  id: UUID;
  event: string;
  application: string;
  bundle: string;
  actions: ReadonlyArray<NotificationEventAction>;
  date: Date;
}

export type EventPeriod = [Date | undefined, Date | undefined];
