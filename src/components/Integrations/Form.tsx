import { FormSelectOption } from '@patternfly/react-core';
import {
    Form,
    FormSelect,
    FormTextInput,
    OuiaComponentProps,
    ouiaIdConcat
} from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';

import { Messages } from '../../properties/Messages';
import { maxIntegrationNameLength } from '../../schemas/Integrations/Integration';
import { IntegrationType, NewUserIntegration } from '../../types/Integration';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { IntegrationTypeForm } from './Form/IntegrationTypeForm';

const options = [ IntegrationType.WEBHOOK ]
.map(type => Messages.components.integrations.integrationType[type])
.map(label => (<FormSelectOption key={ label } label={ label } />));

export const IntegrationsForm: React.FunctionComponent<OuiaComponentProps> = (props) => {

    const { values } = useFormikContext<NewUserIntegration>();

    return (
        <Form { ...getOuiaProps('Integrations/Form', props) }>
            <FormTextInput
                maxLength={ maxIntegrationNameLength }
                isRequired={ true }
                label="Integration name"
                type="text"
                name="name"
                id="name"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'name') }
            />
            <FormSelect
                isRequired={ true }
                label="Type"
                name="type"
                id="integration-type"
                ouiaId={ ouiaIdConcat(props.ouiaId, 'type') }
            >
                { options }
            </FormSelect>
            <IntegrationTypeForm
                type={ values.type }
                ouiaId={ ouiaIdConcat(props.ouiaId, 'type-form') }
            />
        </Form>
    );
};
