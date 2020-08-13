import * as React from 'react';
import { Form, FormSelect, FormTextInput } from '@redhat-cloud-services/insights-common-typescript';
import { FormSelectOption } from '@patternfly/react-core';
import { useFormikContext } from 'formik';

import { maxIntegrationNameLength } from '../../schemas/Integrations/Integration';
import { IntegrationType, NewIntegration } from '../../types/Integration';
import { IntegrationTypeForm } from './Form/IntegrationTypeForm';
import { Messages } from '../../properties/Messages';

const options = Object.values(IntegrationType)
.map(type => Messages.components.integrations.integrationType[type])
.map(label => (<FormSelectOption key={ label } label={ label }/>));

export const IntegrationsForm: React.FunctionComponent = () => {

    const { values } = useFormikContext<NewIntegration>();

    return (
        <Form>
            <FormTextInput
                maxLength={ maxIntegrationNameLength }
                isRequired={ true }
                label="Integration name"
                type="text"
                name="name"
                id="name"
            />
            <FormSelect isRequired={ true } label="Type" name="type" id="integration-type">
                { options }
            </FormSelect>
            <IntegrationTypeForm type={ values.type } />
        </Form>
    );
};
