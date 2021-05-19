import pLimit from 'p-limit';
import * as React from 'react';
import { ClientContext } from 'react-fetching-library';
import { usePrevious } from 'react-use';

import { getBehaviorGroupByNotificationAction } from '../../../services/Notifications/GetBehaviorGroupByNotificationId';
import { linkBehaviorGroupAction } from '../../../services/Notifications/LinkBehaviorGroup';
import { toBehaviorGroup } from '../../../types/adapters/BehaviorGroupAdapter';
import { BehaviorGroup, Notification, NotificationBehaviorGroup, UUID } from '../../../types/Notification';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export interface BehaviorGroupRowElement extends BehaviorGroup {
    isLoading: boolean;
}

export interface BehaviorGroupNotificationRow extends NotificationBehaviorGroup {
    loadingActionStatus: 'loading' | 'done' | 'error';
    behaviors?: Array<BehaviorGroupRowElement>;
}

export const useBehaviorGroupNotificationRows = (notifications: Array<Notification>) => {
    const [ notificationRows, setNotificationRows ] = React.useState<Array<BehaviorGroupNotificationRow>>([]);
    const prevNotificationInput = usePrevious(notifications);
    const { query } = React.useContext(ClientContext);
    const [ limit ] = React.useState<pLimit.Limit>(() => pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS));

    const setNotificationRowById = React.useCallback((notificationId: UUID, partial: Partial<BehaviorGroupNotificationRow>) => {
        setNotificationRows(prev => {
            const index = prev.findIndex(n => n.id === notificationId);
            const newNotifications = [ ...prev ];
            newNotifications[index] = {
                ...newNotifications[index],
                ...partial
            };

            return newNotifications;
        });
    }, [ setNotificationRows ]);

    const getPath = React.useCallback((rows: Array<BehaviorGroupNotificationRow>, notificationId: UUID, behaviorGroupId: UUID) => {
        const notificationIndex = rows.findIndex(n => n.id === notificationId);
        if (notificationIndex === -1) {
            return [ -1, -1 ];
        }

        const behaviorGroupIndex = rows[notificationIndex].behaviors?.findIndex(bg => bg.id === behaviorGroupId) ?? -1;

        return [ notificationIndex, behaviorGroupIndex ];
    }, []);

    const setBehaviorGroupStatus = React.useCallback((notificationId: UUID, behaviorGroupId: UUID, isLoading: boolean) => {
        setNotificationRows(prev => {
            const [ notificationIndex, behaviorGroupIndex ] = getPath(prev, notificationId, behaviorGroupId);

            const newNotifications = [ ...prev ];
            newNotifications[notificationIndex] = {
                ...newNotifications[notificationIndex]
            };

            const behaviorGroups = newNotifications[notificationIndex].behaviors as Array<BehaviorGroupRowElement>;

            behaviorGroups[behaviorGroupIndex] = {
                ...behaviorGroups[behaviorGroupIndex],
                isLoading
            };

            return newNotifications;
        });
    }, [ setNotificationRows, getPath ]);

    const addLoadingBehaviorGroup = React.useCallback((notificationId: UUID, behaviorGroup: BehaviorGroup) => {
        setNotificationRows(prev => {
            const [
                notificationIndex,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ..._rest
            ] = getPath(prev, notificationId, '');

            const newNotifications = [ ...prev ];
            newNotifications[notificationIndex] = {
                ...newNotifications[notificationIndex],
                behaviors: [
                    ...(newNotifications[notificationIndex].behaviors ?? []),
                    {
                        ...behaviorGroup,
                        isLoading: true
                    }
                ]
            };

            return newNotifications;
        });
    }, [ setNotificationRows, getPath ]);

    const removeBehaviorGroup = React.useCallback((notificationId: UUID, behaviorGroupId: UUID) => {
        setNotificationRows(prev => {
            const [ notificationIndex, behaviorIndex ] = getPath(prev, notificationId, behaviorGroupId);

            if (behaviorIndex === -1) {
                return prev;
            }

            const newNotifications = [ ...prev ];

            const behaviors = newNotifications[notificationIndex].behaviors as Array<BehaviorGroupRowElement>;

            newNotifications[notificationIndex] = {
                ...newNotifications[notificationIndex],
                behaviors: [ ...behaviors.slice(0, behaviorIndex), ...behaviors.slice(behaviorIndex + 1, behaviors.length)  ]
            };

            return newNotifications;
        });
    }, [ getPath, setNotificationRows ]);

    const updateBehaviorGroupLink = React.useCallback((notificationId: UUID, behaviorGroup: BehaviorGroup, linkBehavior: boolean) => {
        let needsUpdate = false;
        if (!linkBehavior) {
            const [ notificationIndex, behaviorGroupIndex ] = getPath(notificationRows, notificationId, behaviorGroup.id);
            if (behaviorGroupIndex !== -1) {
                const behaviors = notificationRows[notificationIndex].behaviors;
                if (behaviors && !behaviors[behaviorGroupIndex].isLoading) {
                    setBehaviorGroupStatus(notificationId, behaviorGroup.id, true);
                    needsUpdate = true;
                }
            }
        } else {
            const [ notificationIndex, behaviorGroupIndex ] = getPath(notificationRows, notificationId, behaviorGroup.id);
            if (behaviorGroupIndex === -1 && notificationIndex !== -1) {
                addLoadingBehaviorGroup(notificationId, behaviorGroup);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            query(linkBehaviorGroupAction(notificationId, behaviorGroup.id, linkBehavior)).then(result => {
                if (result.payload?.status === 200) {
                    setBehaviorGroupStatus(notificationId, behaviorGroup.id, false);
                } else if (result.payload?.status === 204) {
                    removeBehaviorGroup(notificationId, behaviorGroup.id);
                } else {
                    // TODO: Show error if this fails
                }
            });
        }
    }, [ addLoadingBehaviorGroup, getPath, notificationRows, query, setBehaviorGroupStatus, removeBehaviorGroup ]);

    React.useEffect(() => {
        if (notifications !== prevNotificationInput) {
            setNotificationRows(_prev => notifications.map(notification => ({
                ...notification,
                loadingActionStatus: 'loading',
                behaviors: []
            })));
        }

        if (notifications) {
            limit.clearQueue();

            notifications.map(notification => notification.id).forEach(notificationId => {
                limit(() => query(getBehaviorGroupByNotificationAction(notificationId))).then(response => {
                    if (response.payload?.status === 200) {
                        setNotificationRowById(notificationId, {
                            loadingActionStatus: 'done',
                            behaviors: response.payload.value.map(toBehaviorGroup).map(bg => ({ ...bg, isLoading: false }))
                        });
                    } else {
                        setNotificationRowById(notificationId, {
                            loadingActionStatus: 'error',
                            behaviors: []
                        });
                    }
                });
            });
        }

    }, [ notifications, limit, query, setNotificationRowById, prevNotificationInput ]);

    return {
        rows: notificationRows,
        updateBehaviorGroupLink
    };
};
