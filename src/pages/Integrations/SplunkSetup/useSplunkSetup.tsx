/*
Steps:

1) [GET] Retrieve UUIDs of Notifications event types to link to this new Splunk endpoint 

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
    },
    "event_types": ["3fa85f64-5717-4562-b3fc-2c963f66afa6","8d8dca57-1834-48dd-b6ac-265c949c5e60"] <<-- Event type Ids
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
import { useGetBundleByName } from '../../../services/Notifications/GetBundles';

export const SPLUNK_INTEGRATION_NAME = 'SPLUNK_AUTOMATION';
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
  const getRhelBundleUuid = useGetRhelBundleUuid();
  const createSplunkIntegration = useCreateSplunkIntegration();
  const attachEventTypes = useFindEventTypesToAssociate();

  return async ({ hecToken, splunkServerHostName }, onProgress) => {
    const now = new Date();
    const timestamp = now.getTime();
    const integrationName = `${SPLUNK_INTEGRATION_NAME}_${timestamp}`;
    const events = DEFAULT_SPLUNK_EVENTS;

    onProgress(`Fetching Event types...\n`);

    const rhelBundleId = await getRhelBundleUuid();

    const eventTypeList = await attachEventTypes(
      rhelBundleId,
      events,
      onProgress
    );

    onProgress(`Creating Integration ${integrationName}...`);
    await createSplunkIntegration({
      integrationName,
      hecToken,
      splunkServerHostName,
      eventTypeList,
    });
  };
};

const useGetRhelBundleUuid = () => {
  const getBundleByName = useGetBundleByName();
  return async () => {
    const rhelBundle = await getBundleByName(BUNDLE_NAME);

    if (rhelBundle !== undefined) {
      return rhelBundle?.id;
    } else {
      throw new Error(`Error when fetching bundle ${BUNDLE_NAME}`);
    }
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

  return async (rhelBundleId, events, onProgress) => {
    const eventTypes = await getAllEventTypes();
    const selectedEventTypes = eventTypes.filter((eventType) => {
      if (!eventType?.application) {
        return false;
      }

      if (eventType.application.bundle_id !== rhelBundleId) {
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
        `  ${eventType.application?.display_name} - ${eventType.display_name}\n`
      );
      selectedEventTypeIds.push(eventType.id as UUID);
    }
    return selectedEventTypeIds;
  };
};
