import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { integrationsStep } from './IntegrationsStep';
import { SUMMARY } from './CreateWizard';
import { IntegrationCategory } from '../../../types/Integration';
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
      fields: [
        ...([IntegrationCategory.COMMUNICATIONS].includes(category)
          ? [integrationsStep(category)]
          : []),
        {
          title: 'Enter details',
          name: 'details',
          nextStep: 'review',
          fields: [
            ...([IntegrationCategory.WEBHOOKS].includes(category)
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
                    name: 'secret-token',
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
              : [
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
                ]),
          ],
        },
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
