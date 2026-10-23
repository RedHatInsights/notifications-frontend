import { FormGroup, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import { Checkbox, FormTextInput } from '../../../utils/insights-common-typescript';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.httpForm.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
  enableSslVerification: {
    id: 'integrations.httpForm.enableSslVerification',
    defaultMessage: 'Enable SSL verification',
  },
  secretToken: {
    id: 'integrations.httpForm.secretToken',
    defaultMessage: 'Secret token',
  },
  secretTokenHelper: {
    id: 'integrations.httpForm.secretTokenHelper',
    defaultMessage:
      'The defined secret token is sent as a "X-Insight-Token" header on the request.',
  },
});
export const IntegrationTypeHttpForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
  const intl = useIntl();
  return (
    <div className="pf-c-form" {...getOuiaProps('Integrations/HttpForm', props)}>
      <FormTextInput
        isRequired={true}
        label={intl.formatMessage(messages.endpointUrl)}
        type="url"
        name="url"
        id="integration-type-http-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
      <Checkbox
        id="integration-type-http-ssl-verification-enabled"
        label={intl.formatMessage(messages.enableSslVerification)}
        name="sslVerificationEnabled"
        ouiaId={ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled')}
      />
      <FormGroup fieldId="integration-type-http-secret-token">
        <FormTextInput
          isRequired={false}
          label={intl.formatMessage(messages.secretToken)}
          id="integration-type-http-secret-token"
          name="secretToken"
          ouiaId={ouiaIdConcat(props.ouiaId, 'secret-token')}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{intl.formatMessage(messages.secretTokenHelper)}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </div>
  );
};
