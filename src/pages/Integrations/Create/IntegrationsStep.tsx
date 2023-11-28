import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { compileAllIntegrationComboOptions, iconMapper } from './helpers';
import { CARD_SELECT } from './CreateWizard';
import { defaultIconList } from '../../../config/Config';

export const integrationsStep = (category: string) => ({
  title: 'Select Integration type',
  name: 'integration-type',
  nextStep: {
    when: 'integration-type',
    stepMapper: {
      'camel:slack': 'slack-details',
      'camel:google_chat': 'teams-gchat-details',
      'camel:teams': 'teams-gchat-details',
      'camel:splunk': 'splunk-details',
      'camel:servicenow': 'service-now-details',
      ansible: 'details',
      webhooks: 'details',
    },
  },
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: `Select a ${category.toLowerCase()} integration to add to your Red Hat account.`,
    },
    {
      component: CARD_SELECT,
      name: 'integration-type',
      isRequired: true,
      label: 'Select integration type',
      iconMapper: iconMapper(defaultIconList[category]),
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      options: compileAllIntegrationComboOptions(defaultIconList[category]),
    },
  ],
});
