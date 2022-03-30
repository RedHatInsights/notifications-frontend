export const RBAC_GROUPS_API = '/api/rbac/v1/groups/';
export const RBAC_ROLES_API = '/api/rbac/v1/groups/{}/roles/';
export const RBAC_ADD_USER_API = '/api/rbac/v1/groups/{}/principals/';
export const CREATE_INTEGRATION_API = '/api/integrations/v1.0/endpoints';
export const CREATE_BEHAVIOR_GROUP_API = '/api/notifications/v1.0/notifications/behaviorGroups';
export const UPDATE_BEHAVIOR_GROUP_API = '/api/notifications/v1.0/notifications/behaviorGroups/{}/actions';
export const EVENTTYPE_API = '/api/notifications/v1.0/notifications/eventTypes/{}/behaviorGroups';

// If prod use prod UUID, else use stage
export const NOTIF_ADM_ROLE_UUID = window.insights?.chrome.getEnvironment() === 'prod' ? '' : '15f910ad-150a-46dd-b666-0b21088e9c55';
export const BEHAVIOR_GROUP_BUNDLE_ID =  window.insights?.chrome.getEnvironment() === 'prod' ? '' : '35fd787b-a345-4fe8-a135-7773de15905e';

export const SPLUNK_GROUP_NAME = 'SPLUNK_INTEGRATION';
export const SPLUNK_INTEGRATION_NAME = 'SPLUNK_AUTOMATION';
export const SPLUNK_BEHAVIOR_GROUP_NAME = 'SPLUNK_AUTOMATION_GROUP';

const EVENT_TYPES_PROD = [];
const EVENT_TYPES_STAGE = [ '6d4d1e03-f1bf-427c-8c62-08a114242b5d', // policy-triggered
    '95a6d179-5dbd-4de4-a726-5bab2a699912',  // new-recommendation
    '5df33474-9cfd-40e9-9a86-9f8857147f89', // drift-baseline-detected
    '75233a10-646c-4e26-a5f1-639a7df8f29f' ]; // resolved-recommendation

export const EVENT_TYPES_IDS_ARR = window.insights?.chrome.getEnvironment() === 'prod' ? EVENT_TYPES_PROD : EVENT_TYPES_STAGE;
