import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { integrationTypeStep } from './integrationTypeStep';
import { IntegrationCategory } from '../../../types/Integration';
import { detailSteps } from './detailSteps';
import { REVIEW } from './helpers';
import { eventTypesStep } from './eventTypesStep';

export const schema = (category, isEdit, isBehaviorGroupsEnabled) => ({
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
        ...detailSteps(isEdit, isBehaviorGroupsEnabled),

        // ASSOCIATE EVENT TYPES
        ...(isBehaviorGroupsEnabled ? [eventTypesStep()] : []),

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
