import { FormGroup, FormSelectOption, Title } from '@patternfly/react-core';
import {
  Form,
  FormSelect,
  FormTextInput,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import * as Yup from 'yup';

import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';

const title = 'Name and domain';

const productFamilyOptions = [
  { value: '', label: 'Select a product family', isPlaceholder: true },
  { value: 'rhel', label: 'Red Hat Enterprise Linux', isPlaceholder: false },
  { value: 'openshift', label: 'OpenShift', isPlaceholder: false },
  { value: 'console', label: 'Console', isPlaceholder: false },
];

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
      <FormGroup
        label="Product family"
        isRequired
        helperText="Behavior groups can only be applied to services in the same product family."
        fieldId="product-family"
      >
        <FormSelect id="product-family" name="productFamily">
          {productFamilyOptions.map((option) => (
            <FormSelectOption
              key={option.value}
              value={option.value}
              label={option.label}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </FormSelect>
      </FormGroup>
    </Form>
  );
};

export const schema = Yup.object({
  displayName: Yup.string()
    .min(1)
    .max(150, 'Must be 150 characters or less')
    .required('Behavior group name is required'),
  productFamily: Yup.string().required('Product family is required'),
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
