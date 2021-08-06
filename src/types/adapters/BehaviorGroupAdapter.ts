import { Schemas } from '../../generated/OpenapiNotifications';
import { BehaviorGroup, NewBehaviorGroup } from '../Notification';
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
        bundleId: serverBehaviorGroup.bundle_id,
        displayName: serverBehaviorGroup.display_name,
        id: serverBehaviorGroup.id ?? reportBehaviorGroup(serverBehaviorGroup),
        bundleName: serverBehaviorGroup.bundle?.display_name ?? ''
    };
};

export const toShallowBehaviorGroupRequest = (behaviorGroup: BehaviorGroup | NewBehaviorGroup): ServerBehaviorGroup => {
    return {
        bundle_id: behaviorGroup.bundleId,
        display_name: behaviorGroup.displayName
    };
};
