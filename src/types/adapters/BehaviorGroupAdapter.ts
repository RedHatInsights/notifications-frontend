import { Schemas } from '../../generated/OpenapiPrivate';
import { BehaviorGroup, NewBehaviorGroup } from '../Notification';
import { toAction } from './NotificationAdapter';

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
        actions,
        bundleId: serverBehaviorGroup.bundle_id,
        displayName: serverBehaviorGroup.display_name,
        id: serverBehaviorGroup.id ?? reportBehaviorGroup(serverBehaviorGroup)
    };
};

export const toShallowBehaviorGroupRequest = (behaviorGroup: BehaviorGroup | NewBehaviorGroup): ServerBehaviorGroup => {
    return {
        bundle_id: behaviorGroup.bundleId,
        display_name: behaviorGroup.displayName
    };
};
