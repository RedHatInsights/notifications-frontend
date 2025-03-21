import { WizardStep } from '@patternfly/react-core/deprecated';
import * as Yup from 'yup';

export interface ExtendedWizardStep extends WizardStep {
  isValid?: () => Promise<boolean>;
  schema?: Yup.AnySchema;
}

export type IntegrationWizardStep<T = void> = (arg: T) => ExtendedWizardStep;
