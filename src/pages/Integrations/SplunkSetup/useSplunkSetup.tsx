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

import { useGetAllEventTypes } from '../../../services/GetEventTypes';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import {
  Integration,
  IntegrationCamel,
  IntegrationType,
  NewIntegrationTemplate,
} from '../../../types/Integration';
import { UUID } from '../../../types/Notification';

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
  const attachEventTypes = useFindEventTypesToAssociate();

  return async ({ hecToken, splunkServerHostName }, onProgress) => {
    const now = new Date();
    const timestamp = now.getTime();
    const integrationName = `${SPLUNK_INTEGRATION_NAME}_${timestamp}`;
    const events = DEFAULT_SPLUNK_EVENTS;

    onProgress(`Fetching Event types...\n`);

    const eventTypeList = await attachEventTypes(events, onProgress);

    onProgress(`Creating Integration ${integrationName}...`);
    await createSplunkIntegration({
      integrationName,
      hecToken,
      splunkServerHostName,
      eventTypeList,
    });
    onProgress(' OK', 'pf-v5-u-success-color-200');
  };
};

const useCreateSplunkIntegration = () => {
  const { mutate } = useSaveIntegrationMutation();

  return async ({
    integrationName,
    splunkServerHostName,
    hecToken,
    eventTypeList,
  }): Promise<Integration | undefined> => {
    const newIntegration: NewIntegrationTemplate<IntegrationCamel> = {
      type: IntegrationType.SPLUNK,
      name: integrationName,
      url: splunkServerHostName,
      secretToken: hecToken,
      isEnabled: true,
      sslVerificationEnabled: true,
      eventTypes: eventTypeList,
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

const useFindEventTypesToAssociate = () => {
  const getAllEventTypes = useGetAllEventTypes();

  return async (events, onProgress) => {
    const eventTypes = await getAllEventTypes();

    const selectedEventTypes = eventTypes.filter((eventType) => {
      if (!eventType?.application) {
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

    const selectedEventTypeIds: UUID[] = [];
    for (const eventType of selectedEventTypes) {
      onProgress(
        `  ${eventType.application?.display_name} - ${eventType.display_name}...`
      );
      onProgress(' FETCHED\n', 'pf-v5-u-success-color-200');
      selectedEventTypeIds.push(eventType.id as UUID);
    }
    return selectedEventTypeIds;
  };
};
