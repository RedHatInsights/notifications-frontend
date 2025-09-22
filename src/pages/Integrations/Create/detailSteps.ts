import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  DETAILS,
  EMAIL_CONFIG,
  EMAIL_DETAILS,
  EVENT_TYPES,
  GOOGLE_CHAT_DETAILS,
  INLINE_ALERT,
  PAGERDUTY_DETAILS,
  REVIEW,
  SERVICE_NOW_DETAILS,
  SLACK_DETAILS,
  SPLUNK_DETAILS,
  TEAMS_DETAILS,
  USER_ACCESS_GROUPS_DATAVIEW,
} from './helpers';
import { IntlShape } from 'react-intl';
import { validated } from './Validated';
import { asyncValidatorDebouncedWrapper } from './nameValidator';

const commonFields = (isSlack: boolean, isEdit: boolean, intl: IntlShape) => [
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
      (value, { id }) => asyncValidatorDebouncedWrapper(intl)(value, id, intl),
      {
        type: validatorTypes.REQUIRED,
      },
    ],
    resolveProps: validated,
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
  isBehaviorGroupsEnabled: boolean,
  intl: IntlShape
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
        ...commonFields(false, isEdit, intl),
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
        ...commonFields(false, isEdit, intl),
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
          name: 'secret-token',
          type: 'text',
          label: 'Integration key',
          helperText: 'Integration key provided by PagerDuty.',
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
          helperText:
            'Severity of the alert created in PagerDuty when this integration is used.',
          isRequired: true,
          simpleValue: true,
          options: [
            {
              label: 'Info',
              value: 'Info',
            },
            {
              label: 'Warning',
              value: 'Warning',
            },
            {
              label: 'Error',
              value: 'Error',
            },
            {
              label: 'Critical',
              value: 'Critical',
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
      fields: commonFields(true, isEdit, intl),
    },

    // COMMUNICATIONS - EMAIL
    {
      title: title,
      name: EMAIL_DETAILS,
      nextStep: EMAIL_CONFIG,
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
          } your email integration.`,
          variant: 'p',
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'name',
          type: 'text',
          label: 'Integration name',
          isRequired: true,
          validate: [
            (value, { id }) =>
              asyncValidatorDebouncedWrapper(intl)(value, id, intl),
            {
              type: validatorTypes.REQUIRED,
            },
          ],
          resolveProps: validated,
        },
      ],
    },

    // COMMUNICATIONS - EMAIL CONFIG
    {
      title: 'Configure email settings',
      name: EMAIL_CONFIG,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'email-config-title',
          label: `${isEdit ? 'Edit' : 'Configure'} email settings`,
          variant: 'h3',
        },
        {
          component: componentTypes.PLAIN_TEXT,
          name: 'email-config-subtitle',
          label: `${
            isEdit ? 'Edit' : 'Configure'
          } additional settings for your email integration.`,
          variant: 'p',
        },
        {
          component: USER_ACCESS_GROUPS_DATAVIEW,
          name: 'user-access-groups',
          label: 'User Access groups',
          isRequired: true,
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
            (value) => {
              if (!value || !Array.isArray(value) || value.length === 0) {
                return 'Please select at least one User Access Group';
              }
              return undefined;
            },
          ],
        },
      ],
    },

    // COMMUNICATIONS - GOOGLE CHAT
    {
      title: title,
      name: GOOGLE_CHAT_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: commonFields(false, isEdit, intl),
    },

    // COMMUNICATIONS - TEAMS
    {
      title: title,
      name: TEAMS_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: commonFields(false, isEdit, intl),
    },

    // COMMUNICATIONS - SPLUNK
    {
      title: title,
      name: SPLUNK_DETAILS,
      nextStep: isBehaviorGroupsEnabled ? EVENT_TYPES : REVIEW,
      fields: [
        ...commonFields(false, isEdit, intl),
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
