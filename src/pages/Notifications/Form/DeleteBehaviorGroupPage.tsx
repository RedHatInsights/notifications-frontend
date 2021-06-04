import * as React from 'react';

import {
    BehaviorGroupDeleteModal,
    BehaviorGroupDeleteModalSkeleton
} from '../../../components/Notifications/BehaviorGroup/BehaviorGroupDeleteModal';
import { useDeleteBehaviorGroupMutation } from '../../../services/Notifications/DeleteBehaviorGroup';
import { useGetAffectedNotificationsByBehaviorGroupQuery } from '../../../services/Notifications/GetAffectedNotificationsByBehaviorGroup';
import { BehaviorGroup } from '../../../types/Notification';

export interface DeleteBehaviorGroupPageProps {
    behaviorGroup: BehaviorGroup;
    onClose: (deleted: boolean) => void;
}

export const DeleteBehaviorGroupPage: React.FunctionComponent<DeleteBehaviorGroupPageProps> = props => {

    const deleteBehaviorGroup = useDeleteBehaviorGroupMutation();
    const affected = useGetAffectedNotificationsByBehaviorGroupQuery(props.behaviorGroup.id);

    const onDelete = React.useCallback(async (behaviorGroup: BehaviorGroup) => {
        const mutate = deleteBehaviorGroup.mutate;
        const response = await mutate(behaviorGroup.id);

        if (response.payload?.status === 200) {
            return true;
        }

        return false;
    }, [ deleteBehaviorGroup.mutate ]);

    if (affected.loading) {
        return <BehaviorGroupDeleteModalSkeleton
            onClose={ props.onClose }
        />;
    }

    if (affected.payload?.status !== 200) {
        throw new Error('Error while loading affected notifications');
    }

    return <BehaviorGroupDeleteModal
        onDelete={ onDelete }
        isDeleting={ deleteBehaviorGroup.loading }
        onClose={ props.onClose }
        behaviorGroup={ props.behaviorGroup }
        conflictingNotifications={ affected.payload.value }
    />;
};
