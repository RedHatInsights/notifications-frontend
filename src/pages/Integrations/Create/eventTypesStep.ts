import { componentTypes } from '@data-driven-forms/react-form-renderer';
import {
  EVENT_TYPES,
  EVENT_TYPES_TABLE,
  REVIEW,
  SELECTABLE_TABLE,
} from './helpers';

export const eventTypesStep = () => ({
  title: 'Associate event types (Optional)',
  name: EVENT_TYPES,
  nextStep: REVIEW,
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label:
        'Select event types you would like your integration to react to. This will create a behavior group automatically for you. You may also skip this step and attach event types later.',
    },
    {
      component: componentTypes.SELECT,
      isVisibleOnReview: false,
      name: 'product-family',
      label: 'Product family',
      options: [
        { label: 'OpenShift', value: 'openshift' },
        { label: 'Red Hat Enterprise Linux', value: 'rhel' },
        { label: 'Console', value: 'console' },
      ],
    },
    {
      component: SELECTABLE_TABLE,
      name: EVENT_TYPES_TABLE,
      label: 'Selected event types',
      bundleFieldName: 'product-family',
      validate: [{ type: 'required' }],
    },
  ],
});
