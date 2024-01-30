import * as React from 'react';
import { useEffect } from 'react';

import {
  BehaviorGroupDeleteModal,
  BehaviorGroupDeleteModalSkeleton,
} from '../../../components/Notifications/BehaviorGroup/BehaviorGroupDeleteModal';
import { useDeleteBehaviorGroupMutation } from '../../../services/Notifications/DeleteBehaviorGroup';
import { useGetAffectedNotificationsByBehaviorGroupQuery } from '../../../services/Notifications/GetAffectedNotificationsByBehaviorGroup';
import { BehaviorGroup } from '../../../types/Notification';
import { useNotification } from '../../../utils/AlertUtils';

export interface DeleteBehaviorGroupPageProps {
  behaviorGroup: BehaviorGroup;
  onClose: (deleted: boolean) => void;
}

export const DeleteBehaviorGroupPage: React.FunctionComponent<
  DeleteBehaviorGroupPageProps
> = (props) => {
  const deleteBehaviorGroup = useDeleteBehaviorGroupMutation();
  const affected = useGetAffectedNotificationsByBehaviorGroupQuery(
    props.behaviorGroup.id
  );
  const { addDangerNotification, addSuccessNotification } = useNotification();

  const onDelete = React.useCallback(
    async (behaviorGroup: BehaviorGroup) => {
      const mutate = deleteBehaviorGroup.mutate;
      const response = await mutate(behaviorGroup.id);

      if (response.payload?.status === 200) {
        addSuccessNotification(
          'Behavior group deleted',
          <>
            Group <b>{behaviorGroup.displayName}</b> deleted successfully.
          </>
        );
        return true;
      }

      addDangerNotification(
        'Behavior group failed to be deleted',
        <>
          Failed to delete group <b> {behaviorGroup.displayName}</b>.
          <br />
          Please try again.
        </>
      );

      return false;
    },
    [deleteBehaviorGroup.mutate, addDangerNotification, addSuccessNotification]
  );

  useEffect(() => {
    const payload = affected.payload;
    const onClose = props.onClose;
    if (payload && payload.status !== 200) {
      addDangerNotification(
        'Associated events failed to load ',
        <>
          Failed to load associated events for group{' '}
          <b> {props.behaviorGroup.displayName}</b>.
          <br />
          Please try again.
        </>
      );

      onClose(false);
    }
  }, [
    addDangerNotification,
    affected.payload,
    props.behaviorGroup,
    props.onClose,
  ]);

  if (affected.loading) {
    return <BehaviorGroupDeleteModalSkeleton onClose={props.onClose} />;
  }

  if (affected.payload?.status !== 200) {
    return null;
  }

  return (
    <BehaviorGroupDeleteModal
      onDelete={onDelete}
      isDeleting={deleteBehaviorGroup.loading}
      onClose={props.onClose}
      behaviorGroup={props.behaviorGroup}
      conflictingNotifications={affected.payload.value}
    />
  );
};
