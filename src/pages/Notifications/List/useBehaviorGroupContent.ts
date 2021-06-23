import * as React from 'react';

import { useGetBehaviorGroups } from '../../../services/Notifications/GetBehaviorGroups';
import { BehaviorGroup, UUID } from '../../../types/Notification';

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

    return React.useMemo<BehaviorGroupContent>(() => {
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
};
