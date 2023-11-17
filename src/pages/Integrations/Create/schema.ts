import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { integrationsStep } from './IntegrationsStep';
import { SUMMARY } from './CreateWizard';
import {
  IntegrationCategory,
  IntegrationType,
} from '../../../types/Integration';
import { gchatAndTeamsDetails, slackDetails } from './detailsStep';

export const schema = (category) => ({
  fields: [
    {
      component: componentTypes.WIZARD,
      inModal: true,
      className: 'notifications',
      title: 'Add integration',
      description:
        'Configure integrations between third-party tools and the Red Hat Hybrid Cloud Console.',
      name: 'add-integration-wizard',
      crossroads: ['integration-type', 'integration-name'],
      fields: [
        ...([
          IntegrationCategory.COMMUNICATIONS,
          IntegrationCategory.REPORTING,
        ].includes(category)
          ? [integrationsStep(category)]
          : []),
        {
          title: 'Enter details',
          label: 'Enter the details for your integration.',
          name: 'details',
          nextStep: 'review',
          fields: [
            ...([
              IntegrationCategory.WEBHOOKS,
              IntegrationCategory.REPORTING,
            ].includes(category)
              ? [
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
                    name: 'service_now-secret-token',
                    type: 'text',
                    label: 'Secret token',
                    condition: {
                      when: 'integration-type',
                      is: IntegrationType.SERVICE_NOW,
                      then: { visible: true },
                    },
                    helperText: 'Password of a ServiceNow integration user.',
                    isRequired: false,
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: 'service_now-secret-token',
                    type: 'text',
                    label: 'Secret token',
                    condition: {
                      when: 'integration-type',
                      is: IntegrationType.SPLUNK,
                      then: { visible: true },
                    },
                    helperText:
                      "The defined secret token is sent as a Splunk's HTTP Event Collector token.",
                    isRequired: false,
                  },
                  {
                    component: componentTypes.TEXT_FIELD,
                    name: 'service_now-secret-token',
                    type: 'text',
                    label: 'Secret token',
                    helperText:
                      'The defined secret token is sent as a "X-Insight-Token" header on the request.',
                    isRequired: false,
                  },
                  {
                    name: 'inline-info-alert',
                    component: 'inline-alert',
                    title: 'SSL verification will be enabled',
                    variant: 'info',
                  },
                ]
              : []),
          ],
        },
        gchatAndTeamsDetails(),
        slackDetails(),
        {
          title: 'Review',
          name: 'review',
          fields: [
            {
              component: SUMMARY,
              name: SUMMARY,
            },
          ],
        },
      ],
    },
  ],
});
