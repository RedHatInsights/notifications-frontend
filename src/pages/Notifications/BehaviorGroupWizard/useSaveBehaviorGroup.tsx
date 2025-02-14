import produce from 'immer';
import { isEqual, uniqWith } from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { ClientContext } from 'react-fetching-library';

import { getDefaultSystemEndpointAction } from '../../../services/Integrations/GetDefaultSystemEndpoint';
import {
  SaveBehaviorGroupRequest,
  useSaveBehaviorGroupMutation,
} from '../../../services/Notifications/SaveBehaviorGroup';
import { toSystemProperties } from '../../../types/adapters/NotificationAdapter';
import {
  BehaviorGroup,
  BehaviorGroupRequest,
  NotificationType,
  SystemProperties,
  UUID,
  areActionsEqual,
  isActionIntegration,
  isActionNotify,
} from '../../../types/Notification';

interface ActionToIdList {
  (actions: BehaviorGroup['actions']): Array<UUID | undefined>;
  (actions: BehaviorGroup['actions'], ids: Array<UUID>): Array<UUID>;
}

const actionsToIdList: ActionToIdList = (
  actions: BehaviorGroup['actions'],
  ids?: Array<UUID>
) => {
  const remainingIds = ids ? ([...ids] as UUID[]) : undefined;
  const endpointsToAdd = actions.reduce((toAdd, action) => {
    if (isActionNotify(action)) {
      action.recipient.forEach((recipient) => {
        if (recipient.integrationId) {
          toAdd.push(recipient.integrationId);
        } else if (remainingIds === undefined) {
          toAdd.push(undefined);
        } else if (remainingIds.length > 0) {
          toAdd.push(remainingIds.shift() as UUID);
        } else {
          throw new Error(
            `No more ids remaining to assign: actions ${actions} newIds: ${ids}`
          );
        }
      });
    } else if (isActionIntegration(action)) {
      toAdd.push(action.integration.id);
    } else {
      throw new Error(`Unknown action type: ${action}`);
    }

    return toAdd;
  }, [] as Array<UUID | undefined>);

  return endpointsToAdd as Array<UUID>;
};

export enum SaveBehaviorGroupOperation {
  CREATE,
  UPDATE,
}

export interface SaveBehaviorGroupResponse {
  status: boolean;
  operation: SaveBehaviorGroupOperation;
  duplicate?: boolean;
}

export const useSaveBehaviorGroup = (
  originalBehaviorGroup?: Partial<BehaviorGroup>
) => {
  const saveBehaviorGroupMutation = useSaveBehaviorGroupMutation();
  const { query } = useContext(ClientContext);
  const [fetchingIntegrations, setFetchingIntegrations] =
    useState<boolean>(false);

  const save = useCallback(
    async (data: BehaviorGroupRequest): Promise<SaveBehaviorGroupResponse> => {
      const mutate = saveBehaviorGroupMutation.mutate;
      let needsSavingDisplayName = false;
      let needsSavingActions = false;
      let needsSavingEventTypes = false;

      if (data.id === undefined) {
        needsSavingDisplayName = true;
        needsSavingActions = true;
      }

      if (data.displayName !== originalBehaviorGroup?.displayName) {
        needsSavingDisplayName = true;
      }

      const originalEvents = [...(originalBehaviorGroup?.events ?? [])].sort();
      const newEvents = [...(data.events ?? [])].sort();

      if (
        originalEvents.length !== newEvents.length ||
        !originalEvents.every((value, index) => value === newEvents[index])
      ) {
        needsSavingEventTypes = true;
      }

      if (
        !areActionsEqual(
          originalBehaviorGroup?.actions ?? [],
          data.actions ?? []
        )
      ) {
        needsSavingActions = true;
      }

      const toFetch: ReadonlyArray<SystemProperties> = uniqWith(
        ([] as Array<SystemProperties>).concat(
          ...data.actions
            .filter(isActionNotify)
            .map((action) =>
              produce(action, (draft) => {
                draft.recipient = draft.recipient.filter(
                  (r) => !r.integrationId
                );
              })
            )
            .map((action) => toSystemProperties(action))
        ),
        isEqual
      );

      if (
        toFetch.find(
          (props) =>
            ![
              NotificationType.EMAIL_SUBSCRIPTION,
              NotificationType.DRAWER,
            ].includes(props.type)
        )
      ) {
        throw new Error(
          'Only email and drawer subscriptions are created when assigning behavior groups'
        );
      }

      if (toFetch.length > 0) {
        setFetchingIntegrations(true);
      }

      const enpointIds = await Promise.all(
        toFetch.map((systemProps) =>
          query(getDefaultSystemEndpointAction(systemProps)).then((result) =>
            result.payload?.type === 'Endpoint'
              ? result.payload.value.id
              : undefined
          )
        )
      ).then((newIds) => {
        if (newIds.includes(undefined)) {
          throw new Error(
            'Unexpected ids were returned when querying for system endpoints'
          );
        }

        // We want to preserve the order
        const remainingIds = [...newIds] as UUID[];
        return actionsToIdList(data.actions, remainingIds);
      });

      const request: SaveBehaviorGroupRequest = {
        ...data,
        // cast, but it's OK - needsSavingDisplayName is always true when creating a new bg.
        displayName: needsSavingDisplayName
          ? data.displayName
          : (undefined as unknown as string),
        endpointIds: needsSavingActions ? enpointIds : undefined,
        eventTypesIds: needsSavingEventTypes
          ? data.events.map((e) => e.id)
          : undefined,
      };

      if (
        !needsSavingDisplayName &&
        !needsSavingActions &&
        !needsSavingEventTypes
      ) {
        return {
          operation:
            data.id === undefined
              ? SaveBehaviorGroupOperation.CREATE
              : SaveBehaviorGroupOperation.UPDATE,
          status: true,
        };
      }

      return mutate(request)
        .then((value) => {
          return {
            operation:
              data.id === undefined
                ? SaveBehaviorGroupOperation.CREATE
                : SaveBehaviorGroupOperation.UPDATE,
            status: value.payload?.status === 200,
            duplicate: value.error,
          };
        })
        .catch(() => {
          return {
            operation:
              data.id === undefined
                ? SaveBehaviorGroupOperation.CREATE
                : SaveBehaviorGroupOperation.UPDATE,
            status: false,
            duplicate: true,
          };
        });
    },
    [saveBehaviorGroupMutation.mutate, query, originalBehaviorGroup]
  );

  const isSaving = useMemo(() => {
    return saveBehaviorGroupMutation.loading || fetchingIntegrations;
  }, [saveBehaviorGroupMutation.loading, fetchingIntegrations]);

  return {
    save,
    isSaving,
  };
};
