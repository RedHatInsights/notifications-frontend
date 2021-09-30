import { fromUtc } from '@redhat-cloud-services/insights-common-typescript';

import { Schemas } from '../../generated/OpenapiNotifications';
import { NotificationEvent } from '../Event';
import { IntegrationType } from '../Integration';

type ServerEvent = Schemas.EventLogEntry;

export const toNotificationEvent = (serverEvent: ServerEvent): NotificationEvent => ({
    id: serverEvent.id,
    bundle: serverEvent.bundle,
    application: serverEvent.application,
    event: serverEvent.event_type,
    date: fromUtc(new Date(serverEvent.created)),
    actions: serverEvent.actions.map(a => ({
        id: a.id,
        endpointType: toNotificationEventAction(a.endpoint_type),
        success: a.invocation_result
    }))
});

const toNotificationEventAction = (serverEndpointType: ServerEvent['actions'][number]['endpoint_type']) => {
    switch (serverEndpointType) {
        case 'camel':
            return IntegrationType.CAMEL;
        case 'email_subscription':
            return IntegrationType.EMAIL_SUBSCRIPTION;
        case 'webhook':
            return IntegrationType.WEBHOOK;
        case 'default':
        default:
            throw new Error(`unknown endpoint type: ${serverEndpointType}`);
    }
};
