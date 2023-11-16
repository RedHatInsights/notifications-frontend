import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';

export const googleAndTeamsField = {
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
};

export const slackDetails = () => ({
  title: 'Enter details',
  name: 'slack-details',
  nextStep: 'summary',
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
  nextStep: 'summary',
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
