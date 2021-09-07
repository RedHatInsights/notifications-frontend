import { Schemas } from '../../generated/OpenapiNotifications';
import { NotificationEvent } from '../Event';
import { fromUtc } from '@redhat-cloud-services/insights-common-typescript';

type ServerEvent = Schemas.EventLogEntry;

export const toNotificationEvent = (serverEvent: ServerEvent): NotificationEvent => ({
    id: serverEvent.id,
    bundle: serverEvent.bundle,
    application: serverEvent.application,
    event: serverEvent.event_type,
    date: fromUtc(new Date(serverEvent.created))
});
