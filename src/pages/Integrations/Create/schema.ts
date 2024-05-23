import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { integrationTypeStep } from './integrationTypeStep';
import { IntegrationCategory } from '../../../types/Integration';
import { detailSteps } from './detailSteps';
import { EVENT_TYPES, REVIEW } from './helpers';

export const schema = (category, isEdit) => ({
  fields: [
    {
      component: componentTypes.WIZARD,
      inModal: true,
      className: 'notifications',
      title: `${isEdit ? 'Edit' : 'Add'} integration`,
      description:
        'Configure integrations between third-party tools and the Red Hat Hybrid Cloud Console.',
      name: `${isEdit ? 'edit' : 'add'}-integration-wizard`,
      fields: [
        // INTEGRATION TYPE
        ...([
          IntegrationCategory.COMMUNICATIONS,
          IntegrationCategory.REPORTING,
        ].includes(category)
          ? [integrationTypeStep(category, isEdit)]
          : []),

        // INTEGRATION DETAILS
        ...detailSteps(isEdit),

        // ASSOCIATE EVENT TYPES
        {
          title: 'Associate event types',
          name: EVENT_TYPES,
          nextStep: REVIEW,
          fields: [
            {
              component: EVENT_TYPES,
              name: EVENT_TYPES,
            }
          ]
        },

        // REVIEW
        {
          title: 'Review',
          name: REVIEW,
          fields: [
            {
              component: REVIEW,
              name: REVIEW,
              category,
            },
          ],
        },
      ],
    },
  ],
});
