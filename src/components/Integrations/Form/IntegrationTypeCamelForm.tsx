import { Checkbox, FormTextInput, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeCamelForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    return (
//         <!-- this should be a dropdown -->
        <div className="pf-c-form" { ...getOuiaProps('Integrations/HttpForm', props) } >
            <FormTextInput
                isRequired={ true }
                label="Type"
                type="text"
                name="sub_type"
                id="integration-type-camel-type"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'endpoint-type') }
            />
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
            <FormTextInput
                isRequired={ false }
                label="Secret token"
                id="integration-type-camel-secret-token"
                name="secretToken"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'secret-token') }
            />
/*
            TODO add BasicAuthentication here
            TODO add extras here
 */
        </div>
    );
};
