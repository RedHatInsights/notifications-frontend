import * as React from 'react';
import { FormTextInput } from '@redhat-cloud-services/insights-common-typescript';

export const IntegrationTypeHttpForm: React.FunctionComponent = () => {
    return (
        <>
            <FormTextInput
                isRequired={ true }
                label="Endpoint URL"
                type="url"
                name="url"
                id="integration-type-http-url"
            />
        </>
    );
};
