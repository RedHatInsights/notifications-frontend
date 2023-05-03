import { FormGroup } from '@patternfly/react-core';
import { Checkbox, FormTextInput, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { IntegrationType } from '../../../types/Integration';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { IntegrationTypeForm } from './IntegrationTypeForm';

export const IntegrationTypeHttpForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    return (
        <div className="pf-c-form" { ...getOuiaProps('Integrations/HttpForm', props) } >
            <FormTextInput
                isRequired={ true }
                label="Endpoint URL"
                type="url"
                name="url"
                id="integration-type-http-url"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'endpoint-url') }
            />
            <Checkbox
                id="integration-type-http-ssl-verification-enabled"
                label="Enable SSL verification"
                name="sslVerificationEnabled"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'is-ssl-verification-enabled') }
            />
            { props.type !== IntegrationType.ANSIBLE &&
                <FormGroup fieldId='integration-type-http-secret-token'
                    helperText='The defined secret token is sent as a "X-Insight-Token" header on the request.'>
                    <FormTextInput
                        isRequired={ false }
                        label="Secret token"
                        id="integration-type-http-secret-token"
                        name="secretToken"
                        ouiaId={ ouiaIdConcat(props.ouiaId, 'secret-token') }
                    />
                </FormGroup>
            }
        </div>
    );
};
