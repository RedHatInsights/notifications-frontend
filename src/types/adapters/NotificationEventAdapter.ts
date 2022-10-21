import { fromUtc } from '@redhat-cloud-services/insights-common-typescript';

import { Schemas } from '../../generated/OpenapiNotifications';
import { NotificationEvent, NotificationEventAction  } from '../Event';
import { UUID } from '../Notification';
import { getIntegrationType } from './IntegrationAdapter';

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

            if (isFailed(newAction.status.last)) {
                current.status.isDegraded = true;
            } else {
                current.status.last = newAction.status.last;
            }

            current.errorCount += newAction.errorCount;
            current.successCount += newAction.successCount;
        }
    });

    return [ ...Object.values(actionsById), ...actionsWithoutEndpoint ];
};

const initAction = (action: ServerEvent['actions'][number]): NotificationEventAction => ({
    id: action.endpoint_id ?? undefined,
    endpointType: getIntegrationType({
        type: action.endpoint_type,
        sub_type: action.endpoint_sub_type
    }),
    status: {
        last: action.status,
        isDegraded: isFailed(action.status)
    },
    successCount: isFailed(action.status) ? 1 : 0,
    errorCount: isFailed(action.status) ? 0 : 1
});

const isFailed = (status: ServerEvent['actions'][number]['status']): boolean =>
    status === 'FAILED';
