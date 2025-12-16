import { Title } from '@patternfly/react-core';
import * as React from 'react';
import * as Yup from 'yup';

import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import {
  Form,
  FormTextInput,
} from '../../../../utils/insights-common-typescript';

const title = 'Name';

const BasicInformationStep: React.FunctionComponent = () => {
  return (
    <Form ouiaId="basic-information-step">
      <Title headingLevel="h4" size="xl">
        {title}
      </Title>
      <FormTextInput
        ouiaId="name"
        id="name"
        name="displayName"
        label="Behavior group name"
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
  return React.useMemo(
    () => ({
      name: title,
      component: <BasicInformationStep />,
      schema,
    }),
    []
  );
};
