import { Wizard } from '@patternfly/react-core';
import { Form } from 'formik';
import * as React from 'react';

import { BehaviorGroupWizardFooter, BehaviorGroupWizardFooterProps } from './BehaviorGroupWizardFooter';
import { ExtendedWizardStep } from './ExtendedWizardStep';

interface BehaviorGroupWizardProps {
    steps: Array<ExtendedWizardStep>;
    onNext: BehaviorGroupWizardFooterProps['onNext'];
    onBack: BehaviorGroupWizardFooterProps['onBack'];
    onGoToStep: (stepId: number) => void;
    loading: boolean;
}

export const BehaviorGroupWizard: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    return (
        <Form>
            <Wizard
                title="Create behavior group"
                steps={ props.steps }
                footer={ <BehaviorGroupWizardFooter isLoading={ props.loading } onNext={ props.onNext } onBack={ props.onBack }  /> }
                isOpen={ true }
                startAtStep={ 1 }
                onGoToStep={ step => props.onGoToStep(step.id as number ?? 1) }
            />
        </Form>
    );
};
