import produce, { castDraft } from 'immer';
import pLimit from 'p-limit';
import * as React from 'react';
import { ClientContext } from 'react-fetching-library';
import { usePrevious } from 'react-use';

import { getBehaviorGroupByNotificationAction } from '../../../services/Notifications/GetBehaviorGroupByNotificationId';
import { linkBehaviorGroupAction } from '../../../services/Notifications/LinkBehaviorGroup';
import { toBehaviorGroup } from '../../../types/adapters/BehaviorGroupAdapter';
import { BehaviorGroup, Notification, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import { findById } from '../../../utils/Find';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export interface BehaviorGroupRowElement extends BehaviorGroup {
    readonly isLoading: boolean;
}

export interface BehaviorGroupNotificationRow extends NotificationBehaviorGroup {
    readonly loadingActionStatus: 'loading' | 'done' | 'error';
    readonly isReadOnly: boolean;
    readonly behaviors: ReadonlyArray<BehaviorGroupRowElement>;
}

const getNotification = <T extends ReadonlyArray<BehaviorGroupNotificationRow>>(
    rows: T,
    notificationId: UUID): T[number] => {
    const notification = rows.find(findById(notificationId));
    if (!notification) {
        throw new Error('Notification not found in rows');
    }

    return notification;
};

const getBehaviorGroup = <T extends ReadonlyArray<BehaviorGroupNotificationRow>>(
    rows: T,
    notificationId: UUID,
    behaviorGroupId: UUID): T[number]['behaviors'][number] => {

    const notification = getNotification(rows, notificationId);
    const behavior = notification.behaviors.find(findById(behaviorGroupId));
    if (!behavior) {
        throw new Error('Behavior group not found in rows');
    }

    return behavior;
};

export const useBehaviorGroupNotificationRows = (notifications: Array<Notification>) => {
    const [ notificationRows, setNotificationRows ] = React.useState<Array<BehaviorGroupNotificationRow>>([]);
    const prevNotificationInput = usePrevious(notifications);
    const { query } = React.useContext(ClientContext);
    const [ limit ] = React.useState<pLimit.Limit>(() => pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS));

    const removeBehaviorGroup = React.useCallback((notificationId: UUID, behaviorGroupId: UUID) => {
        setNotificationRows(produce(draft => {
            const notification = getNotification(draft, notificationId);
            const index = notification.behaviors.findIndex(findById(behaviorGroupId));
            if (index === -1) {
                throw new Error('Behavior group not found in rows');
            }

            notification.behaviors.splice(index, 1);
        }));
    }, [ setNotificationRows ]);

    const updateBehaviorGroupLink = React.useCallback((notificationId: UUID, behaviorGroup: BehaviorGroup, linkBehavior: boolean) => {
        if (!linkBehavior) {
            // Unlink, means that the behaviorGroup is there.
            setNotificationRows(produce(draft => {
                const behaviorGroupDraft = getBehaviorGroup(draft, notificationId, behaviorGroup.id);
                behaviorGroupDraft.isLoading = true;
            }));
        } else {
            setNotificationRows(produce(draft => {
                const notification = getNotification(draft, notificationId);
                notification.behaviors.push({
                    ...castDraft(behaviorGroup),
                    isLoading: true
                });
            }));
        }

        query(linkBehaviorGroupAction(notificationId, behaviorGroup.id, linkBehavior)).then(result => {
            if (result.payload?.status === 200) {
                setNotificationRows(produce(draft => {
                    getBehaviorGroup(draft, notificationId, behaviorGroup.id).isLoading = false;
                }));
            } else if (result.payload?.status === 204) {
                removeBehaviorGroup(notificationId, behaviorGroup.id);
            } else {
                // TODO: Show error if this fails
            }
        });
    }, [ query, removeBehaviorGroup, setNotificationRows ]);

    const setReadOnly = React.useCallback((notificationId: UUID, isReadOnly: boolean) => {
        setNotificationRows(produce(draft => {
            const notification = getNotification(draft, notificationId);
            notification.isReadOnly = isReadOnly;
            console.log('set notification', notification);
        }));
    }, [ setNotificationRows ]);

    console.log(notificationRows);

    React.useEffect(() => {
        if (notifications !== prevNotificationInput) {
            setNotificationRows(_prev => notifications.map(notification => ({
                ...notification,
                loadingActionStatus: 'loading',
                behaviors: [],
                isReadOnly: true
            })));
        }

        if (notifications) {
            limit.clearQueue();

            notifications.map(notification => notification.id).forEach(notificationId => {
                limit(() => query(getBehaviorGroupByNotificationAction(notificationId))).then(response => {
                    setNotificationRows(produce(draft => {
                        const draftNotification = getNotification(draft, notificationId);
                        if (response.payload?.status === 200) {
                            draftNotification.loadingActionStatus = 'done';
                            draftNotification.behaviors = response.payload.value.map(toBehaviorGroup).map(bg => ({
                                ...bg,
                                isLoading: false,
                                actions: castDraft(bg.actions)
                            }));
                        } else {
                            draftNotification.loadingActionStatus = 'error';
                            draftNotification.behaviors = [];
                        }
                    }));
                });
            });
        }

    }, [ notifications, limit, query, prevNotificationInput, setNotificationRows ]);

    return {
        rows: notificationRows,
        updateBehaviorGroupLink,
        setReadOnly
    };
};
