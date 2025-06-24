import { FormSelectOption } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import * as React from 'react';

import Config from '../../config/Config';
import { useIntegrations } from '../../hooks/useIntegrations';
import { maxIntegrationNameLength } from '../../schemas/Integrations/Integration';
import { NewUserIntegration } from '../../types/Integration';
import { getOuiaProps, ouiaIdConcat } from '../../utils/getOuiaProps';
import { IntegrationTypeForm } from './Form/IntegrationTypeForm';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';
import {
  Form,
  FormSelect,
  FormTextInput,
} from '../../utils/insights-common-typescript';

export const IntegrationsForm: React.FunctionComponent<OuiaProps> = (props) => {
  const { values } = useFormikContext<NewUserIntegration>();
  const userIntegrations = useIntegrations();

  const options = React.useMemo(() => {
    return userIntegrations.map((type) => (
      <FormSelectOption
        key={type}
        label={Config.integrations.types[type].name}
        value={type}
      />
    ));
  }, [userIntegrations]);

  return (
    <Form {...getOuiaProps('Integrations/Form', props)}>
      <FormTextInput
        maxLength={maxIntegrationNameLength}
        isRequired={true}
        label="Integration name"
        type="text"
        name="name"
        id="name"
        ouiaId={ouiaIdConcat(props.ouiaId, 'name')}
      />
      <FormSelect
        isRequired={true}
        label="Type"
        name="type"
        id="integration-type"
        ouiaId={ouiaIdConcat(props.ouiaId, 'type')}
      >
        {options}
      </FormSelect>
      <IntegrationTypeForm
        type={values.type}
        ouiaId={ouiaIdConcat(props.ouiaId, 'type-form')}
      />
    </Form>
  );
};
