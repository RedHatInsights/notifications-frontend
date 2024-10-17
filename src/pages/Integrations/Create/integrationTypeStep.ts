import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  CARD_SELECT,
  DETAILS,
  GOOGLE_CHAT_DETAILS,
  INTEGRATION_TYPE,
  PAGERDUTY_DETAILS,
  SERVICE_NOW_DETAILS,
  SLACK_DETAILS,
  SPLUNK_DETAILS,
  TEAMS_DETAILS,
  compileAllIntegrationComboOptions,
  iconMapper,
} from './helpers';
import { defaultIconList } from '../../../config/Config';
import { IntegrationType } from '../../../types/Integration';

export const integrationTypeStep = (category: string, isEdit: boolean) => ({
  title: `${isEdit ? '' : 'Select '}Integration type`,
  name: INTEGRATION_TYPE,
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: isEdit
        ? `Change type of the ${category.toLowerCase()} integration added to your Red Hat account.`
        : `Select a ${category.toLowerCase()} integration to add to your Red Hat account.`,
    },
    {
      component: CARD_SELECT,
      name: INTEGRATION_TYPE,
      isRequired: true,
      label: 'Select Integration type',
      iconMapper: iconMapper(defaultIconList[category]),
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
      options: compileAllIntegrationComboOptions(defaultIconList[category]),
    },
  ],
  nextStep: {
    when: INTEGRATION_TYPE,
    stepMapper: {
      [IntegrationType.SLACK]: SLACK_DETAILS,
      [IntegrationType.GOOGLE_CHAT]: GOOGLE_CHAT_DETAILS,
      [IntegrationType.TEAMS]: TEAMS_DETAILS,

      [IntegrationType.SPLUNK]: SPLUNK_DETAILS,
      [IntegrationType.SERVICE_NOW]: SERVICE_NOW_DETAILS,
      [IntegrationType.PAGERDUTY]: PAGERDUTY_DETAILS,
      [IntegrationType.ANSIBLE]: DETAILS,
    },
  },
});
