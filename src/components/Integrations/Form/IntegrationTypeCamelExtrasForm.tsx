import { FormGroup, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import { Checkbox, FormTextInput } from '../../../utils/insights-common-typescript';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.camelExtrasForm.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
  enableSslVerification: {
    id: 'integrations.camelExtrasForm.enableSslVerification',
    defaultMessage: 'Enable SSL verification',
  },
  secretToken: {
    id: 'integrations.camelExtrasForm.secretToken',
    defaultMessage: 'Secret token',
  },
});

interface IntegrationTypeCamelExtrasForm extends IntegrationTypeForm {
  secretTokenDescription: string;
  secretTokenLabel?: string;
  secretTokenRequired?: boolean;
}

export const IntegrationTypeCamelExtrasForm: React.FunctionComponent<
  IntegrationTypeCamelExtrasForm
> = (props) => {
  const intl = useIntl();
  return (
    <div className="pf-c-form" {...getOuiaProps('Integrations/Camel/Splunk', props)}>
      <FormTextInput
        isRequired={true}
        label={intl.formatMessage(messages.endpointUrl)}
        type="text"
        name="url"
        id="integration-type-camel-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
      <Checkbox
        id="integration-type-camel-ssl-verification-enabled"
        label={intl.formatMessage(messages.enableSslVerification)}
        name="sslVerificationEnabled"
        ouiaId={ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled')}
      />
      <FormGroup fieldId="integration-type-camel-secret-token">
        <FormTextInput
          isRequired={props.secretTokenRequired ?? false}
          label={props.secretTokenLabel ?? intl.formatMessage(messages.secretToken)}
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
