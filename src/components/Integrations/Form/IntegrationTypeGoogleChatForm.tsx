import * as React from 'react';

import { getOuiaProps, ouiaIdConcat } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';
import { FormTextInput } from '../../../utils/insights-common-typescript';

export const IntegrationTypeGoogleChatForm: React.FunctionComponent<
  IntegrationTypeForm
> = (props) => {
  return (
    <div
      className="pf-c-form"
      {...getOuiaProps('Integrations/Camel/GoogleChat', props)}
    >
      <FormTextInput
        isRequired={true}
        label="Endpoint URL"
        type="text"
        name="url"
        id="integration-type-camel-url"
        ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
      />
    </div>
  );
};
