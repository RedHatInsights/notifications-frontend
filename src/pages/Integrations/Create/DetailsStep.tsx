import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { IntegrationType } from '../../../types/Integration';

export const detailsStep = () => ({
  title: 'Enter details',
  name: 'details',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: 'Enter the details for your integration',
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
      name: 'url',
      label: 'Endpoint URL',
      helperText: 'URL must include "http://"',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      // TODO this needs to be checked by default with message 'SSL verification will be enabled'
      component: componentTypes.CHECKBOX,
      name: 'ssl',
      label: 'Enable SSL verification',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'secret',
      label: 'Secret token',
      helperText: IntegrationType.SERVICE_NOW
        ? 'Password of a ServiceNow integration user.'
        : IntegrationType.SPLUNK
        ? "The defined secret token is sent as a Splunk's HTTP Event Collector token."
        : 'The defined secret token is sent as a "X-Insight-Token" header on the request.',
    },
  ],
});
