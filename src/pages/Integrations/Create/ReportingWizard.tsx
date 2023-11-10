import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';

const reportingIcons = {
  splunk: '/apps/frontend-assets/sources-integrations/splunk.svg',
  snow: '/apps/frontend-assets/sources-integrations/service-now.svg',
  eda: '/apps/frontend-assets/sources-integrations/ansible.svg',
};

export const reportingStep = () => ({
  title: 'Select Integration type',
  name: 'integrationType',
  nextStep: 'details',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text-component',
      label: 'Select a reporting integration to add to your Red Hat account.',
    },
    {
      component: 'card-select',
      name: 'reporting-type',
      isRequired: true,
      label: 'Select integration type',
      // iconMapper: iconMapper(['splunk', 'snow', 'eda']),
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      options: [
        { value: 'splunk', label: 'Splunk' },
        { value: 'snow', label: 'ServiceNow' },
        { value: 'eda', label: 'Event-Driven Ansible' },
      ],
    },
  ],
});
