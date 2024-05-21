import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { EVENT_TYPES, REVIEW } from './helpers';

export const eventTypesStep = (isEdit: boolean) => {
  return {
    title: 'Associate event types',
    name: EVENT_TYPES,
    nextStep: REVIEW,
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'associate-event-types-title',
        label: `Associate event types`,
        variant: 'h3',
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'associate-event-types-subtitle',
        label: `${
          isEdit ? 'Edit' : 'Select'
        } event types you would like to assign this behavior group to.`,
        variant: 'p',
      },
    ],
  };
};
