import {
  componentTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  compileAllIntegrationComboOptions,
  iconMapper,
  nextDetailsStep,
} from './helpers';
import { CARD_SELECT } from './CreateWizard';
import { defaultIconList } from '../../../config/Config';

export const integrationsStep = (category: string) => ({
  title: 'Select Integration type',
  name: 'integrationType',
  nextStep: ({ values }) => nextDetailsStep(values),
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
