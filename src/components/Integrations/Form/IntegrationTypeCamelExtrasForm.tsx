import { FormGroup } from '@patternfly/react-core';
import { Checkbox, FormTextArea, FormTextInput, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeCamelExtrasForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    return (
        <div className="pf-c-form" { ...getOuiaProps('Integrations/Camel/Splunk', props) } >
            <FormTextInput
                isRequired={ true }
                label="Endpoint URL"
                type="text"
                name="url"
                id="integration-type-camel-url"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'endpoint-url') }
            />
            <Checkbox
                id="integration-type-camel-ssl-verification-enabled"
                label="Enable SSL verification"
                name="sslVerificationEnabled"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled') }
            />
            <FormGroup fieldId='integration-type-camel-secret-token'
                helperText="The defined secret token is sent as a Splunk's HTTP Event Collector token.">
                <FormTextInput
                    isRequired={ false }
                    label="Secret token"
                    id="integration-type-camel-secret-token"
                    name="secretToken"
                    ouiaId={ ouiaIdConcat(props.ouiaId, 'secret-token') }
                />
            </FormGroup>
            <FormTextArea id="form-extras" name="extras" label="Extras" ouiaId={ ouiaIdConcat(props.ouiaId, 'extras') } />
        </div>
    );
};
