import { Wizard, WizardProps } from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import * as React from 'react';

import { BehaviorGroupWizardFooter, BehaviorGroupWizardFooterProps } from './BehaviorGroupWizardFooter';
import { ExtendedWizardStep } from './ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';

interface BehaviorGroupWizardProps {
    steps: Array<ExtendedWizardStep>;
    onNext: BehaviorGroupWizardFooterProps['onNext'];
    onGoToStep: (stepId: number) => void;
}

export const BehaviorGroupWizard: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    return (
        <Form>
            <Wizard
                title="Create behavior group"
                steps={ props.steps }
                footer={ <BehaviorGroupWizardFooter isLoading={ false } onNext={ props.onNext }  /> }
                isOpen={ true }
                startAtStep={ 1 }
                onGoToStep={ step => props.onGoToStep(step.id as number ?? 0) }
            />
        </Form>
    );
};
