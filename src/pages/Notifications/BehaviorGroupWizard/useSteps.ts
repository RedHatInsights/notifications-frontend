import { useMemo } from 'react';

import { ExtendedWizardStep } from '../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { createActionAndRecipientStep } from './Steps/ActionAndRecipientsStep';
import { AssociateEventTypesStepProps, createAssociateEventTypesStep } from './Steps/AssociateEventTypesStep';
import { createBasicInformationStep } from './Steps/BasicInformationStep';
import { createReviewStep } from './Steps/ReviewStep';

export const useSteps = (associateEventTypeStep: AssociateEventTypesStepProps): Array<ExtendedWizardStep> => {

    return useMemo(() => {
        return [
            createBasicInformationStep(),
            createActionAndRecipientStep(),
            createAssociateEventTypesStep(associateEventTypeStep),
            createReviewStep()
        ].map((step, index) => ({
            ...step,
            id: index
        }));
    }, [ associateEventTypeStep ]);
};
