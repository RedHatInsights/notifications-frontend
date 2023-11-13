import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { iconMapper, compileAllIntegrationComboOptions } from './helpers';

const communicationsIntegrations = [
  { name: 'microsoft-office-teams', product_name: 'Microsoft Office Teams', icon_url: '/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg' },
  { name: 'gchat', product_name: 'Google Chat', icon_url: '/apps/frontend-assets/sources-integrations/google-chat.svg' },
  { name: 'slack', product_name: 'Slack', icon_url: '/apps/frontend-assets/sources-integrations/slack.svg' },
]

export const integrationsStep = (integrationsTab) => ({
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
      iconMapper: iconMapper(communicationsIntegrations),
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      options: [
        compileAllIntegrationComboOptions(communicationsIntegrations)
      ], 
    }
  ]
});