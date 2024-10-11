import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  DETAILS,
  EVENT_TYPES,
  GOOGLE_CHAT_DETAILS,
  INLINE_ALERT,
  PAGERDUTY_DETAILS,
  REVIEW,
  SERVICE_NOW_DETAILS,
  SLACK_DETAILS,
  SPLUNK_DETAILS,
  TEAMS_DETAILS,
} from './helpers';

const commonFields = (isSlack: boolean, isEdit: boolean) => [
  {
    component: componentTypes.PLAIN_TEXT,
    name: 'integration-details-title',
    label: `${isEdit ? 'Edit' : 'Enter'} integration details`,
    variant: 'h3',
  },
  {
    component: componentTypes.PLAIN_TEXT,
    name: 'integration-details-subtitle',
    label: `${isEdit ? 'Edit' : 'Enter'} the details ${
      isEdit ? 'of' : 'for'
    } your integration.`,
    variant: 'p',
  },
  {
    component: componentTypes.TEXT_FIELD,
    name: 'name',
    type: 'text',
    label: 'Integration name',
    isRequired: true,
    validate: [
      {
        type: validatorTypes.REQUIRED,
      },
    ],
  },
  {
    component: componentTypes.TEXT_FIELD,
    name: 'url',
    type: 'text',
    label: isSlack ? 'Workspace URL' : 'Endpoint URL',
    helperText: 'URL must include "http://" or "https://"',
    isRequired: true,
    validate: [
      { type: validatorTypes.REQUIRED },
      {
        type: validatorTypes.URL,
      },
    ],
  },
];

const sslAlert = {
  name: 'inline-info-alert',
  component: INLINE_ALERT,
  title: 'SSL verification will be enabled',
  variant: 'info',
};

export const detailSteps = (
  isEdit: boolean,
  isBehaviorGroupsEnabled: boolean
) => {
  const title = `${isEdit ? 'Edit' : 'Enter'} details`;
  return [
    // REPORTING - SPLUNK, ANSIBLE
    // WEBHOOKS
    {
      title: title,
      name: DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        ...commonFields(false, isEdit),
        {
          component: componentTypes.TEXT_FIELD,
          name: 'secret-token',
          type: 'text',
          label: 'Secret token',
          helperText:
            'The defined secret token is sent as a "X-Insight-Token" header on the request.',
          isRequired: false,
        },
        sslAlert,
      ],
    },

    // REPORTING - SERVICE NOW
    {
      title: title,
      name: SERVICE_NOW_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        ...commonFields(false, isEdit),
        {
          component: componentTypes.TEXT_FIELD,
          name: 'secret-token',
          type: 'text',
          label: 'Secret token',
          helperText: 'Password of a ServiceNow integration user.',
          isRequired: false,
        },
        sslAlert,
      ],
    },

    // REPORTING - PAGERDUTY
    {
      title: title,
      name: PAGERDUTY_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'integration-details-title',
          label: `${isEdit ? 'Edit' : 'Enter'} integration details`,
          variant: 'h3',
        },
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'integration-details-subtitle',
          label: `${isEdit ? 'Edit' : 'Enter'} the details ${
            isEdit ? 'of' : 'for'
          } your integration.`,
          variant: 'p',
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'name',
          type: 'text',
          label: 'Integration name',
          isRequired: true,
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
          ],
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'integration_key',
          type: 'text',
          label: 'Integration key',
          isRequired: true,
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
          ],
        },
        {
          component: componentTypes.SELECT,
          name: 'severity',
          label: 'Alert severity',
          simpleValue: true,
          options: [
            {
              label: 'Info',
              placeholder: 'Info',
              name: 'info',
              value: '1',
            },
            {
              label: 'Warning',
              name: 'warning',
              value: '2',
            },
            {
              label: 'Error',
              name: 'error',
              value: '3',
            },
            {
              label: 'Critical',
              name: 'critical',
              value: '3',
            },
          ],
        },
      ],
    },

    // COMMUNICATIONS - SLACK
    {
      title: title,
      name: SLACK_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: commonFields(true, isEdit),
    },

    // COMMUNICATIONS - GOOGLE CHAT
    {
      title: title,
      name: GOOGLE_CHAT_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: commonFields(false, isEdit),
    },

    // COMMUNICATIONS - TEAMS
    {
      title: title,
      name: TEAMS_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: commonFields(false, isEdit),
    },

    // COMMUNICATIONS - SPLUNK
    {
      title: title,
      name: SPLUNK_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        ...commonFields(false, isEdit),
        {
          component: componentTypes.TEXT_FIELD,
          name: 'secret-token',
          type: 'text',
          label: 'Secret token',
          helperText:
            "The defined secret token is sent as a Splunk's HTTP Event Collector token.",
          isRequired: false,
        },
        sslAlert,
      ],
    },
  ];
};
