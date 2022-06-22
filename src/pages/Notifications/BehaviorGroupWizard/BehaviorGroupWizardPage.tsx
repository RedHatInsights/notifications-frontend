import { ImmutableContainerSet } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { BehaviorGroupWizard } from '../../../components/Notifications/BehaviorGroup/Wizard/BehaviorGroupWizard';
import { Facet } from '../../../types/Notification';
import { useSteps } from './useSteps';
import { Formik } from 'formik';
import { CreateBehaviorGroup } from '../../../types/CreateBehaviorGroup';

interface BehaviorGroupWizardProps {
    bundle: Facet;
    applications: ReadonlyArray<Facet>;
}

const InternalBehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    const [ selectedEventTypes, setSelectedEventTypes ] = React.useState<ImmutableContainerSet<string>>(() => {
        return new ImmutableContainerSet<string>();
    });

    const [ currentStep, setCurrentStep ] = React.useState(0);
    const [ maxStep, setMaxStep ] = React.useState(0);

    console.log('---- current step', currentStep);

    const associateEventTypeStepProps = {
        bundle: props.bundle,
        applications: props.applications,
        selectedEventTypes,
        setSelectedEventTypes
    };

    const steps = useSteps(associateEventTypeStepProps, maxStep);

    const onNext = async (goNext) => {
        console.log('on next');
        const currentStepModel = steps[currentStep];
        console.log('current step id', currentStep);
        console.log('current step model', currentStepModel);
        let shouldGoNext = true;

        if (currentStepModel.isValid) {
            console.log('has valid...');
            shouldGoNext = await currentStepModel.isValid();
            console.log('shouldGoNext', shouldGoNext);
        }

        if (shouldGoNext) {
            setCurrentStep(prev => prev + 1);
            setMaxStep(prev => prev + 1);
            goNext();
        }
    };

    return <BehaviorGroupWizard
        steps={ steps }
        onNext={ onNext }
        onGoToStep={ setCurrentStep }
    />;
};

// move this to an internal component wrapped in the formik context
export const BehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    return (
        <Formik<Partial<CreateBehaviorGroup>>
            onSubmit={ () => { console.log('onsubmit'); } }
            initialValues={ {} }
        >
            <InternalBehaviorGroupWizardPage { ...props } />
        </Formik>
    );
};
