import { Operations } from '../../generated/OpenapiNotifications';
import { UUID } from '../../types/Notification';
import NotificationServiceLinkBehaviorGroupToEventType = Operations.NotificationServiceLinkBehaviorGroupToEventType;
import NotificationServiceUnlinkBehaviorGroupFromEventType = Operations.NotificationServiceUnlinkBehaviorGroupFromEventType;

export const linkBehaviorGroupAction = (notificationId: UUID, behaviorGroupId: UUID, linkBehavior: boolean) => {
    if (linkBehavior) {
        return NotificationServiceLinkBehaviorGroupToEventType.actionCreator({
            eventTypeId: notificationId,
            behaviorGroupId
        });
    } else {
        return NotificationServiceUnlinkBehaviorGroupFromEventType.actionCreator({
            eventTypeId: notificationId,
            behaviorGroupId
        });
    }
};
