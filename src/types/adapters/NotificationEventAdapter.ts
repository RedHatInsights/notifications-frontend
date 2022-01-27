import { fromUtc } from '@redhat-cloud-services/insights-common-typescript';

import { Schemas } from '../../generated/OpenapiNotifications';
import { NotificationEvent, NotificationEventAction, NotificationEventStatus } from '../Event';
import { IntegrationType } from '../Integration';
import { UUID } from '../Notification';

type ServerEvent = Schemas.EventLogEntry;

export const toNotificationEvent = (serverEvent: ServerEvent): NotificationEvent => ({
    id: serverEvent.id,
    bundle: serverEvent.bundle,
    application: serverEvent.application,
    event: serverEvent.event_type,
    date: fromUtc(new Date(serverEvent.created)),
    actions: sortEventActions(groupActions(serverEvent.actions))
});

const sortEventActions = (actions: Array<NotificationEventAction>) => {
    return actions.sort(
        (first, second) => first.endpointType.localeCompare(second.endpointType)
    );
};

const groupActions = (actions: ServerEvent['actions']): Array<NotificationEventAction> => {
    const actionsById: Record<UUID, NotificationEventAction> = {};
    const actionsWithoutEndpoint: Array<NotificationEventAction> = [];

    actions.forEach(action => {
        if (!action.endpoint_id) {
            actionsWithoutEndpoint.push(initAction(action));
            return;
        }

        if (!actionsById[action.endpoint_id]) {
            actionsById[action.endpoint_id] = initAction(action);
        } else {
            const newAction = initAction(action);
            const current = actionsById[action.endpoint_id];

            if (newAction.status !== current.status) {
                current.status = NotificationEventStatus.WARNING;
            }

            current.errorCount += newAction.errorCount;
            current.successCount += newAction.successCount;
        }
    });

    return [ ...Object.values(actionsById), ...actionsWithoutEndpoint ];
};

const initAction = (action: ServerEvent['actions'][number]): NotificationEventAction => ({
    id: action.endpoint_id ?? undefined,
    endpointType: toNotificationEventAction(action.endpoint_type),
    status: action.invocation_result ? NotificationEventStatus.SUCCESS : NotificationEventStatus.ERROR,
    successCount: action.invocation_result ? 1 : 0,
    errorCount: action.invocation_result ? 0 : 1
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
