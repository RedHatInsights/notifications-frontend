import { WizardStep } from '@patternfly/react-core';
import * as Yup from 'yup';

export interface ExtendedWizardStep extends WizardStep {
    isValid?: () => Promise<boolean>;
    schema?: Yup.AnySchema;
}

export type CreateWizardStep<T = void> = (arg: T) => ExtendedWizardStep;
