import { FormTextInput, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeTeamsForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    return (
        <div className="pf-c-form" { ...getOuiaProps('Integrations/Camel/Teams', props) } >
            <FormTextInput
                isRequired={ true }
                label="Endpoint URL"
                type="text"
                name="url"
                id="integration-type-camel-url"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'endpoint-url') }
            />
        </div>
    );
};
