import { Title } from '@patternfly/react-core';
import { Form, FormTextInput } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';

import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';

const title = 'Name and description';

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

export const useBasicInformationStep: CreateWizardStep = () => {
    const s = useFormikContext<CreateWizardStep>();
    console.log('formik context', s);

    const isValid = async () => {
        return !!s.values.name;
    };

    return {
        name: title,
        component: <BasicInformationStep />,
        isValid
    };
};
