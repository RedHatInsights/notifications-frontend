import pLimit from 'p-limit';
import * as React from 'react';
import { ClientContext } from 'react-fetching-library';
import { usePrevious } from 'react-use';

import { BehaviorGroupNotificationRow } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { getBehaviorGroupByNotificationAction } from '../../../services/Notifications/GetBehaviorGroupByNotificationId';
import { toBehaviorGroup } from '../../../types/adapters/BehaviorGroupAdapter';
import { Notification, UUID } from '../../../types/Notification';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

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
                console.log('notificationID', notificationId);
                limit(() => query(getBehaviorGroupByNotificationAction(notificationId))).then(response => {
                    if (response.payload?.status === 200) {
                        setNotificationRowById(notificationId, {
                            loadingActionStatus: 'done',
                            behaviors: response.payload.value.map(toBehaviorGroup)
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
        rows: notificationRows
    };
};
