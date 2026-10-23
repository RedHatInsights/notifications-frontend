import {
  FormGroup,
  FormHelperText,
  FormSection,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import { Checkbox, FormTextArea, FormTextInput } from '../../../utils/insights-common-typescript';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.camelForm.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
  enableSslVerification: {
    id: 'integrations.camelForm.enableSslVerification',
    defaultMessage: 'Enable SSL verification',
  },
  secretToken: {
    id: 'integrations.camelForm.secretToken',
    defaultMessage: 'Secret token',
  },
  secretTokenHelper: {
    id: 'integrations.camelForm.secretTokenHelper',
    defaultMessage:
      'The defined secret token is sent as a "X-Insight-Token" header on the request.',
  },
  basicAuth: {
    id: 'integrations.camelForm.basicAuth',
    defaultMessage: 'Basic auth',
  },
  user: {
    id: 'integrations.camelForm.user',
    defaultMessage: 'User',
  },
  password: {
    id: 'integrations.camelForm.password',
    defaultMessage: 'Password',
  },
  extras: {
    id: 'integrations.camelForm.extras',
    defaultMessage: 'Extras',
  },
});

export const IntegrationTypeCamelForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
  const intl = useIntl();
  return (
    <div className="pf-c-form" {...getOuiaProps('Integrations/HttpForm', props)}>
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
          isRequired={false}
          label={intl.formatMessage(messages.secretToken)}
          id="integration-type-camel-secret-token"
          name="secretToken"
          ouiaId={ouiaIdConcat(props.ouiaId, 'secret-token')}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{intl.formatMessage(messages.secretTokenHelper)}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <FormSection title={intl.formatMessage(messages.basicAuth)}>
        <FormTextInput
          id="basic-auth-user"
          name="basicAuth.user"
          label={intl.formatMessage(messages.user)}
          ouiaId={ouiaIdConcat(props.ouiaId, 'basic-auth-user')}
        />
        <FormTextInput
          id="basic-auth-pass"
          name="basicAuth.pass"
          label={intl.formatMessage(messages.password)}
          ouiaId={ouiaIdConcat(props.ouiaId, 'basic-auth-pass')}
        />
      </FormSection>
      <FormTextArea
        id="form-extras"
        name="extras"
        label={intl.formatMessage(messages.extras)}
        ouiaId={ouiaIdConcat(props.ouiaId, 'extras')}
      />
    </div>
  );
};
