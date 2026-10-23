import { Title } from '@patternfly/react-core';
import * as React from 'react';
import * as Yup from 'yup';

import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { Form, FormTextInput } from '../../../../utils/insights-common-typescript';

const BEHAVIOR_GROUP_NAME = 'Behavior group name';

const titleMessages = {
  title: {
    id: 'behaviorGroup.wizard.basicInformation.title',
    defaultMessage: 'Name',
  },
} as const;

const BasicInformationStep: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Form ouiaId="basic-information-step">
      <Title headingLevel="h4" size="xl">
        {intl.formatMessage(titleMessages.title)}
      </Title>
      <FormTextInput
        ouiaId="name"
        id="name"
        name="displayName"
        label={BEHAVIOR_GROUP_NAME}
        isRequired
      />
    </Form>
  );
};

export const schema = Yup.object({
  displayName: Yup.string()
    .min(1)
    .max(150, 'Must be 150 characters or less')
    .required('Behavior group name is required'),
});

export const useBasicInformationStep: IntegrationWizardStep = () => {
  const intl = useIntl();
  return React.useMemo(
    () => ({
      name: intl.formatMessage(titleMessages.title),
      component: <BasicInformationStep />,
      schema,
    }),
    [intl]
  );
};

import { useIntl } from 'react-intl';
