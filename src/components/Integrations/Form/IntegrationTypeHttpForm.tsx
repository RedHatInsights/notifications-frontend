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

export const IntegrationTypeHttpForm: React.FunctionComponent<
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
        type="url"
        name="url"
        id="integration-type-http-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
      <Checkbox
        id="integration-type-http-ssl-verification-enabled"
        label="Enable SSL verification"
        name="sslVerificationEnabled"
        ouiaId={ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled')}
      />
      <FormGroup fieldId="integration-type-http-secret-token">
        <FormTextInput
          isRequired={false}
          label="Secret token"
          id="integration-type-http-secret-token"
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
    </div>
  );
};
