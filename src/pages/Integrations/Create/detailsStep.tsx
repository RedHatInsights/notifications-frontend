import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { getIntegration } from './helpers';
import { CARD_SELECT } from './CreateWizard';
import { defaultIconList } from '../../../config/Config';
import { IntegrationType } from '../../../types/Integration';

export const googleAndTeamsField = () => ({
  component: componentTypes.TEXT_FIELD,
  name: 'endpoint-url',
  type: 'text',
  label: 'Endpoint Url',
  helperText: 'URL must include "http://"',
  isRequired: true,
  validate: [
    { type: validatorTypes.REQUIRED },
    {
      type: validatorTypes.PATTERN,
      pattern: '(https://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
      message: 'Please enter a valid URL'
    }
  ]
});

export const slackField = () => [
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
      }
    ]
  },
  {
    component: componentTypes.TEXT_FIELD,
    name: 'channel',
    type: 'text',
    label: 'Channel',
    isRequired: true,
    validate: [
      {type: validatorTypes.REQUIRED },
    ]
  }
];



export const detailsStep = (category: string) => ({
  title: 'Enter details',
  name: 'details',
  nextStep: 'summary',
  fields: [
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
    category === 'Communications' && getIntegration() === IntegrationType.TEAMS &&  googleAndTeamsField()
  ],
});
