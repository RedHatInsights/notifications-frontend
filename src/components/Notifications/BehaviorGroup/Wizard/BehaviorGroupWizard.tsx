import { Wizard } from '@patternfly/react-core';
import { Form, useFormikContext } from 'formik';
import * as React from 'react';

import { BehaviorGroupWizardFooter, BehaviorGroupWizardFooterProps } from './BehaviorGroupWizardFooter';
import { ExtendedWizardStep } from './ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';

interface BehaviorGroupWizardProps {
    steps: Array<ExtendedWizardStep>;
    onNext: BehaviorGroupWizardFooterProps['onNext'];
    onBack: BehaviorGroupWizardFooterProps['onBack'];
    onClose: () => void;
    onSave: () => void;
    onGoToStep: (stepId: number) => void;
    loading: boolean;
}

export const BehaviorGroupWizard: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    const { values } = useFormikContext<CreateBehaviorGroup>();
    const title = (values.id ? 'Edit' : 'Create') + ' behavior group';

    return (
        <Form>
            <Wizard
                title={ title }
                steps={ props.steps }
                footer={ <BehaviorGroupWizardFooter isLoading={ props.loading } onNext={ props.onNext } onBack={ props.onBack }  /> }
                isOpen={ true }
                startAtStep={ 1 }
                onGoToStep={ step => props.onGoToStep(step.id as number ?? 1) }
                onClose={ props.onClose }
                onSave={ props.onSave }
            />
        </Form>
    );
};
