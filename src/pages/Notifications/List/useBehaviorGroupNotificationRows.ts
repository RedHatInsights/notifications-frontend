import produce, { castDraft } from 'immer';
import pLimit from 'p-limit';
import * as React from 'react';
import { ClientContext } from 'react-fetching-library';
import { usePrevious } from 'react-use';

import { getBehaviorGroupByNotificationAction } from '../../../services/Notifications/GetBehaviorGroupByNotificationId';
import { linkBehaviorGroupAction } from '../../../services/Notifications/LinkBehaviorGroup';
import { toBehaviorGroup } from '../../../types/adapters/BehaviorGroupAdapter';
import { BehaviorGroup, Notification, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import * as Arrays from '../../../utils/Arrays';
import { findById } from '../../../utils/Find';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export type BehaviorGroupNotificationRow = NotificationBehaviorGroup & {
    readonly loadingActionStatus: 'loading' | 'done' | 'error';
    readonly behaviors: ReadonlyArray<BehaviorGroup>;
} & (
    {
        readonly isEditMode: false;
    } |
    {
        readonly isEditMode: true;
        readonly oldBehaviors: ReadonlyArray<BehaviorGroup>;
    }
);

const getNotification = <T extends ReadonlyArray<BehaviorGroupNotificationRow>>(
    rows: T,
    notificationId: UUID): T[number] => {
    const notification = rows.find(findById(notificationId));
    if (!notification) {
        throw new Error('Notification not found in rows');
    }

    return notification;
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
        if (linkBehavior) {
            setNotificationRows(produce(draft => {
                const notification = getNotification(draft, notificationId);
                notification.behaviors.push({
                    ...castDraft(behaviorGroup)
                });
            }));
        } else {
            removeBehaviorGroup(notificationId, behaviorGroup.id);
        }
    }, [ removeBehaviorGroup, setNotificationRows ]);

    const setEditMode = React.useCallback(async (notificationId: UUID, command: 'edit' | 'finish' | 'cancel') => {

        if (command === 'finish') {
            const notification = getNotification(notificationRows, notificationId);
            if (notification.isEditMode) {
                setNotificationRows(produce(draft => {
                    const draftNotification = getNotification(draft, notificationId);
                    draftNotification.loadingActionStatus = 'loading';
                }));

                const oldIds = notification.oldBehaviors.map(b => b.id);
                const newIds = notification.behaviors.map(b => b.id);

                const toRemove = Arrays.diff(oldIds, newIds);
                const toAdd = Arrays.diff(newIds, oldIds);

                await Promise.all(
                    toRemove.map(id => query(linkBehaviorGroupAction(notificationId, id, false)))
                    .concat(toAdd.map(id => query(linkBehaviorGroupAction(notificationId, id, true))))
                );
                // Todo: Check status and show a fail depending on the outcome

                setNotificationRows(produce(draft => {
                    const draftNotification = getNotification(draft, notificationId);
                    draftNotification.loadingActionStatus = 'done';
                }));
            }
        }

        setNotificationRows(produce(draft => {
            const notification = getNotification(draft, notificationId);

            if (notification.isEditMode && command === 'cancel') {
                notification.behaviors = notification.oldBehaviors;
            }

            notification.isEditMode = command === 'edit';
            if (notification.isEditMode) {
                notification.oldBehaviors = notification.behaviors;
            }
        }));
    }, [ setNotificationRows, notificationRows, query ]);

    const startEditMode = React.useCallback((notificationId: UUID) => {
        setEditMode(notificationId, 'edit');
    }, [ setEditMode ]);

    const finishEditMode = React.useCallback((notificationId: UUID) => {
        setEditMode(notificationId, 'finish');
    }, [ setEditMode ]);

    const cancelEditMode = React.useCallback((notificationId: UUID) => {
        setEditMode(notificationId, 'cancel');
    }, [ setEditMode ]);

    React.useEffect(() => {
        if (notifications !== prevNotificationInput) {
            setNotificationRows(_prev => notifications.map(notification => ({
                ...notification,
                loadingActionStatus: 'loading',
                behaviors: [],
                isEditMode: false
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
        startEditMode,
        finishEditMode,
        cancelEditMode
    };
};
