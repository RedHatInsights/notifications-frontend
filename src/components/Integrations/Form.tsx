import { FormSelectOption } from '@patternfly/react-core';
import { Form, FormSelect, FormTextInput, getInsights, OuiaComponentProps, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';

import { Messages } from '../../properties/Messages';
import { maxIntegrationNameLength } from '../../schemas/Integrations/Integration';
import { isStagingOrProd } from '../../types/Environments';
import { IntegrationType, NewUserIntegration } from '../../types/Integration';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { IntegrationTypeForm } from './Form/IntegrationTypeForm';

export const IntegrationsForm: React.FunctionComponent<OuiaComponentProps> = (props) => {

    const { values } = useFormikContext<NewUserIntegration>();
    const insights = getInsights();

    const options = React.useMemo(() => {
        const options = isStagingOrProd(insights) ? [ IntegrationType.WEBHOOK ] : [
            IntegrationType.WEBHOOK,
            IntegrationType.CAMEL
        ];

        return options
        .map(type => (<FormSelectOption key={ type } label={ Messages.components.integrations.integrationType[type] } value={ type } />));
    }, [ insights ]);

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
