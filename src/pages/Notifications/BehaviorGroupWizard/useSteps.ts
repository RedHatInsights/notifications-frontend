import { ExtendedWizardStep } from '../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { useActionAndRecipientStep } from './Steps/ActionAndRecipientsStep';
import { AssociateEventTypesStepProps, useAssociateEventTypesStep } from './Steps/AssociateEventTypesStep';
import { useBasicInformationStep } from './Steps/BasicInformationStep';
import { createReviewStep } from './Steps/ReviewStep';

export const useSteps = (associateEventTypeStep: AssociateEventTypesStepProps, cursor: number): Array<ExtendedWizardStep> => {

    const basicInformationStep = useBasicInformationStep();
    const associateEventTypesStep = useAssociateEventTypesStep(associateEventTypeStep);

    return [
        basicInformationStep,
        useActionAndRecipientStep(),
        associateEventTypesStep,
        createReviewStep()
    ].map((step, index) => ({
        ...step,
        id: index,
        canJumpTo: index <= cursor,
        hideCancelButton: false,
        enableNext: true
    }));
};
