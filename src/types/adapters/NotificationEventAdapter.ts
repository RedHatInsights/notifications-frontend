import { fromUtc } from '@redhat-cloud-services/insights-common-typescript';

import { Schemas } from '../../generated/OpenapiNotifications';
import { NotificationEvent, NotificationEventAction, NotificationEventStatus } from '../Event';
import { UUID } from '../Notification';
import { getIntegrationType } from './IntegrationAdapter';

type ServerEvent = Schemas.EventLogEntry;

export const toNotificationEvent = (serverEvent: ServerEvent): NotificationEvent => ({
    id: serverEvent.id,
    bundle: serverEvent.bundle,
    application: serverEvent.application,
    event: serverEvent.eventType,
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
        if (!action.endpointId) {
            actionsWithoutEndpoint.push(initAction(action));
            return;
        }

        if (!actionsById[action.endpointId]) {
            actionsById[action.endpointId] = initAction(action);
        } else {
            const newAction = initAction(action);
            const current = actionsById[action.endpointId];

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
    id: action.endpointId ?? undefined,
    endpointType: getIntegrationType({
        type: action.endpointType,
        subType: action.endpointSubType
    }),
    status: action.invocationResult ? NotificationEventStatus.SUCCESS : NotificationEventStatus.ERROR,
    successCount: action.invocationResult ? 1 : 0,
    errorCount: action.invocationResult ? 0 : 1
});
