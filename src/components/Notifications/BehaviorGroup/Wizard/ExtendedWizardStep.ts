import { WizardStep } from '@patternfly/react-core';

export interface ExtendedWizardStep extends WizardStep {
    isValid?: () => Promise<boolean>;
}

export type CreateWizardStep<T = void> = (arg: T) => ExtendedWizardStep;
