import {
  FormTextInput,
  ouiaIdConcat,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeSlackForm: React.FunctionComponent<IntegrationTypeForm> =
  (props) => {
    return (
      <div
        className="pf-c-form"
        {...getOuiaProps('Integrations/Camel/Slack', props)}
      >
        <FormTextInput
          isRequired={true}
          label="Endpoint URL"
          type="text"
          name="url"
          id="integration-type-camel-url"
          ouiaId={ouiaIdConcat(props.ouiaId, 'endpoint-url')}
        />
        <FormTextInput
          isRequired={true}
          label="Channel"
          type="text"
          name="extras.channel"
          id="integration-type-slack-channel"
          ouiaId={ouiaIdConcat(props.ouiaId, 'extras.channel')}
        />
      </div>
    );
  };
