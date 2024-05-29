import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { EVENT_TYPES, SELECTABLE_TABLE } from './helpers';

export const eventTypesStep = () => ({
  title: 'Associate event types',
  name: EVENT_TYPES,
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: 'Select event types you would like your integration to react to.',
    },
    {
      component: componentTypes.SELECT,
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
      name: 'event-types-table',
      label: 'Select event types',
      columns: [
        { title: 'Event type', key: 'event-type' },
        { title: 'Service', key: 'service' },
      ],
      // temporary dummy data
      data: [
        { 'event-type': 'Cluster creation', service: 'OpenShift', id: 1 },
        { 'event-type': 'Cluster deletion', service: 'OpenShift', id: 2 },
        { 'event-type': 'Node failure', service: 'OpenShift', id: 3 },
      ],
    },
  ],
});
