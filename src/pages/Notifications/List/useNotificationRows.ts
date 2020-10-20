import { Notification } from '../../../types/Notification';
import { default as React, useCallback, useContext, useEffect, useState } from 'react';
import {
    NotificationRowGroupedByApplication,
    NotificationRowGroupedByNone,
    NotificationRows
} from '../../../components/Notifications/Table';
import { usePrevious } from 'react-use';
import { ClientContext } from 'react-fetching-library';
import pLimit from 'p-limit';
import { GroupByEnum } from '../../../components/Notifications/Types';
import { assertNever } from 'assert-never';
import { getNotificationActionsByIdAction } from '../../../services/useGetNotificationActions';
import { toActions } from '../../../types/adapters/NotificationAdapter';
import { EndpointType } from '../../../generated/Openapi';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

const toRowsGroupByNone = (notification: Notification): NotificationRowGroupedByNone => ({
    loadingActionStatus: 'loading',
    ...notification
});

const findNotificationPath = (rows: Array<NotificationRowGroupedByApplication>, id: number): [number, number] => {
    for (let i = 0; i < rows.length; ++i) {
        for (let j = 0; j < rows[i].notifications.length; ++j) {
            if (rows[i].notifications[j].id === id) {
                return [ i, j ];
            }
        }
    }

    return [ -1, -1 ];
};

const toRowGroupByApplication = (notifications: Array<Notification>): Array<NotificationRowGroupedByApplication> => {
    const grouped = notifications.reduce((groups, notification) => {
        if (!groups[notification.application]) {
            groups[notification.application] = {
                application: notification.application,
                isOpen: true,
                notifications: []
            };
        }

        groups[notification.application].notifications.push(toRowsGroupByNone(notification));
        return groups;
    }, {} as Record<string, NotificationRowGroupedByApplication>);

    return Object.values(grouped);
};

export const useNotificationRows = (notifications: Array<Notification>, groupBy: GroupByEnum) => {

    const [ notificationRows, setNotificationRows ] = useState<NotificationRows>({
        data: [],
        grouped: GroupByEnum.Application
    });
    const prevNotificationInput = usePrevious(notifications);
    const prevGroupBy = usePrevious(groupBy);
    const { query } = useContext(ClientContext);
    const [ limit ] = useState<pLimit.Limit>(() => pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS));

    const setNotificationRowById = useCallback((id: number, partialNotificationRow: Partial<NotificationRowGroupedByNone>) => {
        setNotificationRows(prev => {
            if (prev.grouped === GroupByEnum.Application) {
                const [ appIndex, notificationIndex ] = findNotificationPath(prev.data, id);

                if (appIndex === -1) {
                    return prev;
                }

                const newApps: Array<NotificationRowGroupedByApplication> = [ ...prev.data ];
                newApps[appIndex] = { ...newApps[appIndex], notifications: [ ...newApps[appIndex].notifications ]};
                newApps[appIndex].notifications[notificationIndex] = {
                    ...newApps[appIndex].notifications[notificationIndex],
                    ...partialNotificationRow
                };

                return {
                    ...prev,
                    data: newApps
                };
            } else if (prev.grouped === GroupByEnum.None) {
                const index = prev.data.findIndex(n => n.id === id);
                if (index === -1) {
                    return prev;
                }

                const newNotifications = [ ...prev.data ];
                newNotifications[index] = { ...newNotifications[index], ...partialNotificationRow };
                return {
                    ...prev,
                    data: newNotifications
                };
            } else {
                assertNever(prev);
            }
        });
    }, [ setNotificationRows ]);

    useEffect(() => {
        if (notifications !== prevNotificationInput || groupBy !== prevGroupBy) {
            setNotificationRows(_prev => {
                switch (groupBy) {
                    case GroupByEnum.None:
                        return {
                            grouped: GroupByEnum.None,
                            data: notifications.map(toRowsGroupByNone)
                        };
                    case GroupByEnum.Application:
                        return {
                            grouped: GroupByEnum.Application,
                            data: toRowGroupByApplication(notifications)
                        };
                    default:
                        assertNever(groupBy);
                }
            });

            if (notifications) {
                limit.clearQueue();

                notifications.map(notification => notification.id).forEach(notificationId => {
                    limit(() => query(getNotificationActionsByIdAction(notificationId))).then(response => {
                        if (response.payload && response.payload.status === 200) {
                            setNotificationRowById(notificationId, {
                                loadingActionStatus: 'done',
                                actions: toActions(response.payload.value),
                                useDefault: response.payload.value.findIndex(a => a.type === EndpointType.enum.default) !== -1
                            });
                        } else {
                            setNotificationRowById(notificationId, {
                                loadingActionStatus: 'error',
                                actions: []
                            });
                        }
                    });
                });
            }
        }
    }, [ groupBy, prevGroupBy, notifications, prevNotificationInput, limit, query, setNotificationRowById ]);

    const onCollapse = React.useCallback((index: number, isOpen: boolean) => {
        setNotificationRows(prevRows => {
            switch (prevRows.grouped) {
                case GroupByEnum.None:
                    throw new Error('On collapse is not valid for group: None');
                case GroupByEnum.Application:
                    const data = [
                        ...prevRows.data
                    ];

                    data[index] = {
                        ...data[index],
                        isOpen
                    };

                    return {
                        ...prevRows,
                        data
                    };
                default:
                    assertNever(prevRows);
            }
        });
    }, [ setNotificationRows ]);

    return {
        rows: notificationRows,
        onCollapse
    };
};
