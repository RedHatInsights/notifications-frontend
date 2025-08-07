import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import * as React from 'react';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import {
  Checkbox,
  FormTextInput,
} from '../../../utils/insights-common-typescript';

interface IntegrationTypeCamelExtrasForm extends IntegrationTypeForm {
  secretTokenDescription: string;
}

export const IntegrationTypeCamelExtrasForm: React.FunctionComponent<
  IntegrationTypeCamelExtrasForm
> = (props) => {
  return (
    <div
      className="pf-c-form"
      {...getOuiaProps('Integrations/Camel/Splunk', props)}
    >
      <FormTextInput
        isRequired={true}
        label="Endpoint URL"
        type="text"
        name="url"
        id="integration-type-camel-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
      <Checkbox
        id="integration-type-camel-ssl-verification-enabled"
        label="Enable SSL verification"
        name="sslVerificationEnabled"
        ouiaId={ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled')}
      />
      <FormGroup fieldId="integration-type-camel-secret-token">
        <FormTextInput
          isRequired={false}
          label="Secret token"
          id="integration-type-camel-secret-token"
          name="secretToken"
          ouiaId={ouiaIdConcat(props.ouiaId, 'secret-token')}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{props.secretTokenDescription}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </div>
  );
};
