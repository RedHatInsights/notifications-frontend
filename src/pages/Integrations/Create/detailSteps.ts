import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  DETAILS,
  GOOGLE_CHAT_DETAILS,
  INLINE_ALERT,
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

export const detailSteps = (isEdit: boolean) => {
  const title = `${isEdit ? 'Edit' : 'Enter'} details`;
  return [
    // REPORTING - SPLUNK, ANSIBLE
    // WEBHOOKS
    {
      title: title,
      name: DETAILS,
      nextStep: REVIEW,
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
      nextStep: REVIEW,
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

    // COMMUNICATIONS - SLACK
    {
      title: title,
      name: SLACK_DETAILS,
      nextStep: REVIEW,
      fields: [
        ...commonFields(true, isEdit),
        {
          component: componentTypes.TEXT_FIELD,
          name: 'channel',
          type: 'text',
          label: 'Channel',
          isRequired: true,
          validate: [{ type: validatorTypes.REQUIRED }],
        },
      ],
    },

    // COMMUNICATIONS - GOOGLE CHAT
    {
      title: title,
      name: GOOGLE_CHAT_DETAILS,
      nextStep: REVIEW,
      fields: commonFields(false, isEdit),
    },

    // COMMUNICATIONS - TEAMS
    {
      title: title,
      name: TEAMS_DETAILS,
      nextStep: REVIEW,
      fields: commonFields(false, isEdit),
    },

    // COMMUNICATIONS - SPLUNK
    {
      title: title,
      name: SPLUNK_DETAILS,
      nextStep: REVIEW,
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
