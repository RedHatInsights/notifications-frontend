import { Title } from '@patternfly/react-core';
import { Form, FormText } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';

const title = 'Review';

const ReviewStep: React.FunctionComponent = () => {
    return (
        <Form ouiaId="review-step">
            <Title
                headingLevel="h2"
                size="xl"
            >
                { title }
            </Title>
            <FormText id="review-name" name="name" label="Name" />
        </Form>
    );
};

export const createReviewStep: CreateWizardStep = () => ({
    name: title,
    component: <ReviewStep />
});
