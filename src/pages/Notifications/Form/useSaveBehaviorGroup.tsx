import produce from 'immer';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';
import { ClientContext, useClient } from 'react-fetching-library';

import { getDefaultSystemEndpointAction } from '../../../services/Integrations/GetDefaultSystemEndpoint';
import { useSaveBehaviorGroupMutation } from '../../../services/Notifications/SaveBehaviorGroup';
import { useUpdateBehaviorGroupActionsMutation } from '../../../services/Notifications/UpdateBehaviorGroupActions';
import { toSystemProperties } from '../../../types/adapters/NotificationAdapter';
import {
    BehaviorGroup, BehaviorGroupRequest,
    isActionIntegration,
    isActionNotify,
    NewBehaviorGroup,
    NotificationType,
    SystemProperties,
    UUID
} from '../../../types/Notification';

const behaviorGroupNeedsUpdate = (original: Partial<BehaviorGroup> | undefined, updated: BehaviorGroupRequest) => {
    return original?.id === undefined || original.displayName !== updated.displayName;
};

const saveBehaviorGroup = async (
    original: Partial<BehaviorGroup> | undefined,
    updated: BehaviorGroupRequest,
    save: ReturnType<typeof useSaveBehaviorGroupMutation>['mutate']
) => {
    // Determine if we need to save the behavior group before updating the actions
    if (behaviorGroupNeedsUpdate(original, updated)) {
        const result = await save(updated);
        if (result.payload?.type === 'BehaviorGroup') {
            return result.payload.value.id;
        } else if (result.payload?.status === 200) {
            return updated.id;
        }

        throw new Error('Behavior group wasn\'t saved');
    } else {
        return updated.id;
    }
};

interface ActionToIdList {
    (actions: BehaviorGroup['actions']): Array<UUID | undefined>;
    (actions: BehaviorGroup['actions'], ids: Array<UUID>): Array<UUID>;
}

const actionsToIdList: ActionToIdList = (actions: BehaviorGroup['actions'], ids?: Array<UUID>) => {
    const remainingIds = ids ? [ ... ids ] as UUID[] : undefined;
    const endpointsToAdd = actions.reduce(
        (toAdd, action) => {
            if (isActionNotify(action)) {
                action.recipient.forEach(recipient => {
                    if (recipient.integrationId) {
                        toAdd.push(recipient.integrationId);
                    } else if (remainingIds === undefined) {
                        toAdd.push(undefined);
                    } else if (remainingIds.length > 0) {
                        toAdd.push(remainingIds.shift() as UUID);
                    } else {
                        throw new Error(`No more ids remaining to assign: actions ${actions} newIds: ${ids}`);
                    }
                });
            } else if (isActionIntegration(action)) {
                toAdd.push(action.integration.id);
            } else {
                throw new Error(`Unknown action type: ${action}`);
            }

            return toAdd;
        },
        [] as Array<UUID | undefined>
    );

    return endpointsToAdd as Array<UUID>;
};

const actionsNeedsUpdate = (
    original: Partial<BehaviorGroup>['actions'] | undefined,
    updated: (BehaviorGroup | NewBehaviorGroup)['actions']
) => {
    return original?.length !== updated?.length || !isEqual(actionsToIdList(original), actionsToIdList(updated));
};

export enum SaveBehaviorGroupResult {
    CREATE,
    UPDATE
}

type SaveActionsResponse = {
    operation: SaveBehaviorGroupResult,
    status: boolean;
}

const saveActions = async (
    behaviorGroupId: UUID | undefined,
    original: Partial<BehaviorGroup>['actions'] | undefined,
    updated: (BehaviorGroup | NewBehaviorGroup)['actions'],
    save: ReturnType<typeof useUpdateBehaviorGroupActionsMutation>['mutate'],
    query: ReturnType<typeof useClient>['query'],
    setFetchingIntegrations: Dispatch<SetStateAction<boolean>>
): Promise<SaveActionsResponse> => {
    if (actionsNeedsUpdate(original, updated)) {
        // Determine what system Integrations we need to fetch
        const toFetch: ReadonlyArray<SystemProperties> = uniqWith(
            ([] as Array<SystemProperties>)
            .concat(...updated.filter(isActionNotify)
            .map(action => produce(action, draft => {
                draft.recipient = draft.recipient.filter(r => !r.integrationId);
            }))
            .map(action => toSystemProperties(action))),
            isEqual
        );

        if (toFetch.find(props => props.type !== NotificationType.EMAIL_SUBSCRIPTION)) {
            throw new Error('Only email subscriptions are created when assigning behavior groups');
        }

        if (toFetch.length > 0) {
            setFetchingIntegrations(true);
        }

        const response = await Promise.all(
            toFetch.map(systemProps => query(getDefaultSystemEndpointAction(systemProps))
            .then(result => result.payload?.type === 'Endpoint' ? result.payload.value.id : undefined)
            )
        ).then(newIds => {
            if (newIds.includes(undefined)) {
                throw new Error('Unexpected ids were returned when querying for system endpoints');
            }

            // We want to preserve the order
            const remainingIds = [ ... newIds ] as UUID[];
            const endpointsToAdd = actionsToIdList(updated, remainingIds);

            return save({
                behaviorGroupId: behaviorGroupId as UUID,
                endpointIds: endpointsToAdd
            });
        });

        if (response.payload?.status === 200) {
            if (behaviorGroupId === undefined) {
                return {
                    operation: SaveBehaviorGroupResult.CREATE,
                    status: true
                };
            } else {
                return {
                    operation: SaveBehaviorGroupResult.UPDATE,
                    status: true
                };
            }
        } else if (behaviorGroupId === undefined) {
            return {
                operation: SaveBehaviorGroupResult.CREATE,
                status: false
            };
        } else {
            return {
                operation: SaveBehaviorGroupResult.UPDATE,
                status: false
            };
        }
    }

    if (behaviorGroupId === undefined) {
        return {
            operation: SaveBehaviorGroupResult.CREATE,
            status: true
        };
    }

    return {
        operation: SaveBehaviorGroupResult.UPDATE,
        status: true
    };
};

export const useSaveBehaviorGroup = (behaviorGroup?: Partial<BehaviorGroup>) => {

    const saveBehaviorGroupMutation = useSaveBehaviorGroupMutation();
    const updateBehaviorGroupActionsMutation = useUpdateBehaviorGroupActionsMutation();
    const { query } = useContext(ClientContext);

    const [ fetchingIntegrations, setFetchingIntegrations ] = useState<boolean>(false);

    const save = useCallback(async (data: BehaviorGroupRequest) => {
        const updateBehaviorGroupActions = updateBehaviorGroupActionsMutation.mutate;

        return saveBehaviorGroup(behaviorGroup, data, saveBehaviorGroupMutation.mutate)
        .then(behaviorGroupId => saveActions(
            behaviorGroupId,
            behaviorGroup?.actions,
            data.actions,
            updateBehaviorGroupActions,
            query,
            setFetchingIntegrations
        )).catch(err => {
            console.error('Error saving behavior groups', err);
            throw err;
        });
    }, [ saveBehaviorGroupMutation.mutate, updateBehaviorGroupActionsMutation.mutate, query, behaviorGroup ]);

    const isSaving = useMemo(() => {
        return fetchingIntegrations || saveBehaviorGroupMutation.loading || updateBehaviorGroupActionsMutation.loading;
    }, [ fetchingIntegrations, saveBehaviorGroupMutation.loading, updateBehaviorGroupActionsMutation.loading ]);

    return {
        save,
        isSaving
    };
};
