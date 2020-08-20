import * as React from 'react';
import { FormTextInput, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeHttpForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    return (
        <div { ...getOuiaProps('Integrations/HttpForm', props) } >
            <FormTextInput
                isRequired={ true }
                label="Endpoint URL"
                type="url"
                name="url"
                id="integration-type-http-url"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'endpoint-url') }
            />
        </div>
    );
};
