import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { iconMapper, compileAllSourcesComboOptions } from './helpers';

const communicationsIcons = {
  teams: '',
  gchat: '',
  slack: '',
};

export const communicationsStep = () => ({
  title: 'Select Integration type',
  name: 'integrationType',
  nextStep: 'details',
  fields: [
    {
        component: componentTypes.PLAIN_TEXT,
        name: 'plain-text-component',
        label: ("Select a communications integration to add to your Red Hat account.")
    },
    {
      component: 'card-select',
      name: 'communication-type',
      isRequired: true,
      label: 'Select integration type',
      // iconMapper: iconMapper(['teams', 'gchat', 'slack']),
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      options: [
        { value: 'teams', label: 'Teams' },
        { value: 'gchat', label: 'Google Chat' },
        { value: 'slack', label: 'Slack' },
      ], 
    }
  ]
});