import produce, { Draft, original } from 'immer';
import * as React from 'react';
import { useMemo } from 'react';

import { useRbacGroups } from '../../../app/rbac/RbacGroupContext';
import { useGetBehaviorGroups } from '../../../services/Notifications/GetBehaviorGroups';
import { ActionNotify, BehaviorGroup, isActionNotify, UUID } from '../../../types/Notification';
import { NotificationRbacGroupRecipient } from '../../../types/Recipient';

export type BehaviorGroupContent = {
    isLoading: true;
    reload: () => void;
} | {
    isLoading: false;
    hasError: true;
    error: string;
    reload: () => void;
} | {
    isLoading: false;
    hasError: false;
    content: ReadonlyArray<BehaviorGroup>;
    reload: () => void;
}

export const useBehaviorGroupContent = (bundleId: UUID) => {
    const behaviorGroups = useGetBehaviorGroups(bundleId);
    const { groups, isLoading: isLoadingGroups } = useRbacGroups();

    const result = React.useMemo<BehaviorGroupContent>(() => {
        const payload = behaviorGroups.payload;
        const error = behaviorGroups.errorObject;
        const loading = behaviorGroups.loading;
        const reload = behaviorGroups.query;

        if (loading) {
            return {
                isLoading: true,
                reload
            };
        }

        if (payload?.status === 200) {
            return {
                isLoading: false,
                hasError: false,
                content: payload.value,
                reload
            };
        }

        return {
            isLoading: false,
            hasError: true,
            error: error.toString(),
            reload
        };

    }, [ behaviorGroups.payload, behaviorGroups.loading, behaviorGroups.errorObject, behaviorGroups.query ]);

    return useMemo(() => {
        if (!result.isLoading && !result.hasError) {
            console.log('transforming');
            return produce(result, draft => {
                const originalValues = original(draft);
                if (originalValues) {
                    originalValues.content
                    .forEach((bg, bgIndex) => bg.actions.forEach((a, aIndex) => {
                        if (isActionNotify(a)) {
                            a.recipient.forEach((recipient, recipientIndex) => {
                                if (recipient instanceof NotificationRbacGroupRecipient && recipient.isLoading) {
                                    console.log('found');
                                    const recipients = (draft.content[bgIndex].actions[aIndex] as Draft<ActionNotify>).recipient;
                                    const rbacRecipient = recipients[recipientIndex] as NotificationRbacGroupRecipient;
                                    console.log(rbacRecipient.groupId);
                                    console.log(groups);
                                    recipients[recipientIndex] = new NotificationRbacGroupRecipient(
                                        rbacRecipient.integrationId,
                                        rbacRecipient.groupId,
                                        groups.find(g => g.id === rbacRecipient.groupId)?.name || !isLoadingGroups
                                    );
                                }
                            });
                        }
                    }));
                }
            });
        }

        return result;
    }, [ result, groups ]);
};
