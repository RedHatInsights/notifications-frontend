import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
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

class NotificationNotFound extends Error {}

const getNotification = <T extends ReadonlyArray<BehaviorGroupNotificationRow>>(
    rows: T,
    notificationId: UUID): T[number] => {
    const notification = rows.find(findById(notificationId));
    if (!notification) {
        throw new NotificationNotFound('Notification not found in rows');
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

    const updateBehaviorGroups = React.useCallback((behaviorGroups: ReadonlyArray<BehaviorGroup>) => {
        setNotificationRows(produce(draft => {
            for (const content of draft) {
                content.behaviors = castDraft(content.behaviors.map(ob => behaviorGroups.find(nb => nb.id === ob.id) || ob));
            }
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

                const response = await query(linkBehaviorGroupAction(notificationId, notification.behaviors.map(b => b.id)));
                if (response.payload?.status === 200) {
                    setNotificationRows(produce(draft => {
                        const draftNotification = getNotification(draft, notificationId);
                        draftNotification.isEditMode = false;
                        draftNotification.loadingActionStatus = 'done';
                    }));
                } else {
                    addDangerNotification(
                        'Saving behavior',
                        <>
                            There was an error saving the behavior
                             of <b>{notification.applicationDisplayName} - {notification.eventTypeDisplayName}</b>.
                        </>
                    );
                    setNotificationRows(produce(draft => {
                        const draftNotification = getNotification(draft, notificationId);
                        draftNotification.isEditMode = true;
                        draftNotification.loadingActionStatus = 'done';
                    }));
                }
            }
        } else {
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
        }
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

            limit.clearQueue();

            if (notifications) {
                notifications.map(notification => notification.id).forEach(notificationId => {
                    limit(() => query(getBehaviorGroupByNotificationAction(notificationId))).then(response => {
                        setNotificationRows(produce(draft => {
                            try {
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
                            } catch (e) {
                                if (e instanceof NotificationNotFound) {
                                    // swallow exception, we changed the page while loading
                                } else {
                                    throw e;
                                }
                            }
                        }));
                    });
                });
            }
        }

    }, [ notifications, limit, query, prevNotificationInput, setNotificationRows ]);

    return {
        rows: notificationRows,
        updateBehaviorGroupLink,
        updateBehaviorGroups,
        startEditMode,
        finishEditMode,
        cancelEditMode
    };
};
