import { useMemo } from 'react';

import { ExtendedWizardStep } from '../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { createActionAndRecipientStep } from './Steps/ActionAndRecipientsStep';
import { AssociateEventTypesStepProps, useAssociateEventTypesStep } from './Steps/AssociateEventTypesStep';
import { useBasicInformationStep } from './Steps/BasicInformationStep';
import { createReviewStep } from './Steps/ReviewStep';

export const useSteps = (associateEventTypeStep: AssociateEventTypesStepProps, cursor: number): Array<ExtendedWizardStep> => {

    return useMemo(() => {
        return [
            useBasicInformationStep(),
            createActionAndRecipientStep(),
            useAssociateEventTypesStep(associateEventTypeStep),
            createReviewStep()
        ].map((step, index) => ({
            ...step,
            id: index,
            canJumpTo: index <= cursor,
            hideCancelButton: false,
            enableNext: true
        }));
    }, [ associateEventTypeStep, cursor ]);
};
