import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';

export const slackDetails = () => ({
  title: 'Enter details',
  name: 'slack-details',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-title',
      label: 'Enter integration details',
      variant: 'h3',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-subtitle',
      label: 'Enter the details for your integration.',
      variant: 'p',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'integration-name',
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
      name: 'workspace-url',
      type: 'text',
      label: 'Workspace Url',
      helperText: 'URL must include "http://"',
      isRequired: true,
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.URL,
        },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'channel',
      type: 'text',
      label: 'Channel',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
});

export const gchatAndTeamsDetails = () => ({
  title: 'Enter details',
  name: 'teams-gchat-details',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-title',
      label: 'Enter integration details',
      variant: 'h3',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-subtitle',
      label: 'Enter the details for your integration.',
      variant: 'p',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'integration-name',
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
      name: 'endpoint-url',
      type: 'text',
      label: 'Endpoint Url',
      helperText: 'URL must include "http://"',
      isRequired: true,
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.URL,
          message: 'URL must include "http://"',
        },
      ],
    },
  ],
});

export const splunkDetails = () => ({
  title: 'Enter details',
  name: 'splunk-details',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-title',
      label: 'Enter integration details',
      variant: 'h3',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-subtitle',
      label: 'Enter the details for your integration.',
      variant: 'p',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'integration-name',
      type: 'text',
      label: 'Integration name',
      isRequired: true,
      validate: [
        {
          type: 'required',
        },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'endpoint-url',
      type: 'text',
      label: 'Endpoint URL',
      helperText: 'URL must include "http://"',
      isRequired: true,
      validate: [
        {
          type: 'required',
        },
        {
          type: validatorTypes.URL,
          message: 'URL must include "http://"',
        },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'splunk-secret-token',
      type: 'text',
      label: 'Secret token',
      helperText:
        "The defined secret token is sent as a Splunk's HTTP Event Collector token.",
      isRequired: false,
    },
    {
      name: 'inline-info-alert',
      component: 'inline-alert',
      title: 'SSL verification will be enabled',
      variant: 'info',
    },
  ],
});

export const serviceNowDetails = () => ({
  title: 'Enter details',
  name: 'service-now-details',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-title',
      label: 'Enter integration details',
      variant: 'h3',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'integration-details-subtitle',
      label: 'Enter the details for your integration.',
      variant: 'p',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'integration-name',
      type: 'text',
      label: 'Integration name',
      isRequired: true,
      validate: [
        {
          type: 'required',
        },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'endpoint-url',
      type: 'text',
      label: 'Endpoint URL',
      helperText: 'URL must include "http://"',
      isRequired: true,
      validate: [
        {
          type: 'required',
        },
        {
          type: validatorTypes.URL,
          message: 'URL must include "http://"',
        },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'serviceNow-secret-token',
      type: 'text',
      label: 'Secret token',
      helperText: 'Password of a ServiceNow integration user.',
      isRequired: false,
    },
    {
      name: 'inline-info-alert',
      component: 'inline-alert',
      title: 'SSL verification will be enabled',
      variant: 'info',
    },
  ],
});
