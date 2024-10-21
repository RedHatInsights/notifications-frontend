/*
Steps:

1) [POST] Create Integrations under /api/integrations/v1.0/endpoints with the payload:
{
    "name": "Splunk Automation",
    "enabled": true,
    "type": "camel",
    "sub_type": "splunk",
    "description": "",
    "properties": {
        "url": "http://decd-187-3-186-244.ngrok.io",
        "disable_ssl_verification": false,
        "secret_token": "MYHEC_TOKEN",
        "basic_authentication": {},
        "extras": {}
    }
}

2) Create behavior group under /api/notifications/v1.0/notifications/behaviorGroups with the payload:

{
  "bundle_id":"35fd787b-a345-4fe8-a135-7773de15905e",
  "display_name":"Splunk-automation"
}

3) [POST] Update behavior group under api/notifications/v1.0/notifications/behaviorGroups/{BEHAVIOR_GROUP_ID}/actions with the payload:

  ["8d8dca57-1834-48dd-b6ac-265c949c5e60"] <<-- Id of the integration

4) [PUT] Update eventType under /api/notifications/v1.0/notifications/eventTypes/{EVENT_TYPE_UUID}/behaviorGroups with the payload:

["ff59b502-da25-4297-bd88-6934ad0e0d63"] <<- Behavior group ID
*/

import { useClient } from 'react-fetching-library';

import { useGetAllEventTypes } from '../../../services/GetEventTypes';
import { useGetAnyBehaviorGroupByNotification } from '../../../services/Notifications/GetBehaviorGroupByNotificationId';
import { useGetBundleByName } from '../../../services/Notifications/GetBundles';
import { linkBehaviorGroupAction } from '../../../services/Notifications/LinkBehaviorGroup';
import { useSaveBehaviorGroupMutation } from '../../../services/Notifications/SaveBehaviorGroup';
import { useUpdateBehaviorGroupActionsMutation } from '../../../services/Notifications/UpdateBehaviorGroupActions';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import {
  Integration,
  IntegrationCamel,
  IntegrationType,
  NewIntegrationTemplate,
} from '../../../types/Integration';
import {
  BehaviorGroup,
  BehaviorGroupRequest,
  UUID,
} from '../../../types/Notification';

export const SPLUNK_GROUP_NAME = 'SPLUNK_INTEGRATION';
export const SPLUNK_INTEGRATION_NAME = 'SPLUNK_AUTOMATION';
export const SPLUNK_BEHAVIOR_GROUP_NAME = 'SPLUNK_AUTOMATION_GROUP';
export const BUNDLE_NAME = 'rhel';

interface SplunkEventsDef {
  [Identifier: string]: string | string[];
}

const DEFAULT_SPLUNK_EVENTS: SplunkEventsDef = {
  advisor: '*',
  policies: '*',
  drift: '*',
  compliance: '*',
  'malware-detection': '*',
  patch: '*',
  vulnerability: '*',
};

export const useSplunkSetup = () => {
  const createSplunkIntegration = useCreateSplunkIntegration();
  const createSplunkBehaviorGroup = useCreateSplunkBehaviorGroup();
  const updateSplunkBehaviorActions = useUpdateSplunkBehaviorActions();
  const attachEvents = useAttachEventsToSplunk();

  return async ({ hecToken, splunkServerHostName }, onProgress) => {
    const integrationName = SPLUNK_INTEGRATION_NAME;
    const behaviorGroupName = SPLUNK_BEHAVIOR_GROUP_NAME;
    const bundleName = BUNDLE_NAME;
    const events = DEFAULT_SPLUNK_EVENTS;

    onProgress(`Creating Integration ${integrationName}...`);
    const integration = await createSplunkIntegration({
      integrationName,
      hecToken,
      splunkServerHostName,
    });
    onProgress(' OK', 'pf-v5-u-success-color-200');

    onProgress(`\nCreating Behavior Group ${behaviorGroupName}...`);
    const behaviorGroup = await createSplunkBehaviorGroup({
      behaviorGroupName,
      bundleName,
    });
    onProgress(' OK', 'pf-v5-u-success-color-200');

    onProgress(
      '\nAssociating integration as an action for the behavior group...'
    );
    await updateSplunkBehaviorActions(behaviorGroup, integration);

    onProgress(' OK', 'pf-v5-u-success-color-200');
    onProgress('\n\nAssociating events to the behavior group:\n');

    await attachEvents(behaviorGroup, events, onProgress);
  };
};

const useCreateSplunkIntegration = () => {
  const { mutate } = useSaveIntegrationMutation();
  return async ({
    integrationName,
    splunkServerHostName,
    hecToken,
  }): Promise<Integration | undefined> => {
    const newIntegration: NewIntegrationTemplate<IntegrationCamel> = {
      type: IntegrationType.SPLUNK,
      name: integrationName,
      url: splunkServerHostName,
      secretToken: hecToken,
      isEnabled: true,
      sslVerificationEnabled: true,
    };

    const { payload, error, errorObject } = await mutate(newIntegration);
    if (errorObject) {
      throw errorObject;
    }

    if (error) {
      throw new Error(`Error when creating integration ${integrationName}`);
    }

    return payload?.value as Integration;
  };
};

const useCreateSplunkBehaviorGroup = () => {
  const { mutate } = useSaveBehaviorGroupMutation();
  const getBundleByName = useGetBundleByName();

  return async ({ behaviorGroupName, bundleName }): Promise<BehaviorGroup> => {
    const bundle = await getBundleByName(bundleName);
    if (!bundle) {
      throw new Error(`Unable to find bundle ${bundleName}`);
    }

    const behaviorGroup: BehaviorGroupRequest = {
      bundleId: bundle.id as UUID,
      displayName: behaviorGroupName,
      actions: [], // ignored
      events: [], // ignored
    };

    const { payload, error, errorObject } = await mutate(behaviorGroup);
    if (errorObject) {
      throw errorObject;
    }

    if (error) {
      throw new Error(
        `Error when creating behavior group ${behaviorGroupName}`
      );
    }

    return payload?.value as BehaviorGroup;
  };
};

const useUpdateSplunkBehaviorActions = () => {
  const { mutate } = useUpdateBehaviorGroupActionsMutation();
  return async (behaviorGroup, integration) => {
    const endpointIds = behaviorGroup.actions || [];
    endpointIds.push(integration.id);

    const params = {
      behaviorGroupId: behaviorGroup.id,
      endpointIds,
    };
    const { payload, error, errorObject } = await mutate(params);
    if (errorObject) {
      throw errorObject;
    }

    if (error) {
      throw new Error(
        `Error when linking behavior group ${behaviorGroup.id}` +
          ` with integration ${integration.id}`
      );
    }

    return payload?.value;
  };
};

const useAttachEventsToSplunk = () => {
  const getAllEventTypes = useGetAllEventTypes();
  const client = useClient();
  const getAnyBehaviorGroupByNotification =
    useGetAnyBehaviorGroupByNotification();

  const appendActionToNotification = async (eventType, behaviorGroup) => {
    const existingActions = await getAnyBehaviorGroupByNotification(
      eventType.id as UUID
    );
    const existingActionIds = existingActions.value as UUID[];
    const newActionIds = [...existingActionIds, behaviorGroup.id];

    const { payload, errorObject, error } = await client.query(
      linkBehaviorGroupAction(eventType.id, newActionIds)
    );
    if (errorObject) {
      throw errorObject;
    }

    if (error) {
      throw new Error(`Unsuccessful linking of event type ${eventType.id}`);
    }

    return payload;
  };

  return async (behaviorGroup, events, onProgress) => {
    const eventTypes = await getAllEventTypes();

    const selectedEventTypes = eventTypes.filter((eventType) => {
      if (!eventType?.application) {
        return false;
      }

      if (eventType.application.bundle_id !== behaviorGroup.bundleId) {
        return false;
      }

      const expectEvents = events[eventType.application.name];
      if (
        !expectEvents ||
        (expectEvents !== '*' && !expectEvents.includes(eventType.name))
      ) {
        return false;
      }

      return true;
    });

    for (const eventType of selectedEventTypes) {
      onProgress(
        `  ${eventType.application?.display_name} - ${eventType.display_name}...`
      );
      try {
        await appendActionToNotification(eventType, behaviorGroup);
        onProgress(' ASSOCIATED\n', 'pf-v5-u-success-color-200');
      } catch (error) {
        onProgress(' ERROR!\n', 'pf-v5-u-danger-color-200');
        console.log(error);
      }
    }
  };
};
