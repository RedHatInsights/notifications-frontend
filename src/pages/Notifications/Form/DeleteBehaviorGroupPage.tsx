import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useEffect } from 'react';

import {
  BehaviorGroupDeleteModal,
  BehaviorGroupDeleteModalSkeleton,
} from '../../../components/Notifications/BehaviorGroup/BehaviorGroupDeleteModal';
import { useDeleteBehaviorGroupMutation } from '../../../services/Notifications/DeleteBehaviorGroup';
import { useGetAffectedNotificationsByBehaviorGroupQuery } from '../../../services/Notifications/GetAffectedNotificationsByBehaviorGroup';
import { BehaviorGroup } from '../../../types/Notification';
import { useNotification } from '../../../utils/AlertUtils';

const messages = defineMessages({
  deleteSuccessTitle: {
    id: 'behaviorGroup.delete.successTitle',
    defaultMessage: 'Behavior group deleted',
  },
  deleteSuccessBody: {
    id: 'behaviorGroup.delete.successBody',
    defaultMessage: 'Group {name} deleted successfully.',
  },
  deleteFailTitle: {
    id: 'behaviorGroup.delete.failTitle',
    defaultMessage: 'Behavior group failed to be deleted',
  },
  deleteFailBody: {
    id: 'behaviorGroup.delete.failBody',
    defaultMessage: 'Failed to delete group {name}. Please try again.',
  },
  eventsFailTitle: {
    id: 'behaviorGroup.delete.eventsFailTitle',
    defaultMessage: 'Associated events failed to load',
  },
  eventsFailBody: {
    id: 'behaviorGroup.delete.eventsFailBody',
    defaultMessage: 'Failed to load associated events for group {name}. Please try again.',
  },
});

export interface DeleteBehaviorGroupPageProps {
  behaviorGroup: BehaviorGroup;
  onClose: (deleted: boolean) => void;
}

export const DeleteBehaviorGroupPage: React.FunctionComponent<DeleteBehaviorGroupPageProps> = (
  props
) => {
  const deleteBehaviorGroup = useDeleteBehaviorGroupMutation();
  const affected = useGetAffectedNotificationsByBehaviorGroupQuery(props.behaviorGroup.id);
  const { addDangerNotification, addSuccessNotification } = useNotification();
  const intl = useIntl();

  const onDelete = React.useCallback(
    async (behaviorGroup: BehaviorGroup) => {
      const mutate = deleteBehaviorGroup.mutate;
      const response = await mutate(behaviorGroup.id);

      if (response.payload?.status === 200) {
        addSuccessNotification(
          intl.formatMessage(messages.deleteSuccessTitle),
          <FormattedMessage
            {...messages.deleteSuccessBody}
            values={{ name: <b>{behaviorGroup.displayName}</b> }}
          />
        );
        return true;
      }

      addDangerNotification(
        intl.formatMessage(messages.deleteFailTitle),
        <FormattedMessage
          {...messages.deleteFailBody}
          values={{ name: <b>{behaviorGroup.displayName}</b> }}
        />
      );

      return false;
    },
    [deleteBehaviorGroup.mutate, addDangerNotification, addSuccessNotification, intl]
  );

  useEffect(() => {
    const payload = affected.payload;
    const onClose = props.onClose;
    if (payload && payload.status !== 200) {
      addDangerNotification(
        intl.formatMessage(messages.eventsFailTitle),
        <FormattedMessage
          {...messages.eventsFailBody}
          values={{ name: <b>{props.behaviorGroup.displayName}</b> }}
        />
      );

      onClose(false);
    }
  }, [addDangerNotification, affected.payload, props.behaviorGroup, props.onClose, intl]);

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
