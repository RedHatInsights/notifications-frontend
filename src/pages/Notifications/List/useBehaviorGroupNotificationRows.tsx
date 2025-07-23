import produce, { castDraft } from 'immer';
import * as React from 'react';
import { ClientContext } from 'react-fetching-library';
import { usePrevious } from 'react-use';

import { linkBehaviorGroupAction } from '../../../services/Notifications/LinkBehaviorGroup';
import {
  BehaviorGroup,
  Notification,
  NotificationBehaviorGroup,
  UUID,
} from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { useNotification } from '../../../utils/AlertUtils';

export type BehaviorGroupNotificationRow = NotificationBehaviorGroup & {
  readonly loadingActionStatus: 'loading' | 'done' | 'error';
  readonly behaviors: ReadonlyArray<BehaviorGroup>;
} & (
    | {
        readonly isEditMode: false;
      }
    | {
        readonly isEditMode: true;
        readonly oldBehaviors: ReadonlyArray<BehaviorGroup>;
      }
  );

class NotificationNotFound extends Error {}

const getNotification = <T extends ReadonlyArray<BehaviorGroupNotificationRow>>(
  rows: T,
  notificationId: UUID
): T[number] => {
  // eslint-disable-next-line testing-library/await-async-queries
  const notification = rows.find(findById(notificationId));
  if (!notification) {
    throw new NotificationNotFound('Notification not found in rows');
  }

  return notification;
};

export const useBehaviorGroupNotificationRows = (
  notifications: Array<Notification>,
  behaviorGroups: ReadonlyArray<BehaviorGroup> | undefined
) => {
  const { addDangerNotification } = useNotification();
  const [notificationRows, setNotificationRows] = React.useState<
    Array<BehaviorGroupNotificationRow>
  >([]);
  const prevNotificationInput = usePrevious(notifications);
  const { query } = React.useContext(ClientContext);

  const removeBehaviorGroup = React.useCallback(
    (notificationId: UUID, behaviorGroupId: UUID) => {
      setNotificationRows(
        produce((draft) => {
          const notification = getNotification(draft, notificationId);
          const index = notification.behaviors.findIndex(
            // eslint-disable-next-line testing-library/await-async-queries
            findById(behaviorGroupId)
          );
          if (index === -1) {
            throw new Error('Behavior group not found in rows');
          }

          notification.behaviors.splice(index, 1);
        })
      );
    },
    [setNotificationRows]
  );

  const updateBehaviorGroups = React.useCallback(
    (behaviorGroups: ReadonlyArray<BehaviorGroup>) => {
      setNotificationRows(
        produce((draft) => {
          for (const content of draft) {
            // content.behaviors = castDraft(content.behaviors.map(ob => behaviorGroups.find(nb => nb.id === ob.id) || ob));
            // Find if there are new behaviors for this type.
            content.behaviors = [];
            behaviorGroups.forEach((behaviorGroup) => {
              if (behaviorGroup.events.find((e) => e.id === content.id)) {
                content.behaviors.push(castDraft(behaviorGroup));
              }
            });
          }
        })
      );
    },
    [setNotificationRows]
  );

  const updateBehaviorGroupLink = React.useCallback(
    (
      notificationId: UUID,
      behaviorGroup: BehaviorGroup,
      linkBehavior: boolean
    ) => {
      if (linkBehavior) {
        setNotificationRows(
          produce((draft) => {
            const notification = getNotification(draft, notificationId);
            notification.behaviors.push({
              ...castDraft(behaviorGroup),
            });
          })
        );
      } else {
        removeBehaviorGroup(notificationId, behaviorGroup.id);
      }
    },
    [removeBehaviorGroup, setNotificationRows]
  );

  const setEditMode = React.useCallback(
    async (notificationId: UUID, command: 'edit' | 'finish' | 'cancel') => {
      if (command === 'finish') {
        const notification = getNotification(notificationRows, notificationId);
        if (notification.isEditMode) {
          setNotificationRows(
            produce((draft) => {
              const draftNotification = getNotification(draft, notificationId);
              draftNotification.loadingActionStatus = 'loading';
            })
          );

          const response = await query(
            linkBehaviorGroupAction(
              notificationId,
              notification.behaviors.map((b) => b.id)
            )
          );
          if (response.payload?.status === 200) {
            setNotificationRows(
              produce((draft) => {
                const draftNotification = getNotification(
                  draft,
                  notificationId
                );
                draftNotification.isEditMode = false;
                draftNotification.loadingActionStatus = 'done';
              })
            );
          } else {
            addDangerNotification(
              'Saving behavior',
              <>
                There was an error saving the behavior of{' '}
                <b>
                  {notification.applicationDisplayName} -{' '}
                  {notification.eventTypeDisplayName}
                </b>
                .
              </>
            );
            setNotificationRows(
              produce((draft) => {
                const draftNotification = getNotification(
                  draft,
                  notificationId
                );
                draftNotification.isEditMode = true;
                draftNotification.loadingActionStatus = 'done';
              })
            );
          }
        }
      } else {
        setNotificationRows(
          produce((draft) => {
            const notification = getNotification(draft, notificationId);

            if (notification.isEditMode && command === 'cancel') {
              notification.behaviors = notification.oldBehaviors;
            }

            notification.isEditMode = command === 'edit';
            if (notification.isEditMode) {
              notification.oldBehaviors = notification.behaviors;
            }
          })
        );
      }
    },
    [notificationRows, query, addDangerNotification]
  );

  const startEditMode = React.useCallback(
    (notificationId: UUID) => {
      setEditMode(notificationId, 'edit');
    },
    [setEditMode]
  );

  const finishEditMode = React.useCallback(
    (notificationId: UUID) => {
      setEditMode(notificationId, 'finish');
    },
    [setEditMode]
  );

  const cancelEditMode = React.useCallback(
    (notificationId: UUID) => {
      setEditMode(notificationId, 'cancel');
    },
    [setEditMode]
  );

  React.useEffect(() => {
    if (notifications !== prevNotificationInput) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setNotificationRows((_prev) =>
        notifications.map((notification) => ({
          ...notification,
          loadingActionStatus: 'done',
          behaviors: [],
          isEditMode: false,
        }))
      );

      if (behaviorGroups) {
        updateBehaviorGroups(behaviorGroups);
      }
    }
  }, [
    behaviorGroups,
    notifications,
    prevNotificationInput,
    setNotificationRows,
    updateBehaviorGroups,
  ]);

  return {
    rows: notificationRows,
    updateBehaviorGroupLink,
    updateBehaviorGroups,
    startEditMode,
    finishEditMode,
    cancelEditMode,
  };
};
