import {
  FormGroup,
  FormHelperText,
  FormSection,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import {
  Checkbox,
  FormTextArea,
  FormTextInput,
  ouiaIdConcat,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeCamelForm: React.FunctionComponent<
  IntegrationTypeForm
> = (props) => {
  return (
    <div
      className="pf-c-form"
      {...getOuiaProps('Integrations/HttpForm', props)}
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
            <HelperTextItem>
              The defined secret token is sent as a &quot;X-Insight-Token&quot;
              header on the request.
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <FormSection title="Basic auth">
        <FormTextInput
          id="basic-auth-user"
          name="basicAuth.user"
          label="User"
          ouiaId={ouiaIdConcat(props.ouiaId, 'basic-auth-user')}
        />
        <FormTextInput
          id="basic-auth-pass"
          name="basicAuth.pass"
          label="Password"
          ouiaId={ouiaIdConcat(props.ouiaId, 'basic-auth-pass')}
        />
      </FormSection>
      <FormTextArea
        id="form-extras"
        name="extras"
        label="Extras"
        ouiaId={ouiaIdConcat(props.ouiaId, 'extras')}
      />
    </div>
  );
};
