import { Schemas } from '../../generated/OpenapiNotifications';
import { BehaviorGroup } from '../Notification';
import { reduceActions, toAction } from './NotificationAdapter';

type ServerBehaviorGroup = Schemas.BehaviorGroup;

const reportBehaviorGroup = (element: ServerBehaviorGroup): never => {
    throw new Error('Invalid behavior group:' + JSON.stringify(element));
};

export const toBehaviorGroup = (serverBehaviorGroup: ServerBehaviorGroup): BehaviorGroup => {
    const actions = serverBehaviorGroup.actions?.map((behaviorAction) => {
        if (behaviorAction.endpoint) {
            return toAction(behaviorAction.endpoint);
        }

        return reportBehaviorGroup(serverBehaviorGroup);
    }) || [];

    return {
        actions: reduceActions(actions),
        events: serverBehaviorGroup.behaviors?.map(b => ({
            id: b.event_type?.id ?? '',
            applicationDisplayName: b.event_type?.application?.display_name ?? '',
            eventTypeDisplayName: b.event_type?.display_name ?? ''
        })) ?? [],
        bundleId: serverBehaviorGroup.bundle_id,
        displayName: serverBehaviorGroup.display_name,
        id: serverBehaviorGroup.id ?? reportBehaviorGroup(serverBehaviorGroup),
        bundleName: serverBehaviorGroup.bundle?.display_name ?? '',
        isDefault: !!serverBehaviorGroup.default_behavior
    };
};
