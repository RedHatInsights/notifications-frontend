import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { integrationsStep } from './IntegrationsStep';
import { SUMMARY } from './CreateWizard';
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
        integrationsStep(category),
        {
          title: 'Enter details',
          name: 'details',
          nextStep: 'review',
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
          ],
        },
        {
          title: 'Review',
          name: 'review',
          fields: [
            {
              component: [SUMMARY],
              name: [SUMMARY],
            },
          ],
        },
      ],
    },
  ],
});
