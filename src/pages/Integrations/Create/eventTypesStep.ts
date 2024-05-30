import { componentTypes } from '@data-driven-forms/react-form-renderer';
import {
  EVENT_TYPES,
  EVENT_TYPES_TABLE,
  REVIEW,
  SELECTABLE_TABLE,
} from './helpers';

export const eventTypesStep = () => ({
  title: 'Associate event types',
  name: EVENT_TYPES,
  nextStep: REVIEW,
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: 'Select event types you would like your integration to react to.',
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
      label: 'Select event types',
      bundleFieldName: 'product-family',
    },
  ],
});
