import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  CARD_SELECT,
  DETAILS,
  EMAIL_DETAILS,
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
import {
  IntegrationIconTypes,
  IntegrationType,
} from '../../../types/Integration';

export const integrationTypeStep = (
  category: string,
  isEdit: boolean,
  isPagerDutyEnabled: boolean,
  isEmailIntegrationEnabled: boolean = true
) => ({
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
      options: compileAllIntegrationComboOptions(
        Object.fromEntries(
          Object.entries(defaultIconList[category]).filter(([key]) => {
            if (key === IntegrationType.PAGERDUTY && !isPagerDutyEnabled) {
              return false;
            }
            if (
              key === IntegrationType.EMAIL_SUBSCRIPTION &&
              !isEmailIntegrationEnabled
            ) {
              return false;
            }
            return true;
          })
        ) as IntegrationIconTypes
      ),
    },
  ],
  nextStep: {
    when: INTEGRATION_TYPE,
    stepMapper: {
      [IntegrationType.EMAIL_SUBSCRIPTION]: EMAIL_DETAILS,
      [IntegrationType.SLACK]: SLACK_DETAILS,
      [IntegrationType.GOOGLE_CHAT]: GOOGLE_CHAT_DETAILS,
      [IntegrationType.TEAMS]: TEAMS_DETAILS,

      [IntegrationType.SPLUNK]: SPLUNK_DETAILS,
      [IntegrationType.SERVICE_NOW]: SERVICE_NOW_DETAILS,
      [IntegrationType.PAGERDUTY]: isPagerDutyEnabled
        ? PAGERDUTY_DETAILS
        : null,
      [IntegrationType.ANSIBLE]: DETAILS,
    },
  },
});
