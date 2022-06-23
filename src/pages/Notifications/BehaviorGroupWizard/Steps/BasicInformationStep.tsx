import { Title } from '@patternfly/react-core';
import { Form, FormTextInput } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';

const title = 'Name';

const BasicInformationStep: React.FunctionComponent = () => {
    return (
        <Form ouiaId="basic-information-step">
            <Title
                headingLevel="h4"
                size="xl"
            >
                { title }
            </Title>
            <FormTextInput
                ouiaId="name"
                id="name"
                name="name"
                label="Behavior group name"
                isRequired
            />
        </Form>
    );
};

const schema = Yup.object({
    name: Yup.string().min(1)
});

export const useBasicInformationStep: CreateWizardStep = () => {
    const { values } = useFormikContext<CreateWizardStep>();

    const isValid = async () => {
        return !!values.name;
    };

    return {
        name: title,
        component: <BasicInformationStep />,
        isValid,
        schema
    };
};
