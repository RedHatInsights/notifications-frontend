import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import { FormTextInput } from '../../../utils/insights-common-typescript';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.googleChatForm.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
});
export const IntegrationTypeGoogleChatForm: React.FunctionComponent<IntegrationTypeForm> = (
  props
) => {
  const intl = useIntl();
  return (
    <div className="pf-c-form" {...getOuiaProps('Integrations/Camel/GoogleChat', props)}>
      <FormTextInput
        isRequired={true}
        label={intl.formatMessage(messages.endpointUrl)}
        type="text"
        name="url"
        id="integration-type-camel-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
    </div>
  );
};
