import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import { compileAllIntegrationComboOptions, iconMapper } from './helpers';
import { CARD_SELECT } from './CreateWizard';
import { defaultIconList } from '../../../config/Config';
import { IntegrationType } from '../../../types/Integration';

export const integrationsStep = (category: string) => ({
  title: 'Select Integration type',
  name: 'integration-type',
  nextStep: {
    when: 'integration-type',
    stepMapper: {
      [IntegrationType.SLACK]: 'slack-details',
      [IntegrationType.GOOGLE_CHAT]: 'teams-gchat-details',
      [IntegrationType.TEAMS]: 'teams-gchat-details',
      [IntegrationType.SPLUNK]: 'splunk-details',
      [IntegrationType.SERVICE_NOW]: 'service-now-details',
      [IntegrationType.ANSIBLE]: 'details',
      [IntegrationType.WEBHOOK]: 'details',
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
