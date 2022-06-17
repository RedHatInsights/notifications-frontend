import { WizardStep } from '@patternfly/react-core';

export interface ExtendedWizardStep extends WizardStep {
    placeholder?: boolean;
}

export type CreateWizardStep<T = void> = (arg: T) => ExtendedWizardStep;
