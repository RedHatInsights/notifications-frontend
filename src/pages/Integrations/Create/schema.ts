import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { integrationsStep } from './IntegrationsStep';
import { SUMMARY } from './CreateWizard';
import { detailsStep } from './detailsStep';
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
        detailsStep(category),
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
